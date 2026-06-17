import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Cloud save/load for a user's Compliance Calendar profile (Pro). RLS ensures a
 * user only ever reads/writes their own row. Anonymous users persist locally in
 * the browser instead (see ComplianceCalendarTool) — this is the cross-device tier.
 */
export async function GET() {
  const supabase = await getServerSupabase();
  if (!supabase) return NextResponse.json({ profile: null });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  const { data } = await supabase
    .from("compliance_profiles")
    .select("profile")
    .eq("user_id", user.id)
    .maybeSingle();
  return NextResponse.json({ profile: data?.profile ?? null });
}

export async function POST(request: Request) {
  const supabase = await getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

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
    .from("compliance_profiles")
    .upsert({ user_id: user.id, profile, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) return NextResponse.json({ error: "Save failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
