
import ProductSection from "@/components/ProductSection";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Camisetas de fútbol | FTLAB Store",
  description:
    "Explora nuestra colección de camisetas de fútbol en FTLAB Store.",
};

export default function CamisetasPage() {
  return (
    <main className="min-h-screen bg-white">
      <ProductSection />
    </main>
  );
}
