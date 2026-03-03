//app\product\[id]\page.tsx

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
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
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

        {/* Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-gray-600 mt-4">{product.description}</p>

          <p className="text-2xl font-semibold mt-6">
            ${product.price.toFixed(2)}
          </p>

          <p className="mt-2">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          {/* Review Intelligence Section */}
          <div className="mt-6 space-y-1 text-sm text-gray-700 border-t pt-4">
            <p>
              ⭐ Average Rating: {product.averageRating?.toFixed(2) ?? "0.00"}
            </p>

            <p>
              👍 Positive Reviews: {product.positivePercent?.toFixed(2) ?? "0"}%
            </p>

            <p>
              📏 Size Complaints: {product.sizeComplaintPct?.toFixed(2) ?? "0"}%
            </p>

            <p>
              🛠 Durability Issues: {product.durabilityPct?.toFixed(2) ?? "0"}%
            </p>

            <p>
              🪑 Comfort Mentions: {product.comfortMentionPct?.toFixed(2) ?? "0"}%
            </p>

            <p className="font-semibold">
              🔁 Return Risk: {product.returnRiskPct?.toFixed(2) ?? "0"}%
            </p>
          </div>

          <AddToCartButton
            productId={product.id}
            disabled={product.stock === 0}
          />
        </div>
      </div>
    </main>
  );
}