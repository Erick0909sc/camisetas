import Image from "next/image";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />

      <ProductSection />

      {/* PEDIDOS ESPECIALES */}
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          
          {/* IMAGEN */}
          <div className="relative min-h-[450px] md:min-h-[600px]">
            <Image
              src="https://res.cloudinary.com/duhzsygir/image/upload/v1791262241/dinho.jpg"
              alt="Camiseta clásica de fútbol"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Degradado */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30" />
          </div>

          {/* CONTENIDO */}
          <div className="flex items-center px-8 py-16 sm:px-12 md:px-16 lg:px-20">
            <div className="max-w-lg">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-white/50">
                Pedidos especiales
              </p>

              <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                ¿No encuentras
                <br />
                tu camiseta?
              </h2>

              <div className="my-7 h-[2px] w-16 bg-white" />

              <p className="text-base leading-7 text-white/70 md:text-lg">
                ¿Buscas una camiseta de otro equipo, jugador o
                temporada? Escríbenos y consulta disponibilidad.
                Te ayudamos a encontrar la camiseta que buscas.
              </p>

              <a
                href="https://wa.me/51904145112?text=Hola%2C%20estoy%20buscando%20una%20camiseta%20que%20no%20encontr%C3%A9%20en%20la%20tienda.%20Quisiera%20consultar%20disponibilidad."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex items-center justify-center bg-green-600 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-green-700"
              >
                Pedir por WhatsApp
                <span className="ml-3 text-lg">→</span>
              </a>

              <p className="mt-5 text-xs uppercase tracking-wider text-white/40">
                Equipo • Jugador • Temporada
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}