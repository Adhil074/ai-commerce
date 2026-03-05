"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";

interface Props {
  productId: string;
}

export default function WishlistButton({ productId }: Props) {
  const { wishlist, setWishlist } = useWishlist();
  const [loading, setLoading] = useState(false);

  const wishlisted = wishlist.includes(productId);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    try {
      if (wishlisted) {
        await fetch(`/api/wishlist/${productId}`, {
          method: "DELETE",
        });

        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        setWishlist((prev) => [...prev, productId]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className="absolute top-2 right-2 p-1 z-10"
    >
      <Heart
        className={`w-5 h-5 ${
          wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
        }`}
      />
    </button>
  );
}