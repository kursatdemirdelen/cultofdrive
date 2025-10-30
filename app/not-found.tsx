import Link from "next/link";
import { Car } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 w-fit rounded-full bg-white/5 p-6">
          <Car className="h-12 w-12 text-white/40" />
        </div>
        <h1 className="mb-2 font-heading text-6xl tracking-[0.12em] text-white">
          404
        </h1>
        <h2 className="mb-2 text-2xl font-medium text-white/80">
          Page Not Found
        </h2>
        <p className="mb-6 text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
          >
            Go home
          </Link>
          <Link
            href="/garage"
            className="rounded-lg border border-white/20 px-6 py-3 font-medium text-white/80 transition hover:bg-white/5"
          >
            Discover cars
          </Link>
        </div>
      </div>
    </div>
  );
}
