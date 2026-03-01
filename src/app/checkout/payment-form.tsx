"use client";

import { FormEvent, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

export default function PaymentForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const card = elements.getElement(CardElement);
    if (!card) {
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
      },
    });

    if (result.error) {
      alert(result.error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/order-success";
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-white">
      <div className="p-4 border text-white rounded-md">
        {/* <CardElement /> */}
        <CardElement
          options={{
            style: {
              base: {
                color: "#ffffff",
                fontSize: "16px",
                "::placeholder": {
                  color: "#aaaaaa",
                },
              },
              invalid: {
                color: "#ff6b6b",
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-md hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
