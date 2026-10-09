"use client";

import { FormEvent, useState } from "react";

type Variant = {
  player: string;
  number: string;
  size: string;
  stock: string;
  imageBack: string;
};
const handleLogout = async () => {
  await fetch("/api/admin/logout", {
    method: "POST",
  });

  window.location.href = "/admin/login";
};
export default function AdminPage() {
  const [hasDorsal, setHasDorsal] = useState(false);

  const [normalSize, setNormalSize] = useState("");
  const [normalStock, setNormalStock] = useState("1");

  const [variants, setVariants] = useState<Variant[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        player: "",
        number: "",
        size: "",
        stock: "1",
        imageBack: "",
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string,
  ) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleDorsalChange = (checked: boolean) => {
    setHasDorsal(checked);

    if (checked && variants.length === 0) {
      setVariants([
        {
          player: "",
          number: "",
          size: "",
          stock: "1",
          imageBack: "",
        },
      ]);
    }

    if (!checked) {
      setVariants([]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    setLoading(true);
    setMessage("");

    const formData = new FormData(form);

    const productVariants = hasDorsal
      ? variants
          .filter(
            (variant) =>
              variant.size.trim() !== "" && variant.stock.trim() !== "",
          )
          .map((variant) => ({
            player: variant.player,
            number: variant.number,
            size: variant.size,
            stock: variant.stock,
            imageBack: variant.imageBack,
          }))
      : [
          {
            player: "",
            number: "",
            size: normalSize,
            stock: normalStock,
            imageBack: "",
          },
        ];

    if (!hasDorsal && !normalSize) {
      setMessage("Selecciona una talla para la camiseta.");
      setLoading(false);
      return;
    }

    if (hasDorsal && productVariants.length === 0) {
      setMessage("Agrega al menos una variante con talla y stock.");
      setLoading(false);
      return;
    }

    const data = {
      name: formData.get("name"),
      team: formData.get("team"),
      description: formData.get("description"),
      price: formData.get("price"),
      category: formData.get("category"),
      imageFront: formData.get("imageFront"),
      imageBack: formData.get("imageBack"),
      variants: productVariants,
    };

    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al crear producto");
      }

      setMessage("Producto creado correctamente.");

      form.reset();

      setHasDorsal(false);
      setNormalSize("");
      setNormalStock("1");
      setVariants([]);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-1 focus:ring-black";

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 text-black sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Panel de administración
          </p>

          <h1 className="text-3xl font-bold text-black">Agregar producto</h1>

          <p className="mt-2 text-gray-600">
            Registra una camiseta con o sin dorsal.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Información general */}
          <section className="border-b border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-black">
                Información general
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Datos principales de la camiseta.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Nombre del producto
                </label>

                <input
                  name="name"
                  required
                  type="text"
                  placeholder="Ej. Real Madrid 2025/26"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-black">
                    Equipo
                  </label>

                  <input
                    name="team"
                    required
                    type="text"
                    placeholder="Ej. Real Madrid"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-black">
                    Categoría
                  </label>

                  <select name="category" className={inputClass}>
                    <option value="">Seleccionar categoría</option>
                    <option value="Fútbol">Fútbol</option>
                    <option value="Retro">Retro</option>
                    <option value="Selecciones">Selecciones</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Precio
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                    S/
                  </span>

                  <input
                    name="price"
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="120.00"
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Descripción
                </label>

                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe la camiseta, temporada, material, etc."
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Imágenes */}
          <section className="border-b border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-black">Imágenes</h2>

              <p className="mt-1 text-sm text-gray-500">
                Por ahora utiliza las URLs que tienes en Cloudinary.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Imagen frontal
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  name="imageFront"
                  required
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Imagen trasera general
                </label>

                <input
                  name="imageBack"
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Tipo de camiseta */}
          <section className="border-b border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-black">Tipo de camiseta</h2>

              <p className="mt-1 text-sm text-gray-500">
                Puedes venderla sin dorsal o agregar dorsales.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:bg-gray-100">
              <input
                type="checkbox"
                checked={hasDorsal}
                onChange={(e) => handleDorsalChange(e.target.checked)}
                className="mt-1 h-5 w-5 accent-black"
              />

              <div>
                <p className="font-semibold text-black">
                  Esta camiseta tiene dorsal
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Activa esta opción si vas a venderla con jugadores o dorsales
                  específicos.
                </p>
              </div>
            </label>

            {/* Camiseta sin dorsal */}
            {!hasDorsal && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="font-semibold text-black">
                  Stock de la camiseta
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Como no tiene dorsal, solo necesitas indicar talla y cantidad.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-700">
                      Talla
                    </label>

                    <select
                      value={normalSize}
                      onChange={(e) => setNormalSize(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Seleccionar talla</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-700">
                      Stock
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={normalStock}
                      onChange={(e) => setNormalStock(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Variantes con dorsal */}
          {hasDorsal && (
            <section className="p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">Dorsales</h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Agrega los jugadores, dorsales, tallas y stock disponibles.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  + Agregar dorsal
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-black">
                          Dorsal {index + 1}
                        </h3>

                        <p className="text-xs text-gray-500">
                          Información específica de esta camiseta.
                        </p>
                      </div>

                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-sm font-medium text-red-500 transition hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-gray-700">
                          Jugador
                        </label>

                        <input
                          type="text"
                          placeholder="Mbappé"
                          value={variant.player}
                          onChange={(e) =>
                            updateVariant(index, "player", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-gray-700">
                          Dorsal
                        </label>

                        <input
                          type="number"
                          placeholder="9"
                          value={variant.number}
                          onChange={(e) =>
                            updateVariant(index, "number", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-gray-700">
                          Talla
                        </label>

                        <select
                          value={variant.size}
                          required
                          onChange={(e) =>
                            updateVariant(index, "size", e.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="">Seleccionar</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-gray-700">
                          Stock
                        </label>

                        <input
                          type="number"
                          min="0"
                          placeholder="1"
                          value={variant.stock}
                          required
                          onChange={(e) =>
                            updateVariant(index, "stock", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="mb-2 block text-xs font-semibold text-gray-700">
                        Imagen trasera de esta variante
                      </label>

                      <input
                        type="url"
                        placeholder="URL de Cloudinary — opcional"
                        value={variant.imageBack}
                        onChange={(e) =>
                          updateVariant(index, "imageBack", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Resultado */}
          {message && (
            <div
              className={`mx-6 mb-6 rounded-lg border p-4 text-sm font-medium sm:mx-8 ${
                message.includes("correctamente")
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-6 sm:p-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-4 font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "GUARDANDO PRODUCTO..." : "GUARDAR PRODUCTO"}
            </button>
          </div>
        </form>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
        >
          CERRAR SESIÓN
        </button>
      </div>
    </main>
  );
}
