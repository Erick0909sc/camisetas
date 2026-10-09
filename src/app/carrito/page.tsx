"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CarritoPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalPrice,
  } = useCart();
  const handleWhatsApp = () => {
    const phoneNumber = "51904145112"; // CAMBIA POR TU NÚMERO

    const productsMessage = cart
      .map((item, index) => {
        const dorsal = item.player
          ? `${item.player}${item.number ? ` #${item.number}` : ""}`
          : "Sin dorsal";

        return `${index + 1}. ${item.name}
Equipo: ${item.team}
Modelo: ${dorsal}
Talla: ${item.size}
Cantidad: ${item.quantity}
Precio unitario: S/ ${item.price.toFixed(2)}
Subtotal: S/ ${(item.price * item.quantity).toFixed(2)}`;
      })
      .join("\n\n");

    const message = `Hola 👋, quiero realizar el siguiente pedido:

${productsMessage}

-------------------------
TOTAL: S/ ${totalPrice.toFixed(2)}

¿Me podrían confirmar la disponibilidad?`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">🛒</div>

            <h1 className="text-3xl font-black text-black">
              TU CARRITO ESTÁ VACÍO
            </h1>

            <p className="mt-3 text-gray-500">
              Agrega una camiseta para comenzar tu pedido.
            </p>

            <Link
              href="/productos"
              className="mt-7 inline-block rounded-xl bg-black px-7 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              VER CAMISETAS
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Tu pedido
          </p>

          <h1 className="mt-2 text-4xl font-black text-black">CARRITO</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Productos */}
          <div className="space-y-4">
            {cart.map((item) => (
              <article
                key={`${item.productId}-${item.variantId}`}
                className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row"
              >
                {/* Imagen */}
                <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-44">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-3"
                    sizes="176px"
                  />
                </div>

                {/* Información */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {item.team}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-black">
                      {item.name}
                    </h2>

                    {item.player ? (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          Jugador:{" "}
                          <span className="font-semibold">{item.player}</span>
                        </p>

                        {item.number && (
                          <p>
                            Dorsal:{" "}
                            <span className="font-semibold">
                              #{item.number}
                            </span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm font-medium text-gray-600">
                        Sin dorsal
                      </p>
                    )}

                    <p className="mt-2 text-sm text-gray-600">
                      Talla: <span className="font-semibold">{item.size}</span>
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    {/* Cantidad */}
                    <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.productId, item.variantId)
                        }
                        className="px-4 py-2 font-bold text-black transition hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="min-w-10 text-center font-semibold text-black">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.productId, item.variantId)
                        }
                        disabled={item.quantity >= item.stock}
                        className="px-4 py-2 font-bold text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-black">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.productId, item.variantId)
                        }
                        className="mt-1 text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Resumen */}
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">Resumen del pedido</h2>

            <div className="mt-6 space-y-3 border-b border-gray-200 pb-6">
              {cart.map((item) => (
                <div
                  key={`summary-${item.productId}-${item.variantId}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="text-gray-600">
                    {item.quantity} × {item.name}
                  </span>

                  <span className="font-semibold text-black">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-6">
              <span className="text-lg font-semibold text-black">Total</span>

              <span className="text-2xl font-black text-black">
                S/ {totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full rounded-xl bg-green-600 px-5 py-4 font-bold text-white transition hover:bg-green-700"
            >
              COMPRAR POR WHATSAPP
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Vaciar carrito
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
