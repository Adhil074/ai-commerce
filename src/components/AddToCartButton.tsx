"use client";

import { useState } from "react";

interface Props {
  productId: string;
  disabled: boolean;
}

export default function AddToCartButton({ productId, disabled }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    try {
      setLoading(true);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      alert("Added to cart");
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled || loading}
      className="mt-6 bg-black text-white px-6 py-3 rounded-md hover:opacity-90 disabled:opacity-50"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}