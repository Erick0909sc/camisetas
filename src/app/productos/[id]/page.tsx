import ProductVariantCard from "@/components/ProductVariantCard";

type Variant = {
  id: number;
  player: string | null;
  number: number | null;
  size: string;
  stock: number;
  imageBack: string | null;
};

type Product = {
  id: number;
  name: string;
  team: string;
  description: string | null;
  price: string;
  imageFront: string;
  imageBack: string | null;
  variants: Variant[];
};

async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Producto no encontrado");
  }

  return response.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  // Solo mostramos variantes que tengan stock
  const availableVariants = product.variants.filter(
    (variant) => variant.stock > 0,
  );

  // Detectamos si esta camiseta tiene jugadores/dorsales
  const hasDorsalVariants = availableVariants.some((variant) =>
    Boolean(variant.player || variant.number),
  );

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      {/* ========================================
          BANNER DEL PRODUCTO
      ======================================== */}
      <section className="px-3 pt-4 sm:px-5 sm:pt-5 md:px-8 md:pt-7">
        <div
          className="
            relative
            mx-auto
            min-h-[300px]
            max-w-[1500px]
            overflow-hidden
            rounded-2xl
            bg-cover
            bg-[65%_center]
            sm:min-h-[330px]
            md:min-h-[360px]
            md:bg-center
          "
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/duhzsygir/image/upload/v1791263512/banner.png')",
          }}
        >
          {/* Capa oscura general */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Degradado fuerte del lado del texto */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black
              via-black/75
              to-black/10
            "
          />

          {/* CONTENIDO DEL BANNER */}
          <div
            className="
              relative
              flex
              min-h-[300px]
              items-center
              px-6
              py-10
              sm:min-h-[330px]
              sm:px-8
              md:min-h-[360px]
              md:px-12
              lg:px-16
              xl:px-20
            "
          >
            <div className="max-w-[750px]">
              {/* EQUIPO */}
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.35em]
                  text-white/70
                  sm:text-xs
                "
              >
                {product.team}
              </p>

              {/* NOMBRE */}
              <h1
                className="
                  mt-3
                  max-w-[800px]
                  text-3xl
                  font-black
                  uppercase
                  leading-[1.02]
                  tracking-tight
                  text-white
                  sm:text-4xl
                  md:mt-4
                  md:text-5xl
                  lg:text-[56px]
                "
              >
                {product.name}
              </h1>

              {/* DESCRIPCIÓN */}
              {product.description && (
                <p
                  className="
                    mt-4
                    max-w-xl
                    text-sm
                    leading-6
                    text-white/75
                    sm:text-base
                  "
                >
                  {product.description}
                </p>
              )}

              {/* ETIQUETAS */}
              <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                <span
                  className="
                    bg-white
                    px-3
                    py-2
                    text-[10px]
                    font-black
                    uppercase
                    text-black
                    sm:px-4
                    sm:text-xs
                  "
                >
                  {hasDorsalVariants ? "Disponible con dorsal" : "Disponible"}
                </span>

                <span
                  className="
                    border
                    border-white/40
                    bg-black/30
                    px-3
                    py-2
                    text-[10px]
                    font-bold
                    uppercase
                    text-white
                    backdrop-blur-sm
                    sm:px-4
                    sm:text-xs
                  "
                >
                  Stock limitado
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          PRODUCTOS / VARIANTES
      ======================================== */}
      <section
        className="
          mx-auto
          max-w-[1500px]
          px-4
          py-10
          sm:px-6
          sm:py-12
          md:px-8
          md:py-14
        "
      >
        {/* TÍTULO DE LA SECCIÓN */}
        <div className="mb-7 md:mb-9">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.35em]
              text-gray-500
              sm:text-xs
            "
          >
            Opciones disponibles
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-black
              uppercase
              tracking-tight
              text-black
              sm:text-3xl
              md:text-4xl
            "
          >
            {hasDorsalVariants ? "Elige tu jugador" : "Elige tu talla"}
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            {hasDorsalVariants
              ? "Selecciona el jugador y la talla disponible."
              : "Selecciona la talla disponible para agregarla al carrito."}
          </p>
        </div>

        {/* SIN STOCK */}
        {availableVariants.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
              Sin stock
            </p>

            <h3 className="mt-3 text-2xl font-black text-black">
              PRODUCTO AGOTADO
            </h3>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Por el momento no tenemos unidades disponibles de esta camiseta.
            </p>
          </div>
        ) : (
          /* CARDS */
          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
              sm:gap-6
              lg:grid-cols-3
              xl:grid-cols-3
            "
          >
            {availableVariants.map((variant) => (
              <ProductVariantCard
                key={variant.id}
                variant={variant}
                productId={product.id}
                productName={product.name}
                team={product.team}
                price={product.price}
                productImage={product.imageBack || product.imageFront}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
