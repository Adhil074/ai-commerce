import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}
export const dynamic = "force-dynamic";
export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative w-full h-125 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl ?? "/products/fallback.jpg"}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-gray-600 mt-4">{product.description}</p>

          <p className="text-2xl font-semibold mt-6">${product.price}</p>

          <p className="mt-2">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          {/* <button
            className="mt-6 bg-black text-white px-6 py-3 rounded-md hover:opacity-90 disabled:opacity-50"
            disabled={product.stock === 0}
          >
            Add to Cart
          </button> */}
          <AddToCartButton
            productId={product.id}
            disabled={product.stock === 0}
          />
        </div>
      </div>
    </main>
  );
}
