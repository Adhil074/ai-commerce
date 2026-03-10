"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Suggestion = {
  id: string;
  name: string;
  imageUrl: string;
};

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchParamsString = searchParams.toString();

  const currentSearch = searchParams.get("search") ?? "";

  const [query, setQuery] = useState(currentSearch);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  /*
  ---------------------------------------
  URL SEARCH UPDATE (SERVER FILTER)
  ---------------------------------------
  */

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       const params = new URLSearchParams(searchParamsString);

  //       if (query) {
  //         params.set("search", query);
  //       } else {
  //         params.delete("search");
  //       }

  //       router.replace(`/products?${params.toString()}`);
  //     }, 500);

  //     return () => clearTimeout(timer);
  //   }, [query, router, searchParamsString]);

  useEffect(() => {
    if (pathname !== "/products") return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsString);

      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }

      router.replace(`/products?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, router, searchParamsString, pathname]);

  /*
  ---------------------------------------
  SEARCH SUGGESTIONS (DROPDOWN)
  ---------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /*
  ---------------------------------------
  MANUAL SEARCH BUTTON
  ---------------------------------------
  */

  function handleSearch() {
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setSuggestions([]);
  }

  return (
    <div className="relative max-w-md w-full">
      {/* SEARCH INPUT */}
      <div className="flex rounded-full border-2 border-blue-500 overflow-hidden bg-white">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full outline-none text-sm px-5 py-2"
        />

        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 px-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="18"
            className="fill-white"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z" />
          </svg>
        </button>
      </div>

      {/* SUGGESTION DROPDOWN */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-md mt-2 z-50">
          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSuggestions([]);
                router.push(`/product/${item.id}`);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
