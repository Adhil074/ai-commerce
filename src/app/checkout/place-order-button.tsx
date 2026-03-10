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
      className="mt-6 bg-[#e9dfd2] text-black px-6 py-3 rounded-md hover:bg-[#dfd4c6] transition disabled:opacity-50"
    >
      {loading ? "Preparing..." : "Pay Now"}
    </button>
  );
}
