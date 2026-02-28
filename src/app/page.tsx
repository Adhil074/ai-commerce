import Link from "next/link";
import Image from "next/image";
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data.data;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl text-black font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="bg-white rounded-lg shadow hover:shadow-md transition p-4"
          >
            {/* <div className="relative h-40 w-full mb-4"> */}
            <div className="relative w-full aspect-square">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="h-full bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
            </div>
            <h2 className="font-semibold text-black text-lg">{product.name}</h2>
            <p className="text-gray-600 mt-2">${product.price}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
