import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Product = {
  id: number;
  name: string;
  team: string;
  price: string;
  imageFront: string;
};

async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    team: product.team,
    price: product.price.toString(),
    imageFront: product.imageFront,
  }));
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

          <h2 className="mt-2 text-4xl font-black text-black">CAMISETAS</h2>

          <p className="mt-3 text-gray-600">
            Elige tu equipo y descubre las camisetas disponibles.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500">No hay camisetas disponibles.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
