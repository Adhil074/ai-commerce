// //app\checkout\place-order-button.tsx

// "use client";

// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
// );

// export default function PlaceOrderButton() {
//   const [loading, setLoading] = useState(false);

//   async function handleOrder() {
//     try {
//       setLoading(true);

//       const res = await fetch("/api/create-payment-intent", {
//         method: "POST",
//       });

//       if (!res.ok) {
//         alert("Failed to initiate payment");
//         return;
//       }

//       const data: { clientSecret: string } = await res.json();

//       const stripe = await stripePromise;

//       if (!stripe || !data.clientSecret) {
//         alert("Stripe not ready");
//         return;
//       }

//       const result = await stripe.confirmCardPayment(data.clientSecret, {
//         payment_method: {
//           card: {
//             token: "tok_visa",
//           },
//         },
//       });

//       if (result.error) {
//         alert("Payment failed");
//         return;
//       }

//       window.location.href = "/order-success";
//     } catch {
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <button
//       onClick={handleOrder}
//       disabled={loading}
//       className="mt-6 bg-black text-white px-6 py-3 rounded-md hover:opacity-90 disabled:opacity-50"
//     >
//       {loading ? "Processing..." : "Pay Now"}
//     </button>
//   );
// }


"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./payment-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export default function PlaceOrderButton() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleStartPayment() {
    setLoading(true);

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
    });

    if (!res.ok) {
      alert("Failed to initiate payment");
      setLoading(false);
      return;
    }

    const data: { clientSecret: string } = await res.json();
    setClientSecret(data.clientSecret);
    setLoading(false);
  }

  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm clientSecret={clientSecret} />
      </Elements>
    );
  }

  return (
    <button
      onClick={handleStartPayment}
      disabled={loading}
      className="mt-6 bg-black text-white px-6 py-3 rounded-md hover:opacity-90 disabled:opacity-50"
    >
      {loading ? "Preparing..." : "Pay Now"}
    </button>
  );
}