"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface WishlistContextType {
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    async function loadWishlist() {
      const res = await fetch("/api/wishlist");
      const data = await res.json();

      const ids = data.map((item: { productId: string }) => item.productId);

      setWishlist(ids);
    }

    loadWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}