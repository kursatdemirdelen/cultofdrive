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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    assertAdminKey(req);
    const { id } = await params;
    const body = await req.json();

    const { error } = await supabase
      .from("marketplace_listings")
      .update({ status: body.status })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update listing" },
      { status: err.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    assertAdminKey(req);
    const { id } = await params;

    const { error } = await supabase
      .from("marketplace_listings")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete listing" },
      { status: err.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
