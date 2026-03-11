//app\admin\products\new\page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        description,
      }),
    });

    if (!res.ok) {
      alert("Failed to add product");
      return;
    }

    router.push("/admin/products");
  }

  return (
    <main className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="Name"
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Price"
          type="number"
          className="border p-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          placeholder="Stock"
          type="number"
          className="border p-2"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <input
          placeholder="Image URL"
          className="border p-2"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-black text-white p-2"
        >
          Save
        </button>
      </form>
    </main>
  );
}