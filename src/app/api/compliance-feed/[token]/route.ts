import { getServiceSupabase } from "@/lib/supabase/server";
import { getObligations } from "@/tools/compliance-calendar/engine";
import { buildIcs, type CustomDeadline } from "@/tools/compliance-calendar/ical";
import type { ComplianceProfile } from "@/tools/compliance-calendar/obligations";

export const dynamic = "force-dynamic";

// Reminders fire 7 days and 1 day before each deadline, rendered natively by
// the subscriber's calendar app (which pushes to their phone).
const ALARM_DAYS = [7, 1];

const EMPTY_ICS = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//LandlordKit//Compliance Calendar//EN",
  "CALSCALE:GREGORIAN",
  "END:VCALENDAR",
].join("\r\n");

function icsResponse(body: string) {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      // Let calendar clients re-poll but not hammer us; they refresh on their
      // own schedule (typically hourly–daily) regardless.
      "Cache-Control": "public, max-age=3600",
    },
  });
}

/**
 * Per-user subscribable calendar feed (Pro). Unauthenticated by design —
 * calendar apps can't sign in — so the unguessable token in the path is the
 * credential. Returns the user's compliance deadlines as recurring all-day
 * events with built-in reminder alarms. Lapsed/non-Pro owners get an empty
 * calendar (so the subscription quietly stops surfacing deadlines).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const supabase = getServiceSupabase();
  if (!supabase || !token) return icsResponse(EMPTY_ICS);

  const { data: row } = await supabase
    .from("compliance_profiles")
    .select("user_id, profile")
    .eq("feed_token", token)
    .maybeSingle();
  if (!row?.user_id) return icsResponse(EMPTY_ICS);

  // Only keep serving while the owner is an active Pro member.
  const { data: prof } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", row.user_id)
    .maybeSingle();
  const active = prof?.status === "active" || prof?.status === "trialing";
  if (!active) return icsResponse(EMPTY_ICS);

  // The saved row wraps the tool's full state: { profile, custom, completed }.
  const data = (row.profile ?? {}) as {
    profile?: ComplianceProfile;
    custom?: CustomDeadline[];
  };
  if (!data.profile?.state) return icsResponse(EMPTY_ICS);

  const obligations = getObligations(data.profile);
  const ics = buildIcs(obligations, data.custom ?? [], new Date(), ALARM_DAYS);
  return icsResponse(ics);
}
