import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const wishlist = await prisma.wishlist.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-black mb-8">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.product.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition p-4"
            >
              <div className="relative w-full aspect-square mb-4">
                {item.product.imageUrl ? (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
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
                {item.product.name}
              </h2>

              <p className="text-gray-600 mt-2">
                ${item.product.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}