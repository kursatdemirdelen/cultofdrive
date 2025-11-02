import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Car } from "lucide-react";
import { Avatar } from "@/app/components/ui/Avatar";
import { ProfileClient } from "./ProfileClient";

async function getDriverCars(userId: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/cars?user_id=${userId}&limit=50`, { 
    cache: "no-store" 
  });
  if (!res.ok) return { cars: [] };
  return res.json();
}

async function getDriverProfile(slug: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/profiles/${encodeURIComponent(slug)}`, { 
    cache: "no-store" 
  });
  if (!res.ok) return null;
  return res.json();
}

async function getDriverStats(userId: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/profiles/${userId}/stats`, { 
    cache: "no-store" 
  });
  if (!res.ok) return { total_favorites: 0, total_comments: 0, total_views: 0, total_cars: 0 };
  return res.json();
}

export default async function DriverProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const profileData = await getDriverProfile(decodedSlug);
  if (!profileData?.profile) {
    notFound();
  }
  
  const profile = profileData.profile;
  const { cars } = await getDriverCars(profile.id);
  const stats = await getDriverStats(profile.id);

  const totalCars = cars.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
          <div className="mb-6">
            <Avatar 
              src={profile.avatar_url} 
              alt={profile.display_name || 'Anonymous'} 
              size="xl" 
              className="mb-4"
            />
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">Driver Profile</p>
            <h1 className="mb-2 text-3xl sm:text-4xl font-light tracking-tight text-white">
              {profile.display_name}
            </h1>
            {profile.bio && (
              <p className="text-sm text-white/70 mb-2">{profile.bio}</p>
            )}
            {profile.created_at && (
              <p className="text-xs text-white/50">
                Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-1">
                <Car className="h-4 w-4 text-white/60" />
                <p className="text-xs text-white/50">Builds</p>
              </div>
              <p className="text-2xl font-bold text-white">{totalCars}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/50 mb-1">Views</p>
              <p className="text-2xl font-bold text-white">{stats.total_views || 0}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/50 mb-1">Favorites</p>
              <p className="text-2xl font-bold text-white">{stats.total_favorites || 0}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/50 mb-1">Comments</p>
              <p className="text-2xl font-bold text-white">{stats.total_comments || 0}</p>
            </div>
          </div>
        </div>

        {/* Cars Grid with Client Features */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-white">All Builds</h2>
          <ProfileClient profileId={profile.id} cars={cars} />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const profileData = await getDriverProfile(decodedSlug);
  const displayName = profileData?.profile?.display_name || decodedSlug;
  
  return {
    title: `${displayName}'s Garage | Cult of Drive`,
    description: `Browse ${displayName}'s BMW builds and collection on Cult of Drive.`,
  };
}
