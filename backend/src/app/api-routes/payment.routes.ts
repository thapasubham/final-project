import { Router } from "express";
import PaymentController from "../controller/payment.controller";
import PaymentService from "../service/payment.service";
import {
  checkAlreadyPurchased,
  fontExists,
  userExists,
} from "../middleware/payment.middleware";

const router = Router();
const service = new PaymentService();
const controller = new PaymentController(service);
router.post(
  "/create-payment-intent",
  userExists as any,
  fontExists as any,
  checkAlreadyPurchased as any,
  controller.createPaymentIntent
);

router.post("/webhook", controller.webhook); // Stripe webhook

export const payment = router;
