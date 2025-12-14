import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

export default class StripeService {
  async createPaymentIntent(amount: number, userID: number, fontId: number) {
    return await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: userID.toString(),
        fontId: fontId.toString(),
      },
    });
  }

  constructEvent(payload: Buffer, signature: string) {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK!
    );
  }
}
