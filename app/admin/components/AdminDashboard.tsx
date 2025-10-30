import { useState, useEffect } from "react";
import { Car, Star, TrendingUp, Users, Package, Eye, Heart, MessageSquare } from "lucide-react";

type Props = {
  totalCars: number;
  featuredCars: number;
  recentCars: number;
  adminKey: string;
};

type DashboardData = {
  total_users: number;
  total_listings: number;
  total_views: number;
  total_favorites: number;
  total_comments: number;
};

export function AdminDashboard({ totalCars, featuredCars, recentCars, adminKey }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/analytics", {
          headers: { "x-admin-key": adminKey },
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    if (adminKey) fetchData();
  }, [adminKey]);

  const stats = [
    { label: "Total Cars", value: totalCars, icon: Car, color: "from-blue-500/20 to-blue-600/20" },
    { label: "Featured", value: featuredCars, icon: Star, color: "from-yellow-500/20 to-yellow-600/20" },
    { label: "Recent (7d)", value: recentCars, icon: TrendingUp, color: "from-green-500/20 to-green-600/20" },
    { label: "Total Users", value: data?.total_users || 0, icon: Users, color: "from-purple-500/20 to-purple-600/20" },
    { label: "Marketplace", value: data?.total_listings || 0, icon: Package, color: "from-orange-500/20 to-orange-600/20" },
    { label: "Total Views", value: data?.total_views || 0, icon: Eye, color: "from-cyan-500/20 to-cyan-600/20" },
    { label: "Favorites", value: data?.total_favorites || 0, icon: Heart, color: "from-red-500/20 to-red-600/20" },
    { label: "Comments", value: data?.total_comments || 0, icon: MessageSquare, color: "from-pink-500/20 to-pink-600/20" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-medium text-white">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className={`rounded-xl border border-white/10 bg-gradient-to-br ${color} p-6 backdrop-blur`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{value.toLocaleString()}</p>
                </div>
                <Icon className="h-8 w-8 text-white/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
