import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("cars")
      .select(`
        user_id,
        user_profiles!cars_user_id_fkey(display_name, slug)
      `)
      .not("user_id", "is", null);

    if (error) throw error;

    const driverCounts = (data || []).reduce((acc: Record<string, { display_name: string; slug: string; count: number }>, car: any) => {
      const profile = Array.isArray(car.user_profiles) ? car.user_profiles[0] : car.user_profiles;
      if (!profile?.display_name) return acc;
      
      const key = profile.display_name;
      if (!acc[key]) {
        acc[key] = { display_name: profile.display_name, slug: profile.slug || profile.display_name, count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {});

    const drivers = Object.values(driverCounts)
      .map(({ display_name, slug, count }) => ({ owner: display_name, slug, car_count: count }))
      .sort((a, b) => b.car_count - a.car_count)
      .slice(0, 12);

    return NextResponse.json({ drivers });
  } catch (error) {
    console.error("Failed to fetch top drivers:", error);
    return NextResponse.json({ drivers: [] });
  }
}
