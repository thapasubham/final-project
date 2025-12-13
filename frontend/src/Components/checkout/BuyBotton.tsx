import axios from "axios";

export function BuyButton({ fontId }: { fontId: number }) {
    const handleBuy = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3000/payments/checkout",
                {
                    fontId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // Redirect user to Stripe Checkout
            window.location.href = res.data.url;
        } catch (err) {
            alert("Payment failed");
        }
    };

    return <button onClick={handleBuy}>Buy Font</button>;
}
