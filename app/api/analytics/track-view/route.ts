import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(req: Request) {
  try {
    const { car_id, user_id } = await req.json();

    if (!car_id) {
      return NextResponse.json({ error: "car_id required" }, { status: 400 });
    }

    const ip_address = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const user_agent = req.headers.get("user-agent") || "unknown";

    await supabase.from("car_views").insert({
      car_id,
      user_id: user_id || null,
      ip_address,
      user_agent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
