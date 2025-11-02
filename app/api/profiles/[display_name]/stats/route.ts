import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(req: Request, ctx: { params: Promise<{ display_name: string }> }) {
  try {
    const { display_name } = await ctx.params;
    const userId = display_name;

    const { data: cars } = await supabase
      .from("cars")
      .select("id")
      .eq("user_id", userId);

    if (!cars || cars.length === 0) {
      return NextResponse.json({
        total_favorites: 0,
        total_comments: 0,
        total_views: 0,
        total_cars: 0,
      });
    }

    const carIds = cars.map((c) => c.id);

    const [favoritesRes, commentsRes, viewsRes] = await Promise.all([
      supabase.from("favorites").select("id", { count: "exact" }).in("car_id", carIds),
      supabase.from("car_comments").select("id", { count: "exact" }).in("car_id", carIds),
      supabase.from("car_views").select("id", { count: "exact" }).in("car_id", carIds),
    ]);

    return NextResponse.json({
      total_favorites: favoritesRes.count || 0,
      total_comments: commentsRes.count || 0,
      total_views: viewsRes.count || 0,
      total_cars: cars.length,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({
      total_favorites: 0,
      total_comments: 0,
      total_views: 0,
      total_cars: 0,
    });
  }
}
