import { Request, Response } from "express";
import Stripe from "stripe";
import express from "express";

const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY
const stripe = new Stripe(STRIPE_PRIVATE_KEY);
const route = express.Router();

route.post("/create_intent", async (req: Request, res: Response) => {
  const { amount } = req.body;
  console.log(STRIPE_PRIVATE_KEY)
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 500, // default $5
      currency: "usd",
      payment_method_types: ["card"],
      
    });
    console.log(paymentIntent)
    res.json({ client_secret: paymentIntent.client_secret });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
export const payment = route;
