import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const viewsResult = await supabase
      .from("car_views")
      .select("*", { count: "exact", head: true });

    const favoritesResult = await supabase
      .from("favorites")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      views: viewsResult.count || 0,
      favorites: favoritesResult.count || 0,
    });
  } catch (error) {
    return NextResponse.json({ views: 0, favorites: 0 });
  }
}
