// //app\products\page.tsx

// import Link from "next/link";
// import Image from "next/image";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl: string | null;
// }

// async function getProducts(): Promise<Product[]> {
//   const res = await fetch("/api/products", {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch products");
//   }

//   const data = await res.json();
//   return data.data;
// }

// export default async function ProductsPage() {
//   const session = await auth();
//   if (!session?.user?.id) {
//     redirect("/");
//   }

//   const products = await getProducts();

//   return (
//     <main className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-3xl text-black font-bold mb-8">Products</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.map((product) => (
//           <Link
//             key={product.id}
//             href={`/product/${product.id}`}
//             className="bg-white rounded-lg shadow hover:shadow-md transition p-4"
//           >
//             {/* <div className="relative h-40 w-full mb-4"> */}
//             <div className="relative w-full aspect-square">
//               {product.imageUrl ? (
//                 <Image
//                   src={product.imageUrl}
//                   alt={product.name}
//                   fill
//                   className="object-contain"
//                 />
//               ) : (
//                 <div className="h-full bg-gray-200 flex items-center justify-center rounded">
//                   <span className="text-gray-500 text-sm">No Image</span>
//                 </div>
//               )}
//             </div>
//             <h2 className="font-semibold text-black text-lg">{product.name}</h2>
//             <p className="text-gray-600 mt-2">${product.price}</p>
//           </Link>
//         ))}
//       </div>
//     </main>
//   );
// }


import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const products = await prisma.product.findMany({
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
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-black mb-8">
        Products
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition p-4"
            >
              <div className="relative w-full aspect-square mb-4">
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
                    <span className="text-gray-500 text-sm">
                      No Image
                    </span>
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
      )}
    </main>
  );
}