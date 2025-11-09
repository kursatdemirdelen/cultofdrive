"use client";

import { useState, useMemo, useEffect } from "react";
import { useCars } from "../components/hooks/useCars";
import { Search, Grid3x3, List, SlidersHorizontal, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CarGridSkeleton } from "../components/loading/CarCardSkeleton";
import { CarListSkeleton } from "../components/loading/CarListSkeleton";
import { EmptyState } from "../components/ui/EmptyState";

type ViewMode = "grid" | "list";
type SortMode = "newest" | "oldest" | "model";

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);

  const debouncedSearch = useDebounce(search, 400);
  const { cars, loading, error } = useCars({ 
    q: debouncedSearch,
    featured: showFeaturedOnly ? true : undefined,
    limit: 200 
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

  const displayedCars = useMemo(() => {
    return sortedCars.slice(0, displayCount);
  }, [sortedCars, displayCount]);

  const hasMore = displayCount < sortedCars.length;

  const loadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            Discover
          </h1>
          <p className="text-sm text-white/50">
            {cars.length} builds from the community
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-5 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search builds..."
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-3 pl-12 pr-4 text-sm text-white placeholder-white/30 transition focus:border-white/20 focus:bg-white/[0.05] focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm transition ${
                showFilters
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3 backdrop-blur-sm"
            >
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs transition ${
                    showFeaturedOnly
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                  }`}
                >
                  <Star className={`h-3.5 w-3.5 ${showFeaturedOnly ? "fill-white" : ""}`} />
                  Featured
                </button>

                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white transition focus:border-white/20 focus:outline-none"
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
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-white/50">
            {loading ? "Loading..." : `${sortedCars.length} builds`}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-2 transition ${
                viewMode === "grid"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:bg-white/[0.05] hover:text-white/60"
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-2 transition ${
                viewMode === "list"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:bg-white/[0.05] hover:text-white/60"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (viewMode === "grid" ? <CarGridSkeleton count={6} /> : <CarListSkeleton count={6} />)}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Cars Grid/List */}
        {!loading && !error && sortedCars.length === 0 && (
          <EmptyState
            icon={Search}
            title="No builds found"
            description="Try adjusting your search or filters"
          />
        )}

        {viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedCars.map((car, i) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-sm transition hover:bg-white/[0.04]"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={car.imageUrl.startsWith('public/') ? `/${car.imageUrl.replace('public/', '')}` : car.imageUrl}
                    alt={car.model}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {car.isFeatured && (
                    <div className="absolute right-3 top-3 rounded-md bg-black/60 p-1.5 backdrop-blur-xl">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-base font-medium text-white">{car.model}</h3>
                  <p className="text-xs text-white/50">
                    {car.year && `${car.year} • `}
                    {car.driverSlug && car.driverSlug !== 'anonymous' ? (
                      <span 
                        className="hover:text-white transition cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = `/driver/${car.driverSlug}`;
                        }}
                      >
                        {car.owner}
                      </span>
                    ) : (
                      <span className="cursor-default">{car.owner}</span>
                    )}
                  </p>
                  {car.tags && car.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {car.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-white/[0.03] px-2 py-0.5 text-xs text-white/40"
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
            {displayedCars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group flex gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-3 backdrop-blur-sm transition hover:bg-white/[0.04]"
              >
                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={car.imageUrl.startsWith('public/') ? `/${car.imageUrl.replace('public/', '')}` : car.imageUrl}
                    alt={car.model}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
                    sizes="128px"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-medium text-white">{car.model}</h3>
                      <p className="text-xs text-white/50">
                        {car.year && `${car.year} • `}
                        {car.driverSlug && car.driverSlug !== 'anonymous' ? (
                          <span 
                            className="hover:text-white transition cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/driver/${car.driverSlug}`;
                            }}
                          >
                            {car.owner}
                          </span>
                        ) : (
                          <span className="cursor-default">{car.owner}</span>
                        )}
                      </p>
                    </div>
                    {car.isFeatured && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-white/40">{car.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              className="rounded-md border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white transition hover:bg-white/[0.06]"
            >
              Load More ({sortedCars.length - displayCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  
  return v;
}
