import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/products");
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex flex-col gap-4">
        <a href="/admin/products" className="underline">
          Manage Products
        </a>

        <a href="/admin/orders" className="underline">
          View Orders
        </a>
      </div>
    </main>
  );
}