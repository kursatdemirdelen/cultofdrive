"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit, PlusCircle, Package, Calendar } from "lucide-react";

type ProfileClientProps = {
  profileId: string;
  cars: any[];
};

export function ProfileClient({ profileId, cars }: ProfileClientProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (!currentUserId || currentUserId !== profileId) return;
    
    const fetchListings = async () => {
      const { data } = await supabaseBrowser
        .from("marketplace_listings")
        .select("*")
        .eq("seller_id", currentUserId)
        .order("created_at", { ascending: false });
      
      setListings(data || []);
    };

    fetchListings();
  }, [currentUserId, profileId]);

  const isOwnProfile = currentUserId === profileId;

  return (
    <>
      {isOwnProfile && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/garage/add"
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
          >
            <PlusCircle className="h-4 w-4" />
            Add Car
          </Link>
          <Link
            href="/marketplace/create"
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
          >
            <Package className="h-4 w-4" />
            Create Listing
          </Link>
        </div>
      )}

      {isOwnProfile && listings.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-white">Marketplace Listings</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="group overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20"
              >
                <div className="p-4">
                  <h3 className="mb-1 font-medium text-white">{listing.title}</h3>
                  <p className="mb-3 text-xs text-white/60">
                    {listing.listing_type === "car" ? "Car" : "Part"} • ${listing.price?.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/marketplace/${listing.id}`)}
                      className="flex-1 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/5"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/marketplace/edit/${listing.id}`)}
                      className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car: any) => (
          <div key={car.id} className="relative group">
            <Link
              href={`/cars/${car.id}`}
              className="block overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20"
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
                  <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 backdrop-blur">
                    <span className="text-xs text-yellow-400">★ Featured</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="mb-1 font-medium text-white">{car.model}</h3>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  {car.year && (
                    <>
                      <Calendar className="h-3.5 w-3.5" />
                      {car.year}
                    </>
                  )}
                </div>
              </div>
            </Link>
            {isOwnProfile && (
              <button
                onClick={() => router.push(`/garage/edit/${car.id}`)}
                className="absolute right-3 top-3 z-10 rounded-lg bg-black/80 p-2 text-white/80 backdrop-blur transition hover:bg-black/90 hover:text-white"
                title="Edit car"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
