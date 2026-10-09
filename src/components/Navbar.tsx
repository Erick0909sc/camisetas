"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      {/* BARRA PRINCIPAL */}
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          className="text-xl font-black tracking-tight text-black sm:text-2xl"
        >
          CAMISETAS
        </Link>

        {/* =======================
            DESKTOP
        ======================= */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-black transition hover:text-gray-500"
          >
            Inicio
          </Link>

          <Link
            href="/productos"
            className="text-sm font-medium text-black transition hover:text-gray-500"
          >
            Camisetas
          </Link>

          {/* <Link
            href="/nosotros"
            className="text-sm font-medium text-black transition hover:text-gray-500"
          >
            Nosotros
          </Link> */}

          <Link
            href="/carrito"
            className="relative text-xl"
            aria-label="Carrito"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* =======================
            MOBILE
        ======================= */}
        <div className="flex items-center gap-3 md:hidden">
          {/* CARRITO */}
          <Link
            href="/carrito"
            className="relative text-xl"
            aria-label="Carrito"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* HAMBURGUESA */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
            aria-label="Menú"
          >
            <span
              className={`block h-[2px] w-6 bg-black transition ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />

            <span
              className={`block h-[2px] w-6 bg-black transition ${
                menuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block h-[2px] w-6 bg-black transition ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* =======================
          MENÚ DESPLEGABLE MOBILE
      ======================= */}

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-[1500px] flex-col px-4 py-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="border-b border-gray-100 py-4 text-sm font-bold uppercase tracking-wide text-black"
            >
              Inicio
            </Link>

            <Link
              href="/productos"
              onClick={() => setMenuOpen(false)}
              className="border-b border-gray-100 py-4 text-sm font-bold uppercase tracking-wide text-black"
            >
              Camisetas
            </Link>

            {/* <Link
              href="/nosotros"
              onClick={() => setMenuOpen(false)}
              className="py-4 text-sm font-bold uppercase tracking-wide text-black"
            >
              Nosotros
            </Link> */}
          </nav>
        </div>
      )}
    </header>
  );
}
