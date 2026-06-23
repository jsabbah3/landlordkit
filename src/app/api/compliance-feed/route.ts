import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { getProStatus } from "@/lib/pro";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Mints (or returns) the private calendar-feed token for a signed-in Pro user
 * and hands back the subscribe URL. The feed itself lives at
 * /api/compliance-feed/[token] and is unauthenticated — the token is the
 * credential — so it stays out of any indexable/guessable space.
 *
 * The user should cloud-save their compliance profile first (the feed reads
 * that saved row); a fresh row with no profile simply yields an empty calendar.
 */
export async function POST() {
  const supabase = await getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { isPro, userId } = await getProStatus();
  if (!userId) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  if (!isPro) return NextResponse.json({ error: "Pro required" }, { status: 403 });

  const { data: existing } = await supabase
    .from("compliance_profiles")
    .select("feed_token")
    .eq("user_id", userId)
    .maybeSingle();

  let token = existing?.feed_token as string | undefined;
  if (!token) {
    token = crypto.randomUUID();
    const { error } = await supabase
      .from("compliance_profiles")
      .upsert(
        { user_id: userId, feed_token: token, updated_at: new Date().toISOString() },
        { onConflict: "user_id" },
      );
    if (error) return NextResponse.json({ error: "Could not enable reminders" }, { status: 500 });
  }

  const httpsUrl = `${SITE.url}/api/compliance-feed/${token}`;
  // webcal:// makes most calendar apps offer a one-click "subscribe".
  const webcalUrl = httpsUrl.replace(/^https?:/, "webcal:");
  return NextResponse.json({ url: httpsUrl, webcal: webcalUrl });
}
