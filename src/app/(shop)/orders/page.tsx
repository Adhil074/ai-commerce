import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // return (
  //   <main className="max-w-4xl mx-auto px-6 py-10 text-black">
  //     <h1 className="text-2xl font-bold mb-6">My Orders</h1>

  //     {orders.length === 0 && (
  //       <p className="text-gray-500">You have no orders yet.</p>
  //     )}

  //     {orders.map((order) => (
  return (
  <main className="min-h-screen bg-white px-6 py-10 text-black">
    {orders.length === 0 ? (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-600">You have no orders yet.</p>
      </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6 max-w-4xl mx-auto">
            My Orders
          </h1>
  
          <div className="max-w-4xl mx-auto">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 mb-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">Order ID</p>
                  <p className="text-sm text-gray-500">{order.id}</p>
  
                  <p className="mt-2">
                    Status:{" "}
                    <span className="font-medium">{order.status}</span>
                  </p>
  
                  <p>Total: ${order.total}</p>
                </div>
  
                <Link
                  href={`/orders/${order.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}