//components\AddToCartButton.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  disabled: boolean;
}

export default function AddToCartButton({ productId, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

      const data: { error?: string } = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Failed to add to cart");
        return;
      }

      router.push("/cart");
    } catch {
      alert("Network error");
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