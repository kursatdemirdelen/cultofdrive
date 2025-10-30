"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { useCars } from "@/app/components/hooks/useCars";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, Car, Edit, Eye, DollarSign, Package } from "lucide-react";
import Image from "next/image";

export default function MyGaragePage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const { cars, loading, error } = useCars({ userId: user?.id, limit: 50 });
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data.user ?? null);
        setChecking(false);
      }
    });
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_ev, session) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });
    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const fetchListings = async () => {
      setLoadingListings(true);
      const { data } = await supabaseBrowser
        .from("marketplace_listings")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
      
      setListings(data || []);
      setLoadingListings(false);
    };

    fetchListings();
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) return "";
    const nickname = user.user_metadata?.full_name || user.user_metadata?.name;
    return nickname || user.email?.split("@")[0] || "Driver";
  }, [user]);

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white/70">
        Loading your garage...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 text-center">
        <div className="rounded-full bg-white/5 p-6">
          <Car className="h-12 w-12 text-white/40" />
        </div>
        <div>
          <h1 className="mb-2 font-heading text-3xl tracking-[0.12em] text-white">MY GARAGE</h1>
          <p className="max-w-md text-white/60">
            Sign in to unlock your personal garage, manage builds, and showcase your collection
          </p>
        </div>
        <Link
          href="/auth"
          className="rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const hasCars = cars.length > 0;
  const hasListings = listings.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Welcome back</p>
            <h1 className="font-heading text-3xl tracking-[0.08em] text-white md:text-4xl">
              {displayName}&apos;s Garage
            </h1>
            <p className="mt-2 text-white/60">
              {hasCars || hasListings
                ? `${cars.length} car${cars.length !== 1 ? "s" : ""} • ${listings.length} listing${listings.length !== 1 ? "s" : ""}`
                : "Start building your collection"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/garage/add"
              className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-5 py-3 font-medium text-white transition hover:bg-white/20"
            >
              <PlusCircle className="h-5 w-5" />
              Add Car
            </Link>
            <Link
              href="/marketplace/create"
              className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-5 py-3 font-medium text-white transition hover:bg-white/20"
            >
              <Package className="h-5 w-5" />
              Create Listing
            </Link>
            <Link
              href="/garage"
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-3 font-medium text-white/80 transition hover:bg-white/5"
            >
              <Eye className="h-5 w-5" />
              Discover
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && !hasCars && (
          <div className="text-center text-white/70">Loading your cars...</div>
        )}

        {/* Marketplace Listings */}
        {hasListings && (
          <div>
            <h2 className="mb-4 text-xl font-medium text-white">Marketplace Listings</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20"
                >
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-950">
                    {listing.image_url && (
                      <Image
                        src={listing.image_url.startsWith('http') ? listing.image_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/garage/${listing.image_url}`}
                        alt={listing.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
                      <span className="text-sm font-bold text-white">
                        ${listing.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 text-xl font-medium text-white">{listing.title}</h3>
                    <p className="mb-4 text-sm text-white/60">
                      {listing.listing_type === "car" ? "Car" : "Part"} • {listing.status}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/marketplace/${listing.id}`)}
                        className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/marketplace/edit/${listing.id}`)}
                        className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cars Grid */}
        {hasCars && (
          <div>
            <h2 className="mb-4 text-xl font-medium text-white">My Cars</h2>
          </div>
        )}
        {hasCars ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car.id}
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={car.imageUrl.startsWith('public/') ? `/${car.imageUrl.replace('public/', '')}` : car.imageUrl}
                    alt={car.model}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="mb-1 text-xl font-medium text-white">{car.model}</h3>
                  <p className="mb-4 text-sm text-white/60">
                    {car.year && `${car.year} • `}
                    {car.owner}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/cars/${car.id}`)}
                      className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/garage/edit/${car.id}`)}
                      className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && !hasListings && (
            <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-12 text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-white/5 p-6">
                <Car className="h-12 w-12 text-white/40" />
              </div>
              <p className="mb-2 text-lg text-white/80">No cars yet</p>
              <p className="mb-6 text-sm text-white/50">
                Add your first build to showcase it to the community
              </p>
              <Link
                href="/garage/add"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
              >
                <PlusCircle className="h-5 w-5" />
                Add Your First Car
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}
