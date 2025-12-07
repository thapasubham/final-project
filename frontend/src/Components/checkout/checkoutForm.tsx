import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// Assuming this path is correct
import { API_URL } from "../../utils/config"; 

// --- Configuration ---
// Note: Replace this with your actual publishable key in a real application
const STRIPE_PK = "pk_test_51SakC0DutoXHECeqW4eDcyBpF8qck9fIwTlPaQ6M2vSlS5LTj3T6rnddFwMvNS3uu6AH1dlUZobZff77ofZEk8gU00LIw27RFv";
const stripePromise = loadStripe(STRIPE_PK);

// --- Stripe Element Styling Options ---
// This is critical for ensuring the CardElement (an iframe) looks clean and standard.
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#f9f9f9", // Light color for dark theme
      fontFamily: "inherit",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Use a constant for the amount
  const AMOUNT_TO_PAY = 500000; // $5.00 in cents

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      // 1. Request Payment Intent Client Secret from Backend
      const res = await fetch(`${API_URL}/api/payment/create_intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: AMOUNT_TO_PAY }),
      });
      
      // Check for non-200 status codes from the API
      if (!res.ok) {
        throw new Error("Failed to create payment intent on server.");
      }
      
      const data = await res.json();
      const clientSecret = data.client_secret;

      // 2. Confirm Payment on the Frontend
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      // 3. Handle Result
      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment successful! Thank you.");
      }
    } catch (error) {
      console.error("Payment Submission Error:", error);
      setMessage(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-[#1a1a1a] rounded-xl shadow-lg w-full max-w-sm">
      <h2 className="text-xl font-semibold mb-4 text-white">Secure Checkout</h2>
      
      {/* Container for CardElement to control its width and layout */}
      <div className="p-3 border border-gray-600 rounded-lg bg-black">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <button 
        type="submit" 
        disabled={!stripe || loading} 
        className="mt-6 w-full py-3 text-lg font-bold rounded-xl transition duration-200 
                   bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Pay $${(AMOUNT_TO_PAY / 100).toFixed(2)}`}
      </button>

      {message && <p className={`mt-4 text-center ${message.includes("successful") ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
    </form>
  );
};

const PaymentAdd = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </div>
);

export default PaymentAdd;