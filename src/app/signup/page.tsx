//src\app\signup\page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Signup failed");
      return;
    }

    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#e9dfd2] flex items-center justify-center px-6">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-black">Create your account</h1>

        <form onSubmit={handleSignup} className="w-full flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-black/30 rounded-lg px-4 py-3 bg-transparent text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-black/30 rounded-lg px-4 py-3 pr-12 bg-transparent text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
            >
              {showPassword ? "🐵" : "🙈"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </main>
  );
}
