//app\admin\page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

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
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6 text-black">Admin Dashboard</h1>

        <div className="flex flex-col gap-4">
          <Link href="/admin/products" className="underline text-blue-400">
            Manage Products
          </Link>

          <Link href="/admin/orders" className="underline text-blue-400">
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
