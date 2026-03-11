import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderStatusForm from "@/app/(shop)/admin/orders/order-status-form";
export const dynamic = "force-dynamic";
export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  type Order = (typeof orders)[number];
  type OrderItem = Order["items"][number];

  return (
    <main className="max-w-5xl mx-auto py-10 text-black">
      <h1 className="text-3xl font-bold mb-8 ">Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      <div className="space-y-6">
        {orders.map((order: Order) => (
          <div key={order.id} className="border p-4 rounded">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>User:</strong> {order.user.email}
            </p>
            <p>
              <strong>Total:</strong> ${order.total}
            </p>
            <div>
              <strong>Status:</strong>
              <OrderStatusForm
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>
            <p>
              <strong>Date:</strong> {order.createdAt.toDateString()}
            </p>

            <div className="mt-4">
              <strong>Items:</strong>
              <ul className="list-disc ml-6">
                {order.items.map((item: OrderItem) => (
                  <li key={item.id}>
                    {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
