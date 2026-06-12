/**
 * Normalize a Supabase project URL to its bare origin.
 *
 * Supabase's dashboard shows the API URL as `https://<ref>.supabase.co/rest/v1/`,
 * and it's easy to paste that whole string into NEXT_PUBLIC_SUPABASE_URL. The
 * client libraries expect only the origin (`https://<ref>.supabase.co`) and
 * append their own paths, so a pasted `/rest/v1/` produces broken requests that
 * return HTML ("Unexpected token '<'"). We strip any path/trailing slash and add
 * a missing scheme so the value can't be malformed.
 */
export function normalizeSupabaseUrl(raw?: string): string | undefined {
  const v = raw?.trim();
  if (!v) return undefined;
  try {
    return new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`).origin;
  } catch {
    return undefined;
  }
}
