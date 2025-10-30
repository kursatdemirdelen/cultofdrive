"use client";

import { useState, useEffect } from "react";
import { X, Car, Package, MessageSquare, Calendar, Mail } from "lucide-react";

type UserDetail = {
  id: string;
  email: string;
  created_at: string;
  cars: Array<{ id: string; model: string; year: number }>;
  listings: Array<{ id: string; title: string; price: number }>;
  comments: Array<{ id: string; comment: string; created_at: string }>;
};

type Props = {
  userId: string;
  adminKey: string;
  onClose: () => void;
};

export function UserDetailModal({ userId, adminKey, onClose }: Props) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          headers: { "x-admin-key": adminKey },
        });
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId, adminKey]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-slate-900 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-white">User Details</h2>
          <div className="flex items-center gap-2 text-white/60">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-white/50">
            <Calendar className="h-3.5 w-3.5" />
            <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-400" />
              <h3 className="font-medium text-white">Cars ({user.cars.length})</h3>
            </div>
            <div className="space-y-2">
              {user.cars.length === 0 ? (
                <p className="text-sm text-white/50">No cars</p>
              ) : (
                user.cars.map((car) => (
                  <div key={car.id} className="rounded border border-white/10 bg-white/5 p-2 text-sm text-white">
                    {car.year} {car.model}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-400" />
              <h3 className="font-medium text-white">Listings ({user.listings.length})</h3>
            </div>
            <div className="space-y-2">
              {user.listings.length === 0 ? (
                <p className="text-sm text-white/50">No listings</p>
              ) : (
                user.listings.map((listing) => (
                  <div key={listing.id} className="rounded border border-white/10 bg-white/5 p-2 text-sm">
                    <p className="truncate text-white">{listing.title}</p>
                    <p className="text-xs text-white/60">${listing.price.toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <h3 className="font-medium text-white">Comments ({user.comments.length})</h3>
            </div>
            <div className="space-y-2">
              {user.comments.length === 0 ? (
                <p className="text-sm text-white/50">No comments</p>
              ) : (
                user.comments.slice(0, 3).map((comment) => (
                  <div key={comment.id} className="rounded border border-white/10 bg-white/5 p-2 text-xs text-white/80">
                    {comment.comment.slice(0, 50)}...
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
