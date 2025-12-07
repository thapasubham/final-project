import { Request, Response } from "express";
import Stripe from "stripe";
import express from "express";

const stripe = new Stripe("sk_test_51SakC0DutoXHECeqGMAvveu5g7UJ4rgZZHyCJohTId1gcbuiNSV54RT0VBChxh6FJIYYBSupwmhqYpGsu0dSrSKt00jv8RmVwd");
const route = express.Router();

route.post("/create_intent", async (req: Request, res: Response) => {
  const { amount } = req.body;

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
