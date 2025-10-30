import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;

    const { data, error } = await supabase
      .from("marketplace_listings")
      .select("*, cars(model, image_url, year)")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Increment view count
    await supabase
      .from("marketplace_listings")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", id);

    return NextResponse.json({ listing: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}
