// export default function OrderSuccessPage() {
//   return (
//     <main className="min-h-screen flex items-center justify-center bg-white">
//       <h1 className="text-2xl text-black font-bold">
//         Congratulations! Order placed successfully🎉
//       </h1>
//     </main>
//   );
// }


"use client";

import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl text-black font-bold text-center">
          Congratulations! Order placed successfully 🎉
        </h1>

        <button
          onClick={() => router.replace("/")}
          className="bg-[#e9dfd2] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#dfd4c6] transition"
        >
          Go to Home
        </button>
      </div>
    </main>
  );
}
