import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getStripe, CARD_ELEMENT_OPTIONS, API_URL } from "../../utils/config"; // your config
import { Box, Button, Typography, Paper, Alert, CircularProgress } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";

const CheckoutForm = ({ fontId, userId }: { fontId: number; userId: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fontId, userID: userId }),
      });

      const data = await res.json();

      if (res.status === 201) {
        const { clientSecret } = data;

        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

        if (paymentResult.error) {
          setMessage(paymentResult.error.message || "Payment failed");
        } else if (paymentResult.paymentIntent?.status === "succeeded") {
          setMessage("Payment successful!");
          setPaymentStatus("succeeded");
        }
      } else {
        setMessage(`Error: ${data.error}`);
        console.log(data)

      }
    } catch (err) {
      setMessage("Something went wrong. Please try again., ");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: "100%", bgcolor: "#1a1a1a" }}>
      <Typography variant="h5" gutterBottom color="white">
        Secure Checkout
      </Typography>

      <Box
        sx={{
          p: 2,
          border: "1px solid #444",
          borderRadius: 2,
          bgcolor: "black",
          mb: 3,
        }}
      >
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={!stripe || loading || paymentStatus === "succeeded"}
        onClick={handleSubmit}
        sx={{ py: 1.5, fontWeight: "bold" }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Pay Now"}
      </Button>

      {message && (
        <>
          <Box sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
            <Alert
              severity={message.includes("successful") ? "success" : "error"}
              sx={{ mt: 3 }}
            >
              {message}
            </Alert>
            <Typography color="white" sx={{
              alignItems: "center",
              textAlign: "center"
            }}>Go To Purchase to download</Typography>
            <Box sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}>
              <Button
                fullWidth
                onClick={() => navigate("/")}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  py: 1.5,

                }}
              >
                Home
              </Button>
              <Button
                fullWidth
                onClick={() => navigate(`/user/${userId}/purchases`)}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  py: 1.5,

                }}
              >
                My Purchases
              </Button>
            </Box>
          </Box>
        </>)}
    </Paper>
  );
};

const PaymentAdd = () => {
  const { search } = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(search), [search]);
  const { isLogged, userID } = useAuth();
  const fontId = Number(queryParams.get("fontId"));
  const userId = userID;
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);
  const stripePromise = getStripe();

  if (!isLogged)
    return (
      <CircularProgress />)

  if (!fontId || !userId) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        color="white"
      >
        <Typography>Invalid payment details. Please go back and try again.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Elements stripe={stripePromise}>
        <CheckoutForm fontId={fontId} userId={userId} />
      </Elements>
    </Box>
  );
};

export default PaymentAdd;
