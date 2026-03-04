//app\admin\products\[id]\edit-product-form.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  description: string;
}

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? "");
  const [description, setDescription] = useState(product.description);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        stock,
        imageUrl,
        description,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Update failed");
      return;
    }

    router.push("/admin/products");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
        required
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border p-2"
        required
      />

      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
        className="border p-2"
        required
      />

      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border p-2"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white p-2"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
