import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { env, isLeaseExtractConfigured } from "@/lib/env";
import { getProStatus } from "@/lib/pro";
import { getServiceSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Lease-upload autofill (Pro feature). Receives lease TEXT (already extracted
 * client-side from the PDF — the raw file never leaves the browser), asks Claude
 * to pull the saved-profile fields, and returns them for the user to confirm.
 *
 * Privacy: the lease text is used for this one request and never stored. Only
 * the user-confirmed structured fields persist (client-side, via SavedProfile).
 *
 * Cost: Pro-only + a per-user monthly cap + hard input truncation keep the
 * pay-per-use Anthropic spend bounded. Cheapest capable model (Haiku 4.5).
 */

const MONTHLY_CAP = 10;
// ~12k tokens of lease is plenty; guards against someone pasting a whole book.
const MAX_CHARS = 48_000;

// The fields we extract map 1:1 onto SavedProfile. Strict JSON schema so the
// model can only return these keys, as strings ("" when not found).
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    landlordName: { type: "string" },
    tenantName: { type: "string" },
    propertyAddress: { type: "string" },
    monthlyRent: { type: "string" },
    leaseStartDate: { type: "string" },
    leaseEndDate: { type: "string" },
    securityDeposit: { type: "string" },
  },
  required: [
    "landlordName",
    "tenantName",
    "propertyAddress",
    "monthlyRent",
    "leaseStartDate",
    "leaseEndDate",
    "securityDeposit",
  ],
} as const;

export async function POST(request: Request) {
  if (!isLeaseExtractConfigured()) {
    return NextResponse.json({ error: "Not enabled" }, { status: 503 });
  }

  const { isPro, userId } = await getProStatus();
  if (!userId) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  if (!isPro) return NextResponse.json({ error: "Pro required" }, { status: 403 });

  let text = "";
  try {
    text = String((await request.json())?.text ?? "");
  } catch {
    return NextResponse.json({ error: "Bad body" }, { status: 400 });
  }
  text = text.trim();
  if (text.length < 40) {
    return NextResponse.json(
      { error: "No readable text found — this may be a scanned PDF." },
      { status: 422 },
    );
  }
  text = text.slice(0, MAX_CHARS);

  // Per-user monthly cap. Fails open if the usage table doesn't exist yet
  // (e.g. before the updated schema is applied) — the Pro gate + truncation are
  // the primary cost guards; the cap is a secondary backstop.
  const supabase = getServiceSupabase();
  if (supabase) {
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const { count, error } = await supabase
      .from("lease_extractions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", monthStart.toISOString());
    if (!error && typeof count === "number" && count >= MONTHLY_CAP) {
      return NextResponse.json(
        { error: `Monthly limit reached (${MONTHLY_CAP} leases). Resets next month.` },
        { status: 429 },
      );
    }
  }

  const client = new Anthropic({ apiKey: env.anthropicApiKey });

  let fields: Record<string, string>;
  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system:
        "You extract lease details for a landlord tool. Return ONLY the requested " +
        "fields, copied verbatim from the lease. Use an empty string for anything " +
        "not clearly stated. Do not guess, infer, or add commentary. For dates use " +
        "YYYY-MM-DD when possible; for money return just the number (e.g. 1500).",
      messages: [
        {
          role: "user",
          content: `Extract the fields from this lease:\n\n${text}`,
        },
      ],
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
    });
    const block = message.content.find((b) => b.type === "text");
    fields = JSON.parse(block && block.type === "text" ? block.text : "{}");
  } catch {
    return NextResponse.json({ error: "Extraction failed" }, { status: 502 });
  }

  // Record usage (best-effort — never block the response on logging).
  if (supabase) {
    await supabase
      .from("lease_extractions")
      .insert({ user_id: userId })
      .then(undefined, () => {});
  }

  return NextResponse.json({ fields });
}
