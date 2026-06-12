import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { normalizeSupabaseUrl } from "@/lib/supabase/url";

export const dynamic = "force-dynamic";

/**
 * TEMPORARY diagnostic. Returns ONLY non-secret config facts (the resolved
 * Supabase host, whether keys are present, and the first few chars of the anon
 * key so we can tell which key type is set). No secret values are exposed.
 * Remove this route once auth is verified working.
 */
export async function GET() {
  const rawUrl = env.supabaseUrl ?? null;
  return NextResponse.json({
    rawUrlStartsWith: rawUrl ? rawUrl.slice(0, 40) : null,
    resolvedHost: normalizeSupabaseUrl(env.supabaseUrl) ?? null,
    anonKeyPresent: !!env.supabaseAnonKey,
    anonKeyPrefix: env.supabaseAnonKey ? env.supabaseAnonKey.slice(0, 8) : null,
    serviceKeyPresent: !!env.supabaseServiceKey,
  });
}
