"use client";

import { useState } from "react";

interface Props {
  productId: string;
}

interface MatchResponse {
  score: number;
  reasons: string[];
  explanation: string;
  cached?: boolean;
}

export default function ProductMatchChecker({ productId }: Props) {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck(): Promise<void> {
    if (!input.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          userNeeds: input,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }

      const data = (await res.json()) as MatchResponse;
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">
        Check if this product matches your needs
      </h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your needs (max 300 characters)..."
        maxLength={300}
        className="w-full border p-3 rounded-md"
      />

      <button
        onClick={handleCheck}
        disabled={loading}
        className="mt-4 bg-black text-white px-6 py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Checking..." : "Check Match"}
      </button>

      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}

      {result && (
        <div className="mt-6 space-y-3">
          <p className="text-lg font-semibold">
            Match Score: {result.score}%
          </p>

          <ul className="list-disc ml-6">
            {result.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>

          <p className="mt-3 text-gray-700">
            {result.explanation}
          </p>

          {result.cached && (
            <p className="text-xs text-gray-400">
              (cached result)
            </p>
          )}
        </div>
      )}
    </div>
  );
}