import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">
          Error 404
        </p>

        <h1 className="mt-4 text-6xl font-black text-black">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-black">
          Página no encontrada
        </h2>

        <p className="mx-auto mt-3 max-w-md text-gray-500">
          La página que estás buscando no existe o fue eliminada.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-black px-7 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          VOLVER AL INICIO
        </Link>
      </div>
    </main>
  );
}