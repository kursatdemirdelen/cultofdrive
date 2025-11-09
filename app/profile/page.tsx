"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { useRouter } from "next/navigation";
import { Avatar } from "@/app/components/ui/Avatar";
import { Edit, Car, Eye, Heart, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ total_cars: 0, total_views: 0, total_favorites: 0, total_comments: 0 });
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profileData } = await supabaseBrowser
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        
        const res = await fetch(`/api/profiles/${user.id}/stats`);
        if (res.ok) {
          const statsData = await res.json();
          setStats(statsData);
        }

        const carsRes = await fetch(`/api/cars?user_id=${user.id}&limit=50`);
        if (carsRes.ok) {
          const carsData = await carsRes.json();
          setCars(carsData.cars || []);
        }
      }
      
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">My Garage</h1>
            <p className="text-sm text-white/50">Manage your builds and profile</p>
          </div>
          <Link
            href="/profile/edit"
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
          <div className="flex items-start gap-4 mb-6">
            <Avatar
              src={profile.avatar_url}
              alt={profile.display_name || "Driver"}
              size="xl"
            />
            <div className="flex-1">
              <h2 className="text-xl font-light text-white mb-1">{profile.display_name}</h2>
              <p className="text-sm text-white/50 mb-2">{profile.email}</p>
              {profile.bio && <p className="text-sm text-white/70">{profile.bio}</p>}
              {profile.slug && (
                <Link
                  href={`/driver/${profile.slug}`}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-white/60 hover:text-white transition"
                >
                  View Public Profile →
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-1">
                <Car className="h-4 w-4 text-white/60" />
                <p className="text-xs text-white/50">Builds</p>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total_cars}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-white/60" />
                <p className="text-xs text-white/50">Views</p>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total_views}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-white/60" />
                <p className="text-xs text-white/50">Favorites</p>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total_favorites}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="h-4 w-4 text-white/60" />
                <p className="text-xs text-white/50">Comments</p>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total_comments}</p>
            </div>
          </div>
        </div>

        {/* My Cars */}
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">My Builds</h2>
            <Link
              href="/garage/add"
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
              Add Car
            </Link>
          </div>

          {cars.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No builds yet"
              description="Start building your garage and share your story"
              action={{
                label: "Add Your First Car",
                onClick: () => router.push("/garage/add"),
              }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => (
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-base font-medium text-white">{car.model}</h3>
                    <p className="text-xs text-white/50">{car.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
