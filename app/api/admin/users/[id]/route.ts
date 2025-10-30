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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    assertAdminKey(req);
    const supabase = getAdminSupabaseClient();
    const { id } = await params;

    const { data: authUser } = await supabase.auth.admin.getUserById(id);
    if (!authUser.user) throw new Error("User not found");

    const { data: cars } = await supabase
      .from("cars")
      .select("id, model, year")
      .eq("user_id", id);

    const { data: listings } = await supabase
      .from("marketplace_listings")
      .select("id, title, price")
      .eq("seller_id", id);

    const { data: comments } = await supabase
      .from("car_comments")
      .select("id, comment, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      id: authUser.user.id,
      email: authUser.user.email,
      created_at: authUser.user.created_at,
      cars: cars || [],
      listings: listings || [],
      comments: comments || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch user details" },
      { status: err.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
