import { Request, Response } from "express";
import PaymentService from "../service/payment.service";
import { responseType, ResponseApi } from "../../utils/ApiResponse";

export default class PaymentController {
  service: PaymentService;

  constructor(service: PaymentService) {
    this.service = service;
  }

  createPaymentIntent = async (req: Request, res: Response) => {
    try {
      const { userID, fontId } = req.body;
      const result = await this.service.createPaymentIntent({ userID, fontId });

      console.log(result);
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
      console.log("hello");

      await this.service.handleWebhook(req);
      res.status(200).json({ received: true });
    } catch (err) {
      res.status(400).json({ error: "Webhook Error" });
    }
  };
}
