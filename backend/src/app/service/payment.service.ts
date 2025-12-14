import { Payment } from "../../entity/payment.js";
import { Font, UserFont } from "../../entity/font.js";
import { User } from "../../entity/user.js";
import StripeService from "../service/stripe.service.js";
import AppDataSource from "../../data-source.js";
import { PaymentStatus } from "../../types/payment.types.js";
import Stripe from "stripe";
const userFontRepo = AppDataSource.getRepository(UserFont);

const paymentRepo = AppDataSource.getRepository(Payment);
const fontRepo = AppDataSource.getRepository(Font);

export default class PaymentService {
  private stripe = new StripeService();

  // Create a Stripe payment intent and save a pending record
  async createPaymentIntent(data: { userID: number; fontId: number }) {
    const { userID, fontId } = data;

    const font = await fontRepo.findOne({ where: { id: fontId } });
    if (!font) throw new Error("Font not found");

    const amountCents = Math.round(font.price * 100);

    const intent = await this.stripe.createPaymentIntent(
      amountCents,
      userID,
      fontId
    );
    const payment = paymentRepo.create({
      stripePaymentId: intent.id,
      amount: font.price,
      status: PaymentStatus.PENDING,
      user: { id: userID } as User,
      font: { id: fontId } as Font,
    });

    await paymentRepo.save(payment);

    return { clientSecret: intent.client_secret };
  }

  // Handle Stripe webhook events

  async handleWebhook(req: any) {
    const signature = req.headers["stripe-signature"] as string;

    const event = this.stripe.constructEvent(req.body, signature);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = Number(paymentIntent.metadata?.userId);
        const fontId = Number(paymentIntent.metadata?.fontId);
        console.log(fontId);
        if (!userId || !fontId) {
          console.error("Missing metadata in Stripe payment intent");
          return;
        }

        await paymentRepo.update(
          { stripePaymentId: paymentIntent.id },
          { status: PaymentStatus.SUCCESS }
        );

        await userFontRepo.save({
          user: { id: userId },
          font: { id: fontId },
        });

        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const result = await paymentRepo.update(
          { stripePaymentId: paymentIntent.id },
          { status: PaymentStatus.FAILED }
        );

        console.log(
          `Payment failed for ${paymentIntent.id}, update result:`,
          result
        );
        break;
      }

      default:
        console.log("Unhandled Stripe event:", event.type);
    }
  }
}
