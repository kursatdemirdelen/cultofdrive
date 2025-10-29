"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { useCars } from "@/app/components/hooks/useCars";
import CarCard from "@/app/components/drivers-garage/CarCard";
import type { Car } from "@/app/components/types/car.types";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { useRouter } from "next/navigation";

export default function MyGaragePage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const { cars, loading, error } = useCars({ userId: user?.id, preferLocalFirst: false });
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
    return () => { sub.subscription.unsubscribe(); mounted = false };
  }, []);

  const displayName = useMemo(() => {
    if (!user) return "";
    const nickname = user.user_metadata?.full_name || user.user_metadata?.name;
    return nickname || user.email || "Driver";
  }, [user]);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white/70">
        Loading your garage...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-gray-900 to-black text-center text-white/80 px-4">
        <h1 className="text-3xl font-heading tracking-[0.1em]">My Garage</h1>
        <p className="max-w-md text-white/60">Sign in to unlock your personal garage, manage builds, and track community reactions.</p>
        <Link href="/auth" className="btn-motorsport-primary">Sign in</Link>
      </div>
    );
  }

  const hasCars = cars.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 py-16">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="flex flex-col gap-4 rounded-xl border border-white/10 bg-black/40 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Welcome back</p>
            <h1 className="text-3xl md:text-4xl font-heading tracking-[0.08em] text-white">{displayName}&rsquo;s Garage</h1>
            <p className="mt-2 text-white/60">
              {hasCars ? `You have ${cars.length} build${cars.length > 1 ? "s" : ""} showcased. Keep the updates coming!` : "You haven't added a car yet. Start with your hero build and we'll feature it in the public garage."}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/garage/add" className="btn-motorsport-primary">Add a new car</Link>
            <Link href="/garage" className="btn-motorsport">Explore community builds</Link>
          </div>
        </section>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {loading && !hasCars ? (
          <p className="text-white/70">Loading your cars...</p>
        ) : hasCars ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car: Car, i: number) => (
              <CarCard key={car.id} car={car} index={i} onClick={() => router.push(`/cars/${car.id}`)} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-white/60">
            <p className="text-lg">No cars yet.</p>
            <p className="mt-2 text-sm">Add your first build to unlock reactions, favorites, and a public profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
