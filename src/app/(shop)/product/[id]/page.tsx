import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";
import ProductMatchChecker from "@/components/ProductMatchChecker";
import WishlistButton from "@/components/wishlist-button";
import { WishlistProvider } from "@/context/wishlist-context";
import ProductGallery from "@/components/ProductGallary";
interface PageProps {
  params:Promise< {
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 bg-white">
      <div className="grid md:grid-cols-2 gap-10">
        {/* LEFT COLUMN (image + thumbnails) */}
        <div>
          <ProductGallery
            images={product.images}
            fallback={product.imageUrl ?? "/products/fallback.jpg"}
            name={product.name}
          />
        </div>

        {/* RIGHT COLUMN (details) */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-black">{product.name}</h1>

          <p className="text-gray-600 mt-4">{product.description}</p>

          <p className="text-2xl font-semibold mt-6 text-black">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(product.price)}
          </p>

          <p className="mt-2">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          {/* Review Intelligence */}
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
              🪑 Comfort Mentions:{" "}
              {product.comfortMentionPct?.toFixed(2) ?? "0"}%
            </p>

            <p className="font-semibold">
              🔁 Return Risk: {product.returnRiskPct?.toFixed(2) ?? "0"}%
            </p>
          </div>

          <WishlistProvider>
            <div className="flex items-center gap-3 mt-6">
              <AddToCartButton
                productId={product.id}
                disabled={product.stock === 0}
              />

              <WishlistButton productId={product.id} />
            </div>
          </WishlistProvider>

          <ProductMatchChecker productId={product.id} />
        </div>
      </div>
    </main>
  );
}
