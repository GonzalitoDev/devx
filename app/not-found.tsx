import Link from "next/link";
import { CodeIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-black px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
        <CodeIcon className="h-7 w-7" />
      </span>
      <h1 className="text-2xl font-bold text-zinc-100">404</h1>
      <p className="max-w-md text-sm text-zinc-500">
        Esta página no existe o fue movida. Vuelve al inicio para seguir
        explorando DevX.
      </p>
      <Link
        href="/"
        className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
      >
        Volver al inicio
      </Link>
    </div>
  );
}