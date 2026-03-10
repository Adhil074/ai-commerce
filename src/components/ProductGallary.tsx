"use client";

import { useState } from "react";
import Image from "next/image";

type ImageType = {
  id: string;
  url: string;
};

export default function ProductGallery({
  images,
  fallback,
  name,
}: {
  images: ImageType[];
  fallback: string;
  name: string;
}) {
  const [selected, setSelected] = useState(
    images?.[0]?.url ?? fallback
  );

  const imageList =
    images.length > 0 ? images.map((i) => i.url) : [fallback];

  return (
    <div>
      {/* BIG IMAGE */}
      <div className="relative w-full h-125 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={selected}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 mt-4">
        {imageList.map((url) => (
          <button
            key={url}
            onClick={() => setSelected(url)}
            className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
              selected === url
                ? "border-black"
                : "border-transparent"
            }`}
          >
            <Image
              src={url}
              alt="Product image"
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}