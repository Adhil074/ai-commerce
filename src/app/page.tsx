import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/products");
  }

  return (
    <main className="min-h-screen bg-[#e9dfd2] flex items-center justify-center px-6">
      <div className="max-w-2xl text-center flex flex-col items-center gap-6">
        <h1 className="text-6xl font-bold font-serif text-black tracking-tight">
          ShopIQ
        </h1>

        <p className="text-m font-style: italic text-gray-800 font-medium">
          Buy smarter with AI
        </p>

        <div className="flex gap-6 mt-2">
          <Link
            href="/signup"
            className="bg-black text-white px-7 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="border border-black px-7 py-3 rounded-lg font-medium hover:bg-white transition text-black"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
