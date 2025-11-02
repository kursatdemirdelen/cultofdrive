import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(req: Request, ctx: { params: Promise<{ display_name: string }> }) {
  try {
    const { display_name } = await ctx.params;
    const decodedName = decodeURIComponent(display_name);

    // Try to find by slug first, then by display_name
    let { data: profile, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("slug", decodedName.toLowerCase())
      .maybeSingle();
    
    // Fallback to display_name if slug not found
    if (!profile) {
      const result = await supabase
        .from("user_profiles")
        .select("*")
        .ilike("display_name", decodedName)
        .maybeSingle();
      profile = result.data;
      error = result.error;
    }

    if (error) throw error;
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
