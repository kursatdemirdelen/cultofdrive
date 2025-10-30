"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 w-fit rounded-full bg-red-500/10 p-6">
          <AlertTriangle className="h-12 w-12 text-red-400" />
        </div>
        <h1 className="mb-2 font-heading text-3xl tracking-[0.12em] text-white">
          SOMETHING WENT WRONG
        </h1>
        <p className="mb-6 text-white/60">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-white/20 px-6 py-3 font-medium text-white/80 transition hover:bg-white/5"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
