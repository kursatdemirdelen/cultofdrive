"use client";

import { useState, useMemo } from "react";
import { useCars } from "../components/hooks/useCars";
import { Search, Grid3x3, List, SlidersHorizontal, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CarGridSkeleton } from "../components/loading/CarCardSkeleton";

type ViewMode = "grid" | "list";
type SortMode = "newest" | "oldest" | "model";

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 400);
  const { cars, loading, error } = useCars({ 
    q: debouncedSearch || undefined,
    featured: showFeaturedOnly || undefined,
    limit: 50 
  });

  const sortedCars = useMemo(() => {
    const sorted = [...cars];
    if (sortMode === "newest") {
      return sorted;
    } else if (sortMode === "oldest") {
      return sorted.reverse();
    } else {
      return sorted.sort((a, b) => a.model.localeCompare(b.model));
    }
  }, [cars, sortMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-heading text-4xl tracking-[0.12em] text-white md:text-5xl">
            DISCOVER
          </h1>
          <p className="text-white/60">
            Explore {cars.length} iconic BMW builds from the community
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by model, owner, or description..."
                className="w-full rounded-lg border border-white/20 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-white/40 backdrop-blur transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 font-medium transition ${
                showFilters
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition ${
                    showFeaturedOnly
                      ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                      : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <Star className={`h-4 w-4 ${showFeaturedOnly ? "fill-yellow-400" : ""}`} />
                  Featured Only
                </button>

                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur transition focus:border-white/40 focus:outline-none"
                >
                  <option value="newest" className="bg-slate-900 text-white">Newest First</option>
                  <option value="oldest" className="bg-slate-900 text-white">Oldest First</option>
                  <option value="model" className="bg-slate-900 text-white">Model A-Z</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-white/60">
            {loading ? "Loading..." : `${sortedCars.length} builds found`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition ${
                viewMode === "grid"
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition ${
                viewMode === "list"
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && <CarGridSkeleton count={viewMode === "grid" ? 6 : 3} />}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Cars Grid/List */}
        {!loading && !error && sortedCars.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-12 text-center">
            <p className="text-lg text-white/60">No builds found</p>
            <p className="mt-2 text-sm text-white/40">Try adjusting your search or filters</p>
          </div>
        )}

        {viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCars.map((car, i) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20 hover:bg-white/8"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={car.imageUrl.startsWith('public/') ? `/${car.imageUrl.replace('public/', '')}` : car.imageUrl}
                    alt={car.model}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {car.isFeatured && (
                    <div className="absolute right-3 top-3 rounded-full bg-black/60 p-2 backdrop-blur">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="mb-1 text-xl font-medium text-white">{car.model}</h3>
                  <p className="text-sm text-white/60">
                    {car.year && `${car.year} • `}
                    {car.owner}
                  </p>
                  {car.tags && car.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {car.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/20 hover:bg-white/8"
              >
                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={car.imageUrl}
                    alt={car.model}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{car.model}</h3>
                      <p className="text-sm text-white/60">
                        {car.year && `${car.year} • `}
                        {car.owner}
                      </p>
                    </div>
                    {car.isFeatured && (
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-white/50">{car.description}</p>
                </div>
              </Link>
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
