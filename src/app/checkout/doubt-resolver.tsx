"use client";

import { useState } from "react";

interface Props {
  productId: string;
}

export default function DoubtResolver({ productId }: Props) {
  const [doubt, setDoubt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    const trimmed = doubt.trim();

    if (!trimmed) return;

    if (trimmed.length > 250) {
      setAnswer("Please keep your question under 250 characters.");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      const res = await fetch("/api/ai/doubt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          doubt: trimmed,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(data.error ?? "Something went wrong.");
      }
    } catch {
      setAnswer("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-2">
        Have a doubt before checkout?
      </h3>

      <textarea
        value={doubt}
        onChange={(e) => setDoubt(e.target.value)}
        maxLength={250}
        placeholder="Ask about size, durability, regret..."
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleResolve}
        disabled={loading || !doubt.trim()}
        className="mt-3 bg-[#e9dfd2] text-black px-4 py-2 rounded disabled:opacity-50 hover:bg-[#dfd4c6] transition"
      >
        {loading ? "Checking..." : "Resolve Doubt"}
      </button>

      {answer && (
        <div className="mt-4 p-3 border text-black rounded bg-gray-50 text-sm">
          {answer}
        </div>
      )}
    </div>
  );
}
