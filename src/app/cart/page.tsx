"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setCart(data.data ?? []);
    } catch {
      console.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }

  //   useEffect(() => {
  //     fetchCart();
  //   }, []);
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("/api/cart");

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setCart(data.data ?? []);
      } catch {
        console.error("Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [router]);

  async function updateQuantity(cartItemId: string, quantity: number) {
    try {
      setUpdatingId(cartItemId);

      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });

      if (!res.ok) {
        alert("Failed to update quantity");
        return;
      }

      await fetchCart();
    } catch {
      alert("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  }

  async function removeItem(cartItemId: string) {
    try {
      setUpdatingId(cartItemId);

      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId }),
      });

      if (!res.ok) {
        alert("Failed to remove item");
        return;
      }

      await fetchCart();
    } catch {
      alert("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <p>Loading cart...</p>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
      </main>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-b py-4"
        >
          <div>
            <p className="font-semibold">{item.product.name}</p>
            <p className="text-gray-600">
              ${item.product.price} × {item.quantity}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1 || updatingId === item.id}
                className="px-3 py-1 border rounded"
              >
                -
              </button>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={
                  item.quantity >= item.product.stock || updatingId === item.id
                }
                className="px-3 py-1 border rounded"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item.id)}
                disabled={updatingId === item.id}
                className="px-3 py-1 border rounded text-red-600"
              >
                Remove
              </button>
            </div>
          </div>

          <p className="font-semibold">${item.product.price * item.quantity}</p>
        </div>
      ))}

      <div className="flex justify-between mt-6 text-xl font-bold">
        <span>Total</span>
        <span>${total}</span>
      </div>

      <button
        onClick={() => router.push("/checkout")}
        className="mt-6 bg-black text-white px-6 py-3 rounded-md hover:opacity-90"
      >
        Proceed to Checkout
      </button>
    </main>
  );
}
