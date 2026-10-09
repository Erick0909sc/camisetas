import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  team: string;
  price: string;
  imageFront: string;
};

async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/productos", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  return response.json();
}

export default async function ProductSection() {
  const products = await getProducts();

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Nuestra colección
          </p>

          <h2 className="mt-2 text-4xl font-black text-black">
            CAMISETAS
          </h2>

          <p className="mt-3 text-gray-600">
            Elige tu equipo y descubre las camisetas disponibles.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500">
            No hay camisetas disponibles.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}