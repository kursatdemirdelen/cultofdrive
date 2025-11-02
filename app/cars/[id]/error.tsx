"use client";

import { useEffect } from "react";
import { Car, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CarError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Car page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 w-fit rounded-full bg-red-500/10 p-6">
          <Car className="h-12 w-12 text-red-400" />
        </div>
        <h1 className="mb-2 font-heading text-3xl tracking-[0.12em] text-white">
          CAR NOT FOUND
        </h1>
        <p className="mb-6 text-white/60">
          This car listing could not be loaded or doesn&apos;t exist
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
          >
            Try again
          </button>
          <Link
            href="/garage"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-medium text-white/80 transition hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Garage
          </Link>
        </div>
      </div>
    </div>
  );
}
