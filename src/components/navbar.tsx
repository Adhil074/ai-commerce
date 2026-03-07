//components\navbar.tsx

"use client";

import Link from "next/link";
import { ShoppingCart, MoreVertical, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import SearchBar from "@/components/search-bar";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full border-b bg-[#e9dfd2]">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        {/* Brand */}
        <Link href="/products" className="text-lg font-semibold text-black font-serif">
          ShopIQ
        </Link>
        {/* Search */}
        <div className="flex-1 flex text-black justify-center px-6 max-w-lg">
          <SearchBar />
        </div>

        {/* Right side */}
        <div ref={menuRef} className="flex items-center gap-6 text-gray-700 relative">
          {/* Cart */}
          <Link href="/cart">
            <ShoppingCart className="w-6 h-6" />
          </Link>

          <Link href="/wishlist" className="relative">
            <Heart className="w-6 h-6 text-gray-700 hover:text-red-500 transition" />
          </Link>

          {/* Menu */}
          <button onClick={() => setOpen(!open)} className="p-1">
            <MoreVertical className="w-6 h-6" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-10 w-40 border bg-white shadow-md rounded-md flex flex-col">
              <Link
                href="/orders"
                onClick={() => setOpen(false)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                My Orders
              </Link>

              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="text-left px-4 py-2 text-black hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
