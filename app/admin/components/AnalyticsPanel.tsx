"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Eye, Heart, MessageSquare } from "lucide-react";

type Analytics = {
  total_views: number;
  total_favorites: number;
  total_comments: number;
  total_users: number;
  total_listings: number;
  growth_data?: {
    users_this_week: number;
    users_last_week: number;
    cars_this_week: number;
    cars_last_week: number;
  };
  top_cars: Array<{
    id: string;
    model: string;
    views: number;
    favorites: number;
  }>;
  recent_activity?: Array<{
    type: string;
    description: string;
    user_email?: string;
    timestamp: string;
  }>;
};

type Props = {
  adminKey: string;
};

export function AnalyticsPanel({ adminKey }: Props) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!adminKey) return;
    fetchAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/analytics?detailed=true", {
        headers: { "x-admin-key": adminKey },
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-6 w-6 text-white" />
          <h2 className="text-xl font-medium text-white">Analytics</h2>
        </div>
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-6 w-6 text-white" />
        <h2 className="text-xl font-medium text-white">Analytics</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-white/60">Total Views</span>
          </div>
          <p className="text-2xl font-bold text-white">{(analytics.total_views || 0).toLocaleString()}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-red-400" />
            <span className="text-sm text-white/60">Total Favorites</span>
          </div>
          <p className="text-2xl font-bold text-white">{(analytics.total_favorites || 0).toLocaleString()}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-green-400" />
            <span className="text-sm text-white/60">Total Comments</span>
          </div>
          <p className="text-2xl font-bold text-white">{(analytics.total_comments || 0).toLocaleString()}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-white/60">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-white">{(analytics.total_users || 0).toLocaleString()}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-white/60">Total Listings</span>
          </div>
          <p className="text-2xl font-bold text-white">{(analytics.total_listings || 0).toLocaleString()}</p>
        </div>
      </div>

      {analytics.growth_data && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-sm font-medium text-white/80">User Growth</h3>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-xs text-white/50">This Week</p>
                <p className="text-2xl font-bold text-green-400">+{analytics.growth_data.users_this_week}</p>
              </div>
              <div>
                <p className="text-xs text-white/50">Last Week</p>
                <p className="text-xl font-bold text-white/60">{analytics.growth_data.users_last_week}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-sm font-medium text-white/80">Car Growth</h3>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-xs text-white/50">This Week</p>
                <p className="text-2xl font-bold text-blue-400">+{analytics.growth_data.cars_this_week}</p>
              </div>
              <div>
                <p className="text-xs text-white/50">Last Week</p>
                <p className="text-xl font-bold text-white/60">{analytics.growth_data.cars_last_week}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {analytics.top_cars && analytics.top_cars.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-white/80">Top Performing Cars</h3>
            <div className="space-y-2">
            {analytics.top_cars.map((car, idx) => (
            <div
              key={car.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <span className="font-medium text-white">{car.model}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {car.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {car.favorites}
                </span>
              </div>
            </div>
              ))}
            </div>
          </div>
        )}

        {analytics.recent_activity && analytics.recent_activity.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-white/80">Recent Activity</h3>
            <div className="space-y-2">
              {analytics.recent_activity.map((activity, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="inline-block rounded bg-white/10 px-2 py-0.5 text-xs text-white/80">
                        {activity.type}
                      </span>
                      <p className="mt-1 text-sm text-white">{activity.description}</p>
                      {activity.user_email && (
                        <p className="mt-0.5 text-xs text-white/50">by {activity.user_email}</p>
                      )}
                    </div>
                    <span className="text-xs text-white/50 whitespace-nowrap">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
