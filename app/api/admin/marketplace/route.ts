import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

    const { data, error } = await supabase
      .from("marketplace_listings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ listings: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch listings" },
      { status: err.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
