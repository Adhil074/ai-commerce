import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // 🔐 Secure access check
  if (order.userId !== session.user.id) {
    redirect("/orders");
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 text-black">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <div className="mb-6 border p-4 rounded">
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Total:</strong> ${order.total}
        </p>
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Items</h2>

      {order.items.map((item) => (
        <div key={item.id} className="flex justify-between border-b py-4">
          <div>
            <p>{item.product.name}</p>
            <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
          </div>

          <div>${item.price * item.quantity}</div>
        </div>
      ))}
    </main>
  );
}
