"use client";

import { createBrowserClient } from "@supabase/ssr";
import { proEnabledClient } from "@/lib/env";
import { normalizeSupabaseUrl } from "./url";

/** Browser Supabase client. Returns null when Supabase isn't configured. */
export function getBrowserSupabase() {
  if (!proEnabledClient()) return null;
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (!url) return null;
  return createBrowserClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
