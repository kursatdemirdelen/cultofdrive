"use client";

import { useState, useMemo } from "react";
import { useCars } from "../components/hooks/useCars";

export default function GarageDiscoverPage() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const { cars, loading, error } = useCars({ q: debouncedQ || undefined });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-heading tracking-[0.1em] text-white">Discover Cars</h1>
          <p className="text-white/70">Search by model, description or tags.</p>
        </header>

        <div className="mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search cars..."
            className="w-full max-w-xl px-4 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50"
          />
        </div>

        {loading && <p className="text-white/70">Loading...</p>}
        {error && <p className="text-red-300">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <a key={car.id} href={`/cars/${car.id}`} className="overflow-hidden transition-colors border rounded-lg cursor-pointer bg-carbon/40 border-white/5 hover:bg-carbon/50">
                <div className="relative h-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={car.imageUrl} alt={car.model} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="mb-1 text-xl font-medium text-white/90">{car.model}</h3>
                  <p className="text-sm text-white/60">{car.year ? `${car.year} • ` : ''}{car.owner}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useMemo(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

