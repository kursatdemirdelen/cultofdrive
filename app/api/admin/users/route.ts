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

    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    const userIds = authUsers.users.map(u => u.id);

    const { data: carCounts } = await supabase
      .from("cars")
      .select("user_id")
      .in("user_id", userIds);

    const { data: listingCounts } = await supabase
      .from("marketplace_listings")
      .select("seller_id")
      .in("seller_id", userIds);

    const carCountMap = (carCounts || []).reduce((acc, c) => {
      acc[c.user_id] = (acc[c.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const listingCountMap = (listingCounts || []).reduce((acc, l) => {
      acc[l.seller_id] = (acc[l.seller_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const users = authUsers.users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      car_count: carCountMap[u.id] || 0,
      listing_count: listingCountMap[u.id] || 0,
    }));

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch users" },
      { status: err.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
