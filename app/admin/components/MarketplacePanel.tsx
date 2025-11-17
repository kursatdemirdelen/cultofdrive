"use client";

import { useState, useEffect } from "react";
import { Package, Trash2, Eye, Car, Wrench } from "lucide-react";
import Image from "next/image";
import { resolveImageSource } from "@/utils/storage";

type Listing = {
  id: string;
  listing_type: "car" | "part";
  title: string;
  image_url: string | null;
  price: number;
  status: string;
  seller_id: string;
  created_at: string;
  views: number;
};

type Props = {
  adminKey: string;
};

export function MarketplacePanel({ adminKey }: Props) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "sold">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!adminKey) return;
    fetchListings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/marketplace", {
        headers: { "x-admin-key": adminKey },
      });
      const data = await response.json();
      setListings(data.listings || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    
    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/marketplace/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      
      if (response.ok) {
        setListings(listings.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete listing:", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/marketplace/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        setListings(listings.map(l => l.id === id ? { ...l, status } : l));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredListings = listings.filter(l => 
    filter === "all" || l.status === filter
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-6 w-6 text-white" />
          <h2 className="text-xl font-medium text-white">Marketplace Management</h2>
        </div>
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-6 w-6 text-white" />
          <h2 className="text-xl font-medium text-white">Marketplace Management</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${
              filter === "all" ? "bg-white/20 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All ({listings.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${
              filter === "active" ? "bg-white/20 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Active ({listings.filter(l => l.status === "active").length})
          </button>
          <button
            onClick={() => setFilter("sold")}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${
              filter === "sold" ? "bg-white/20 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Sold ({listings.filter(l => l.status === "sold").length})
          </button>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <p className="text-center text-white/60 py-8">No listings found</p>
      ) : (
        <div className="space-y-3">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4"
            >
              <div className="relative h-32 sm:h-16 w-full sm:w-24 flex-shrink-0 overflow-hidden rounded bg-white/5">
                {listing.image_url ? (
                  <Image
                    src={resolveImageSource(listing.image_url) || "/images/placeholder-car.jpg"}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 96px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/40">
                    {listing.listing_type === "car" ? <Car className="h-6 w-6" /> : <Wrench className="h-6 w-6" />}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {listing.listing_type === "car" ? (
                    <Car className="h-4 w-4 text-white/60" />
                  ) : (
                    <Wrench className="h-4 w-4 text-white/60" />
                  )}
                  <h3 className="font-medium text-white truncate text-sm sm:text-base">{listing.title}</h3>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/50 flex-wrap">
                  <span>${listing.price.toLocaleString()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {listing.views}
                  </span>
                  <span>•</span>
                  <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={listing.status}
                  onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                  className="flex-1 sm:flex-initial rounded border border-white/20 bg-white/5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-white min-w-0"
                >
                  <option value="active" className="bg-slate-900">Active</option>
                  <option value="sold" className="bg-slate-900">Sold</option>
                  <option value="expired" className="bg-slate-900">Expired</option>
                  <option value="removed" className="bg-slate-900">Removed</option>
                </select>

                <button
                  onClick={() => handleDelete(listing.id)}
                  disabled={deleting === listing.id}
                  className="flex-shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
