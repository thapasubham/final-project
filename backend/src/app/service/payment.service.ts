import { Payment } from "../../entity/payment.js";
import { Font } from "../../entity/font.js";
import { User } from "../../entity/user.js";
import StripeService from "../service/stripe.service.js";
import AppDataSource from "../../data-source.js";
import { PaymentStatus } from "../../types/payment.types.js";

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
    console.log(intent)
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
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        await this.markSuccess(paymentIntent.id);
        break;

      case "payment_intent.payment_failed":
        const failedIntent = event.data.object;
        await this.markFailed(failedIntent.id);
        break;

      default:
        console.log("Unhandled event:", event.type);
    }
  }
async createCheckoutSession(data: { userId: number; fontId: number }) {
  const font = await fontRepo.findOne({ where: { id: data.fontId } });
  if (!font) throw new Error("Font not found");

  const session = await this.stripe.createCheckoutSession(
    font.name,
    Math.round(font.price * 100),
    `${process.env.URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    `${process.env.URL}/payment-cancel`
  );

  // Save pending payment in DB
  await paymentRepo.save(
    paymentRepo.create({
      stripePaymentId: session.id,
      amount: font.price,
      status: PaymentStatus.PENDING,
      user: { id: data.userId } as User,
      font: { id: font.id } as Font,
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
