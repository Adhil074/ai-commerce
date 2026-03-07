//app\(shop)\products\page.tsx

import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WishlistProvider } from "@/context/wishlist-context";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }
  const params = await searchParams;
  const search = params?.search ?? "";
  const products = await prisma.product.findMany({
    where: search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : undefined,
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">All Products</h1>

          {search && (
            <p className="text-gray-500 mt-1">
              Showing results for &quot;{search}&quot;
            </p>
          )}
        </div>

        <p className="text-sm text-gray-500">{products.length} items</p>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <WishlistProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-black/5"
              >
                <div className="relative w-full aspect-square mb-3 overflow-hidden bg-gray-100 rounded-lg flex items-center justify-center">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-contain"
                    />
                  ) : (
                    <div className="h-full bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                <h2 className="font-semibold text-lg text-black">
                  {product.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </WishlistProvider>
      )}
    </main>
  );
}
