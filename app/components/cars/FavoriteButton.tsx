"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { CarsAPI } from "@/utils/api";
import { supabaseBrowser } from "@/utils/supabase-browser";
import Link from "next/link";

type Props = {
  carId: string;
};

export function FavoriteButton({ carId }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriting, setFavoriting] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (mounted) setUserId(data.user?.id ?? null);
    });
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    CarsAPI.getFavorites(carId, userId || undefined)
      .then((data) => {
        if (mounted) {
          setFavoriteCount(data?.count ?? 0);
          setFavorited(Boolean(data?.favorited));
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [carId, userId]);

  async function toggleFavorite() {
    if (!userId || favoriting) return;
    try {
      setFavoriting(true);
      if (favorited) {
        await CarsAPI.unfavorite(carId, userId);
        setFavorited(false);
        setFavoriteCount((c) => Math.max(0, c - 1));
      } else {
        await CarsAPI.favorite(carId, userId);
        setFavorited(true);
        setFavoriteCount((c) => c + 1);
      }
    } finally {
      setFavoriting(false);
    }
  }

  if (!userId) {
    return (
      <Link
        href="/auth"
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
      >
        <Heart className="h-4 w-4" />
        <span className="hidden sm:inline">Favorite</span>
        {!loading && <span className="text-white/60">({favoriteCount})</span>}
      </Link>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading || favoriting}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium backdrop-blur transition ${
        favorited
          ? "border border-red-500/30 bg-red-500/20 text-red-400 hover:bg-red-500/30"
          : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <Heart className={`h-4 w-4 ${favorited ? "fill-red-400" : ""}`} />
      <span className="hidden sm:inline">{favoriting ? "..." : favorited ? "Favorited" : "Favorite"}</span>
      <span className="text-white/60">({favoriteCount})</span>
    </button>
  );
}
