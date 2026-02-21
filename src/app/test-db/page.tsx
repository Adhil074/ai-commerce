import { prisma } from "@/lib/prisma";

export default async function TestDBPage() {
  const products = await prisma.product.findMany();

  return (
    <div>
      <h1>Products</h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}