import { Router } from "express";
import PaymentController from "../controller/payment.controller";
import PaymentService from "../service/payment.service";

const router = Router();
const service = new PaymentService()
const controller = new PaymentController(service);

router.post("/create-payment-intent", controller.createPaymentIntent);
router.post("/create-checkout-session", controller.createCheckoutSession);

router.post("/webhook", controller.webhook); // Stripe webhook

export  const payment = router;
