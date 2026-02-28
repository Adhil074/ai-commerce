"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-3xl font-bold mb-4">
        Something went wrong
      </h2>

      <p className="text-gray-600 mb-6">
        An unexpected error occurred.
      </p>

      <button
        onClick={() => reset()}
        className="bg-black text-white px-6 py-3 rounded-md hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}