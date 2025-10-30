import { Search, Copy, Trash2, Star } from "lucide-react";
import type { AdminCar } from "../types";
import Image from "next/image";

type Props = {
  cars: AdminCar[];
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (car: AdminCar) => void;
  onCopyImage: (path?: string | null) => void;
  onDelete: (id: string) => void;
  disableActions: boolean;
  activeCarId?: string;
  resolveImageUrl: (path?: string | null) => string;
};

export function CarList({
  cars,
  total,
  search,
  onSearchChange,
  onSelect,
  onCopyImage,
  onDelete,
  disableActions,
  activeCarId,
  resolveImageUrl,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Cars ({cars.length}/{total})
        </h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by model, owner, tags..."
          className="w-full rounded-lg border border-white/20 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      <div className="max-h-[600px] space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-4">
        {cars.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/60">No cars found</p>
        ) : (
          cars.map((car) => {
            const isActive = activeCarId === car.id;
            return (
              <div
                key={car.id}
                className={`group relative rounded-lg border p-3 transition ${
                  isActive
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                    {car.image_url ? (
                      <Image
                        src={resolveImageUrl(car.image_url)}
                        alt={car.model}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/20">
                        <Car className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => onSelect(car)}
                        className="flex-1 text-left"
                        disabled={disableActions}
                      >
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white truncate">{car.model}</h3>
                          {car.is_featured && (
                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-white/60">
                          {car.year && `${car.year} • `}
                          {car.owner || "Anonymous"}
                        </p>
                      </button>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onCopyImage(car.image_url)}
                          disabled={disableActions}
                          className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50"
                          title="Copy image URL"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(car.id)}
                          disabled={disableActions}
                          className="rounded p-1.5 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                          title="Delete car"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {car.tags && car.tags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {car.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Car({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}
