"use client";

import { createBrowserClient } from "@supabase/ssr";
import { proEnabledClient } from "@/lib/env";

/** Browser Supabase client. Returns null when Supabase isn't configured. */
export function getBrowserSupabase() {
  if (!proEnabledClient()) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
