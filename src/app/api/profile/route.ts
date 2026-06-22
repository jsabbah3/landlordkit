import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { getProStatus } from "@/lib/pro";

export const dynamic = "force-dynamic";

/**
 * Cloud save/load for the Layer-1 landlord/property profile (Pro only). RLS
 * ensures a user only reads/writes their own row. Anonymous or free users get
 * localStorage instead — this is the cross-device sync tier gated behind Pro.
 */
export async function GET() {
  const supabase = await getServerSupabase();
  if (!supabase) return NextResponse.json({ profile: null });
  const { isPro, userId } = await getProStatus();
  if (!userId) return NextResponse.json({ profile: null });
  if (!isPro) return NextResponse.json({ error: "Pro required" }, { status: 403 });

  const { data } = await supabase
    .from("landlord_profiles")
    .select("profile")
    .eq("user_id", userId)
    .maybeSingle();
  return NextResponse.json({ profile: data?.profile ?? null });
}

export async function POST(request: Request) {
  const supabase = await getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { isPro, userId } = await getProStatus();
  if (!userId) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  if (!isPro) return NextResponse.json({ error: "Pro required" }, { status: 403 });

  let profile: unknown = null;
  try {
    profile = (await request.json())?.profile ?? null;
  } catch {
    return NextResponse.json({ error: "Bad body" }, { status: 400 });
  }
  if (!profile || typeof profile !== "object") {
    return NextResponse.json({ error: "Invalid profile" }, { status: 400 });
  }

  const { error } = await supabase
    .from("landlord_profiles")
    .upsert(
      { user_id: userId, profile, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
  if (error) return NextResponse.json({ error: "Save failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
