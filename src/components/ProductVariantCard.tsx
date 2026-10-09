"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Variant = {
  id: number;
  player: string | null;
  number: number | null;
  size: string;
  stock: number;
  imageBack: string | null;
};

type ProductVariantCardProps = {
  variant: Variant;
  productId: number;
  productName: string;
  team: string;
  price: string;
  productImage: string;
};

export default function ProductVariantCard({
  variant,
  productId,
  productName,
  team,
  price,
  productImage,
}: ProductVariantCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const hasDorsal = Boolean(variant.player || variant.number);
  const image = variant.imageBack || productImage;

  const currentPrice = Number(price);
  const oldPrice = 120;

  const discount =
    oldPrice > currentPrice
      ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
      : 0;

  const savings = Math.max(oldPrice - currentPrice, 0);

  const handleAddToCart = () => {
    addToCart({
      productId,
      variantId: variant.id,
      name: productName,
      team,
      player: variant.player,
      number: variant.number,
      size: variant.size,
      price: currentPrice,
      image,
      quantity: 1,
      stock: variant.stock,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGEN */}
      <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
        {discount > 0 && (
          <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
            <span className="bg-red-600 px-3 py-1.5 text-xs font-black uppercase text-white">
              OFERTA
            </span>

            <span className="bg-black px-3 py-1.5 text-xs font-black text-white">
              -{discount}%
            </span>
          </div>
        )}

        <Image
          src={image}
          alt={
            hasDorsal
              ? `${variant.player || productName} ${variant.number ? `#${variant.number}` : ""}`
              : productName
          }
          fill
          className="object-contain p-7 transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* INFORMACIÓN */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {team}
        </p>

        <h2 className="mt-2 text-xl font-black text-black">
          {hasDorsal ? variant.player || productName : productName}
        </h2>

        {hasDorsal && variant.number && (
          <p className="mt-1 text-sm font-medium text-gray-500">
            Dorsal #{variant.number}
          </p>
        )}

        {/* TALLA */}
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Talla
          </p>

          <div className="mt-2 inline-flex min-w-12 items-center justify-center border-2 border-black px-4 py-2 text-sm font-black text-black">
            {variant.size}
          </div>
        </div>

        {/* PRECIO */}
        <div className="mt-5">
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

          <div className="mt-1 flex flex-wrap items-end gap-3">
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

        {/* STOCK */}
        <div className="mt-5 border-t border-gray-100 pt-4">
          {variant.stock <= 0 ? (
            <p className="text-sm font-bold text-red-600">Agotado</p>
          ) : variant.stock === 1 ? (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />

              <p className="text-sm font-bold text-orange-600">Última unidad</p>
            </div>
          ) : variant.stock <= 3 ? (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />

              <p className="text-sm font-bold text-orange-600">
                Solo quedan {variant.stock}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600" />

              <p className="text-sm font-semibold text-green-700">Disponible</p>
            </div>
          )}
        </div>

        {/* CARRITO */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={variant.stock <= 0}
          className={`mt-5 flex w-full items-center justify-center px-4 py-3.5 text-sm font-black uppercase tracking-wide text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 ${
            added ? "bg-green-600" : "bg-black hover:bg-gray-800"
          }`}
        >
          {variant.stock <= 0
            ? "AGOTADO"
            : added
              ? "✓ AGREGADO"
              : "AGREGAR AL CARRITO →"}
        </button>
      </div>
    </article>
  );
}
