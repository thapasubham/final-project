import {CheckoutProvider, PaymentElement} from '@stripe/react-stripe-js/checkout';
import {loadStripe} from '@stripe/stripe-js';
import { useMemo } from 'react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51SakC0DutoXHECeqW4eDcyBpF8qck9fIwTlPaQ6M2vSlS5LTj3T6rnddFwMvNS3uu6AH1dlUZobZff77ofZEk8gU00LIw27RFv');


const CheckoutForm = () => {
  return (
    <form>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
};


export default function PaymentAdd() {
  const promise = useMemo(() => {
    return fetch('/create-checkout-session', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  return (
    <CheckoutProvider stripe={stripePromise} options={{clientSecret: promise}}>
      <CheckoutForm />
    </CheckoutProvider>
  );
}