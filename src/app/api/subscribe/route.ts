import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Email-list signup (lead magnet). Stores the address in the `subscribers`
 * table via the service-role client (the table has RLS with no policies, so
 * browsers can never read the list). Duplicate signups return ok.
 */
export async function POST(request: Request) {
  let email = "";
  let source = "";
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    source = String(body?.source ?? "").slice(0, 80);
  } catch {
    /* validated below */
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    // Supabase not configured (e.g. fresh clone) — don't break the download.
    return NextResponse.json({ ok: true, stored: false });
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ error: "Could not save your email — try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored: true });
}
