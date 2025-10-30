import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/utils/supabase";
import { getAdminSupabaseClient } from "@/utils/admin-supabase";

export const runtime = 'nodejs';

export async function GET() {
  try {
    const env = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
      nodeEnv: process.env.NODE_ENV,
    };

    let clientTest = "not tested";
    let adminTest = "not tested";

    try {
      const client = getSupabaseClient();
      const { error } = await client.from('cars').select('id').limit(1);
      clientTest = error ? `error: ${error.message}` : "ok";
    } catch (e: any) {
      clientTest = `failed: ${e.message}`;
    }

    try {
      const admin = getAdminSupabaseClient();
      const { error } = await admin.from('cars').select('id').limit(1);
      adminTest = error ? `error: ${error.message}` : "ok";
    } catch (e: any) {
      adminTest = `failed: ${e.message}`;
    }

    return NextResponse.json({
      status: "ok",
      environment: env,
      clientTest,
      adminTest,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
