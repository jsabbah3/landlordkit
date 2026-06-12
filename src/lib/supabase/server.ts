import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, isSupabaseConfigured } from "@/lib/env";
import { normalizeSupabaseUrl } from "./url";

/**
 * Supabase client for Server Components and Route Handlers (reads/writes the
 * auth cookie). Returns null when Supabase isn't configured so callers can
 * degrade gracefully instead of throwing at build/runtime.
 */
export async function getServerSupabase() {
  if (!isSupabaseConfigured()) return null;
  const url = normalizeSupabaseUrl(env.supabaseUrl);
  if (!url) return null;
  const cookieStore = await cookies();
  return createServerClient(url, env.supabaseAnonKey!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies are read-only — safe
          // to ignore; the session is refreshed on the next route handler hit.
        }
      },
    },
  });
}

/** Service-role client for webhooks (bypasses RLS). Server-only, never exposed. */
export function getServiceSupabase() {
  const url = normalizeSupabaseUrl(env.supabaseUrl);
  if (!url || !env.supabaseServiceKey) return null;
  return createServerClient(url, env.supabaseServiceKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
