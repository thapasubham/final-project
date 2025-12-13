import { loadStripe, Stripe } from "@stripe/stripe-js";

export const API_URL = import.meta.env.VITE_BASE_URL;
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Initialize Stripe once
let stripePromise: Promise<Stripe | null> | null = null;
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY); // no await here
  }
  return stripePromise;
};
