import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * Supabase client for Server Components and Route Handlers (reads/writes the
 * auth cookie). Returns null when Supabase isn't configured so callers can
 * degrade gracefully instead of throwing at build/runtime.
 */
export async function getServerSupabase() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
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
  if (!env.supabaseUrl || !env.supabaseServiceKey) return null;
  return createServerClient(env.supabaseUrl, env.supabaseServiceKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
