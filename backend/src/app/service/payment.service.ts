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

    const intent = await this.stripe.createPaymentIntent(amountCents);
    console.log(intent);
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
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const paymentIntentId = session.payment_intent as string;
        const userId = Number(session.metadata?.userId);
        const fontId = Number(session.metadata?.fontId);

        if (!userId || !fontId) {
          throw new Error("Missing metadata in Stripe session");
        }

        // 1️⃣ Mark payment as SUCCESS
        await paymentRepo.update(
          { stripePaymentId: paymentIntentId },
          { status: PaymentStatus.SUCCESS }
        );

        // 2️⃣ Grant font ownership
        await userFontRepo.save({
          user: { id: userId },
          font: { id: fontId },
        });

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;

        await paymentRepo.update(
          { stripePaymentId: session.payment_intent as string },
          { status: PaymentStatus.FAILED }
        );

        break;
      }

      default:
        console.log("Unhandled Stripe event:", event.type);
    }
  }
  async createCheckoutSession(data: { userId: number; fontId: number }) {
    const font = await fontRepo.findOne({ where: { id: data.fontId } });
    if (!font) throw new Error("Font not found");

    const session = await this.stripe.createCheckoutSession(
      font.name,
      Math.round(font.price * 100),
      `${process.env.URL}/payment-success`,
      `${process.env.URL}/payment-cancel`,
      {
        userId: data.userId,
        fontId: data.fontId,
      }
    );

    await paymentRepo.save(
      paymentRepo.create({
        stripePaymentId: session.payment_intent as string,
        amount: font.price,
        status: PaymentStatus.PENDING,
        user: { id: data.userId } as User,
        font: { id: data.fontId } as Font,
      })
    );

    return { url: session.url };
  }

  // Mark payment as successful
  async markSuccess(stripePaymentId: string) {
    const payment = await paymentRepo.findOne({ where: { stripePaymentId } });
    if (!payment) throw new Error("Payment not found");

    payment.status = PaymentStatus.SUCCESS;
    await paymentRepo.save(payment);
  }

  // Mark payment as failed
  async markFailed(stripePaymentId: string) {
    const payment = await paymentRepo.findOne({ where: { stripePaymentId } });
    if (!payment) throw new Error("Payment not found");

    payment.status = PaymentStatus.FAILED;
    await paymentRepo.save(payment);
  }
}
