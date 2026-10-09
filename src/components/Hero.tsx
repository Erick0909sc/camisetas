import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[620px] overflow-hidden bg-black text-white md:min-h-[720px]">
      {/* Imagen de fondo */}
      <Image
        src="https://res.cloudinary.com/duhzsygir/image/upload/v1791261435/fondopage.png"
        alt="Colección de camisetas de fútbol"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Oscurecimiento general */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Degradado para que el texto se lea mejor */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />

      {/* Degradado inferior */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-6 md:min-h-[720px]">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-white/70 md:text-sm">
            Nueva temporada 2026/27
          </p>

          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Viste tus
            <br />
            colores.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-white/80 md:text-lg">
            Camisetas actuales y clásicos que nunca pasan de moda. Encuentra la
            camiseta de tu equipo y lleva tu pasión a todas partes.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/productos"
              className="inline-flex items-center justify-center bg-white px-8 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-gray-200"
            >
              Ver camisetas
            </Link>

            {/* <Link
              href="/productos?categoria=retro"
              className="inline-flex items-center justify-center border border-white/70 bg-black/20 px-8 py-4 text-sm font-black uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
            >
              Ver retro
            </Link> */}
          </div>
        </div>
      </div>

      {/* Texto pequeño inferior */}
      <div className="absolute bottom-6 right-6 z-10 hidden text-right md:block">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
          Fútbol • Pasión • Historia
        </p>
      </div>
    </section>
  );
}
