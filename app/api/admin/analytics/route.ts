import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/utils/admin-supabase";

export const runtime = 'nodejs';

function assertAdminKey(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  const validKey = process.env.ADMIN_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!adminKey || adminKey !== validKey) {
    throw new Error("Unauthorized");
  }
}

export async function GET(req: NextRequest) {
  try {
    assertAdminKey(req);
    const supabase = getAdminSupabaseClient();

    const { data: views } = await supabase
      .from("car_views")
      .select("view_count");

    const { data: favorites } = await supabase
      .from("favorites")
      .select("id");

    const { data: comments } = await supabase
      .from("car_comments")
      .select("id");

    const { data: topCars } = await supabase
      .from("cars")
      .select("id, model, views, favorites")
      .order("views", { ascending: false })
      .limit(5);

    const { data: authUsers } = await supabase.auth.admin.listUsers();
    
    const { data: listings } = await supabase
      .from("marketplace_listings")
      .select("id");

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const usersThisWeek = authUsers?.users.filter(u => new Date(u.created_at) > weekAgo).length || 0;
    const usersLastWeek = authUsers?.users.filter(u => {
      const created = new Date(u.created_at);
      return created > twoWeeksAgo && created <= weekAgo;
    }).length || 0;

    const { data: carsThisWeek } = await supabase
      .from("cars")
      .select("id")
      .gte("created_at", weekAgo.toISOString());

    const { data: carsLastWeek } = await supabase
      .from("cars")
      .select("id")
      .gte("created_at", twoWeeksAgo.toISOString())
      .lt("created_at", weekAgo.toISOString());

    const { data: recentCars } = await supabase
      .from("cars")
      .select("model, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: recentListings } = await supabase
      .from("marketplace_listings")
      .select("title, created_at, seller_id")
      .order("created_at", { ascending: false })
      .limit(5);

    const userIds = [
      ...(recentCars || []).map(c => c.user_id),
      ...(recentListings || []).map(l => l.seller_id),
    ].filter(Boolean);

    const userEmailMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const uniqueIds = [...new Set(userIds)];
      for (const uid of uniqueIds) {
        const { data: u } = await supabase.auth.admin.getUserById(uid);
        if (u.user?.email) userEmailMap[uid] = u.user.email;
      }
    }

    const recent_activity = [
      ...(recentCars || []).map(c => ({
        type: "Car Added",
        description: c.model,
        user_email: userEmailMap[c.user_id],
        timestamp: c.created_at,
      })),
      ...(recentListings || []).map(l => ({
        type: "Listing Created",
        description: l.title,
        user_email: userEmailMap[l.seller_id],
        timestamp: l.created_at,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    const total_views = (views || []).reduce((sum, v) => sum + (v.view_count || 0), 0);

    return NextResponse.json({
      total_views,
      total_favorites: favorites?.length || 0,
      total_comments: comments?.length || 0,
      total_users: authUsers?.users.length || 0,
      total_listings: listings?.length || 0,
      growth_data: {
        users_this_week: usersThisWeek,
        users_last_week: usersLastWeek,
        cars_this_week: carsThisWeek?.length || 0,
        cars_last_week: carsLastWeek?.length || 0,
      },
      top_cars: topCars || [],
      recent_activity,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch analytics" },
      { status: err.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
