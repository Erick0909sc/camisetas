"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  team: string;
  price: string;
  imageFront: string;
  imageBack?: string | null;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);

  const images = [
    product.imageFront,
    ...(product.imageBack ? [product.imageBack] : []),
  ];

  const currentPrice = Number(product.price);

  // Por ahora el precio anterior será fijo.
  // Más adelante podremos manejarlo desde el Admin.
  const oldPrice = 150;

  const discount =
    oldPrice > currentPrice
      ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
      : 0;

  const savings = Math.max(oldPrice - currentPrice, 0);

  const nextImage = () => {
    setImageIndex((current) => (current + 1) % images.length);
  };

  const previousImage = () => {
    setImageIndex((current) => (current - 1 + images.length) % images.length);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGEN */}
      <Link href={`/productos/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
          {/* OFERTA */}
          {discount > 0 && (
            <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
              <span className="bg-red-600 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white">
                OFERTA
              </span>

              <span className="bg-black px-3 py-1.5 text-xs font-black text-white">
                -{discount}%
              </span>
            </div>
          )}

          <Image
            src={images[imageIndex]}
            alt={product.name}
            fill
            className="object-contain p-6 transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* SLIDER */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Imagen anterior"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  previousImage();
                }}
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-black shadow-md transition hover:bg-black hover:text-white"
              >
                ‹
              </button>

              <button
                type="button"
                aria-label="Siguiente imagen"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-black shadow-md transition hover:bg-black hover:text-white"
              >
                ›
              </button>

              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/80 px-2 py-1 backdrop-blur-sm">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === imageIndex ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Link>

      {/* INFORMACIÓN */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {product.team}
        </p>

        <Link href={`/productos/${product.id}`}>
          <h2 className="mt-2 min-h-[56px] text-lg font-bold leading-snug text-black transition group-hover:underline">
            {product.name}
          </h2>
        </Link>

        {/* PRECIOS */}
        <div className="mt-4">
          {discount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">
                S/ {oldPrice.toFixed(2)}
              </span>

              <span className="text-xs font-semibold uppercase text-gray-500">
                Antes
              </span>
            </div>
          )}

          <div className="mt-1 flex items-end gap-3">
            <p className="text-2xl font-black text-black">
              S/ {currentPrice.toFixed(2)}
            </p>

            {discount > 0 && (
              <span className="mb-1 text-xs font-bold uppercase text-red-600">
                Precio oferta
              </span>
            )}
          </div>

          {savings > 0 && (
            <p className="mt-1 text-sm font-semibold text-green-700">
              Ahorras S/ {savings.toFixed(2)}
            </p>
          )}
        </div>

        {/* BOTÓN */}
        <Link
          href={`/productos/${product.id}`}
          className="mt-5 flex w-full items-center justify-center bg-black px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-gray-800"
        >
          Ver camisetas
          <span className="ml-2 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
