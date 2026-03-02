import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const session = await auth();

  // If already logged in → go to products
  if (session?.user?.id) {
    redirect("/products");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Welcome to AI Commerce</h1>

      <div className="flex gap-4">
        <Link
          href="/signup"
          className="bg-black text-white px-6 py-3 rounded-md"
        >
          Sign Up
        </Link>

        <Link href="/login" className="border px-6 py-3 rounded-md">
          Sign In
        </Link>
      </div>
    </main>
  );
}
