import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(req: Request) {
  try {
    const { content_type, content_id, reason, description } = await req.json();

    if (!content_type || !content_id || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await supabase.from("reports").insert({
      content_type,
      content_id,
      reason,
      description: description || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
