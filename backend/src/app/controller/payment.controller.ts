import { Request, Response } from "express";
import PaymentService from "../service/payment.service";
import { responseType, ResponseApi } from "../../utils/ApiResponse";

export default class PaymentController {
  
  service: PaymentService;

  constructor(service: PaymentService) {
    this.service = service;
  }

createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const result = await this.service.createCheckoutSession(req.body);
    console.log(result)
    res.json(result); // returns { url: session.url }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
  createPaymentIntent = async (req: Request, res: Response) => {
    try {
      const result = await this.service.createPaymentIntent(req.body);

      console.log(result)
      const response: responseType<{ clientSecret: string }> = {
        status: 201,
        message: "Payment Intent Created",
        data: { clientSecret: result.clientSecret },
      };

      ResponseApi.WriteResponse(res, response);
    } catch (err: any) {
      const response: responseType<null> = {
        status: 400,
        message: err.message || "Failed to create payment intent",
      };

      ResponseApi.WriteResponse(res, response);
    }
  };

  webhook = async (req: Request, res: Response) => {
    try {
      await this.service.handleWebhook(req);

      const response: responseType<null> = {
        status: 200,
        message: "Webhook processed successfully",
      };

      ResponseApi.WriteResponse(res, response);
    } catch (err: any) {
      const response: responseType<null> = {
        status: 400,
        message: "Webhook failed",
      };

      ResponseApi.WriteResponse(res, response);
    }
  };
}
