"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SimpleBanner = {
  _id: string;
  title?: string;
  description?: string;
  link?: string;
  imagePath?: string;
};

export default function BannerCarousel({ banners }: { banners: SimpleBanner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const b = banners[index];

  return (
    <section aria-label="Hero banner" className="relative h-96 md:h-125 overflow-hidden">
      {b.imagePath && (
        <Image src={b.imagePath} alt={b.title || "Banner"} fill className="object-cover" priority />
      )}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex items-center px-6 lg:px-8">
        <div className="max-w-2xl text-white">
          <h2 className="text-3xl md:text-5xl font-semibold mb-3">{b.title}</h2>
          {b.description && <p className="text-lg text-white/90 mb-6">{b.description}</p>}
          {b.link && (
            <a href={b.link} className="button-primary bg-white px-5 py-3">
              Learn more
            </a>
          )}
        </div>
      </div>

      {/* Controls */}
      {banners.length > 1 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)} className="rounded-full bg-white/20 p-2 hover:bg-white/30">
            ‹
          </button>
        </div>
      )}

      {banners.length > 1 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button onClick={() => setIndex((i) => (i + 1) % banners.length)} className="rounded-full bg-white/20 p-2 hover:bg-white/30">
            ›
          </button>
        </div>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button key={idx} onClick={() => setIndex(idx)} className={`h-2 w-8 rounded-full ${idx === index ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
      )}
    </section>
  );
}
