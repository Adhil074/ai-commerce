//src\app\login\page.tsx

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      alert("Invalid credentials");
      return;
    }

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#e9dfd2] flex items-center justify-center px-6">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-black">Welcome back</h1>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-black/30 rounded-lg px-4 py-3 bg-transparent text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-black/30 rounded-lg px-4 py-3 bg-transparent text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
