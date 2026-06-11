/**
 * Global site configuration. The production URL is read from an env var so the
 * same build works on Vercel previews and the final custom domain.
 */
const FALLBACK_URL = "https://landlordkit.com";

/**
 * Coerce NEXT_PUBLIC_SITE_URL into a valid absolute origin. A bare domain
 * ("landlordkit.com") or a typo would otherwise make `new URL()` throw and
 * crash the whole static build (every page uses the root layout's
 * metadataBase). We add a missing scheme, strip any path/trailing slash, and
 * fall back safely so a mis-set env var can never take the site down.
 */
function resolveSiteUrl(raw?: string): string {
  const candidate = (raw ?? "").trim();
  if (!candidate) return FALLBACK_URL;
  const withScheme = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    return FALLBACK_URL;
  }
}

export const SITE = {
  name: "LandlordKit",
  tagline: "Free, accurate tools for small landlords",
  description:
    "Free online tools for independent US landlords: state-aware security deposit interest calculators, rent increase notices, late fee calculators, and more. Accurate, cited, and instant — no signup required.",
  // Set NEXT_PUBLIC_SITE_URL in Vercel to your real domain (e.g. https://landlordkit.com).
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  twitter: "@landlordkit",
  // Single source of truth for the Pro price shown across the marketing surface.
  proMonthly: 12,
  proAnnual: 99,
} as const;

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean}`;
}
