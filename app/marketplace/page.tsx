"use client";

import { useEffect, useState, useMemo } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import Link from "next/link";
import Image from "next/image";
import { DollarSign, MapPin, Eye, Plus, Car, Wrench } from "lucide-react";
import { MarketplaceGridSkeleton } from "../components/loading/MarketplaceSkeleton";
import { resolveImageSource } from "@/utils/storage";

type Listing = {
  id: string;
  listing_type: "car" | "part";
  title: string;
  image_url: string | null;
  price: number;
  currency: string;
  location: string;
  views: number;
  created_at: string;
  car_id: string | null;
  cars: {
    model: string;
    image_url: string;
    year: number;
  } | null;
};

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "car" | "part">("all");
  const [sortBy, setSortBy] = useState<"date" | "price" | "views">("date");
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabaseBrowser
        .from("marketplace_listings")
        .select("*, cars(model, image_url, year)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      setListings(data || []);
      setLoading(false);
    };

    fetchListings();
  }, []);

  const sortedListings = useMemo(() => {
    const filtered = listings.filter(l => filter === "all" || l.listing_type === filter);
    const sorted = [...filtered];
    
    if (sortBy === "price") {
      return sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "views") {
      return sorted.sort((a, b) => b.views - a.views);
    } else {
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [listings, filter, sortBy]);

  const displayedListings = useMemo(() => {
    return sortedListings.slice(0, displayCount);
  }, [sortedListings, displayCount]);

  const hasMore = displayCount < sortedListings.length;

  const loadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
                Marketplace
              </h1>
              <p className="text-sm text-white/50">Buy and sell BMW cars and parts</p>
            </div>
            {user && (
              <Link
                href="/marketplace/create"
                className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2.5 text-sm text-white transition hover:bg-white/20"
              >
                <Plus className="h-4 w-4" />
                Create Listing
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-md border px-4 py-2.5 text-sm transition ${
                filter === "all"
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
              }`}
            >
              All ({listings.length})
            </button>
            <button
              onClick={() => setFilter("car")}
              className={`flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm transition ${
                filter === "car"
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
              }`}
            >
              <Car className="h-4 w-4" /> Cars ({listings.filter(l => l.listing_type === "car").length})
            </button>
            <button
              onClick={() => setFilter("part")}
              className={`flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm transition ${
                filter === "part"
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
              }`}
            >
              <Wrench className="h-4 w-4" /> Parts ({listings.filter(l => l.listing_type === "part").length})
            </button>
            
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-white/40">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "price" | "views")}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white transition focus:border-white/20 focus:outline-none"
              >
                <option value="date" className="bg-slate-900">Newest</option>
                <option value="price" className="bg-slate-900">Price</option>
                <option value="views" className="bg-slate-900">Views</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <MarketplaceGridSkeleton count={6} />
        ) : listings.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-12 text-center">
            <p className="text-sm text-white/50">No listings yet</p>
            <p className="mt-2 text-xs text-white/40">Be the first to list your car!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedListings.map((listing) => {
              const imageUrl = resolveImageSource(listing.image_url || listing.cars?.image_url);
              
              return (
              <Link
                key={listing.id}
                href={`/marketplace/${listing.id}`}
                className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-sm transition hover:bg-white/[0.04]"
              >
                <div className="relative aspect-video overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white/40">
                      No image
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex items-center justify-center rounded-full bg-black/60 p-2 backdrop-blur">
                    {listing.listing_type === "car" ? (
                      <Car className="h-4 w-4 text-white" />
                    ) : (
                      <Wrench className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
                    <span className="text-sm font-bold text-white">
                      ${listing.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-medium text-white">{listing.title}</h3>
                  {listing.cars && (
                    <p className="mb-3 text-sm text-white/60">
                      {listing.cars.year} {listing.cars.model}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-white/50">
                    {listing.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {listing.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {listing.views}
                    </span>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        )}
          
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              className="rounded-md border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white transition hover:bg-white/[0.06]"
            >
              Load More ({sortedListings.length - displayCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
