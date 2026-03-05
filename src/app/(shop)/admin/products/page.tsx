//app\admin\products\page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/products");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <Link
        href="/admin/products/new"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add Product
      </Link>

      <div className="mt-6 space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 flex justify-between"
          >
            <span>{product.name}</span>

            <Link
              href={`/admin/products/${product.id}`}
              className="underline"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}