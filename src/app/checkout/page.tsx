//app\checkout\page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PlaceOrderButton from "@/app/checkout/place-order-button";


export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const total = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Order Summary</h1>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex justify-between border-b py-4"
        >
          <span>
            {item.product.name} × {item.quantity}
          </span>
          <span>
            ${item.product.price * item.quantity}
          </span>
        </div>
      ))}

      <div className="flex justify-between mt-6 text-xl font-bold">
        <span>Total</span>
        <span>${total}</span>
      </div>

      <PlaceOrderButton />
    </main>
  );
}