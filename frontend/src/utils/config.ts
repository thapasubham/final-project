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

export const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#fff", // text color
      fontSize: "16px",
      fontFamily: "Roboto, sans-serif",
      "::placeholder": { color: "#888" },
      iconColor: "#00bfff", // change card icon color
      lineHeight: "1.5",
      backgroundColor: "#1a1a1a", // subtle dark background
      padding: "12px 14px",
    },
    invalid: {
      color: "#ff6b6b",
      iconColor: "#ff6b6b",
    },
    complete: {
      iconColor: "#4caf50", // green check when valid
    },
  },
  hidePostalCode: true, // cleaner for many apps
};
