"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import Link from "next/link";
import Image from "next/image";
import { DollarSign, MapPin, Eye, Plus, Car, Wrench } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-2 font-heading text-4xl tracking-[0.12em] text-white">
                MARKETPLACE
              </h1>
              <p className="text-white/60">Buy and sell BMW cars and parts</p>
            </div>
            {user && (
              <Link
                href="/marketplace/create"
                className="flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 font-medium text-white transition hover:bg-white/20"
              >
                <Plus className="h-5 w-5" />
                Create Listing
              </Link>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                filter === "all"
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              All ({listings.length})
            </button>
            <button
              onClick={() => setFilter("car")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                filter === "car"
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <Car className="h-4 w-4" /> Cars ({listings.filter(l => l.listing_type === "car").length})
            </button>
            <button
              onClick={() => setFilter("part")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                filter === "part"
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <Wrench className="h-4 w-4" /> Parts ({listings.filter(l => l.listing_type === "part").length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-white/10 bg-white/5">
                <div className="aspect-video bg-white/10" />
                <div className="p-4 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-white/10" />
                  <div className="h-4 w-1/2 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-12 text-center">
            <p className="text-lg text-white/60">No listings yet</p>
            <p className="mt-2 text-sm text-white/40">Be the first to list your car!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.filter(l => filter === "all" || l.listing_type === filter).map((listing) => (
              <Link
                key={listing.id}
                href={`/marketplace/${listing.id}`}
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20"
              >
                <div className="relative aspect-video overflow-hidden">
                  {(listing.image_url || listing.cars?.image_url) ? (
                    <Image
                      src={
                        listing.image_url
                          ? (listing.image_url.startsWith('http') ? listing.image_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/garage/${listing.image_url}`)
                          : (listing.cars.image_url.startsWith('public/') ? `/${listing.cars.image_url.replace('public/', '')}` : listing.cars.image_url)
                      }
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
