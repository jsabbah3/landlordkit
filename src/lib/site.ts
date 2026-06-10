/**
 * Global site configuration. The production URL is read from an env var so the
 * same build works on Vercel previews and the final custom domain.
 */
export const SITE = {
  name: "LandlordKit",
  tagline: "Free, accurate tools for small landlords",
  description:
    "Free online tools for independent US landlords: state-aware security deposit interest calculators, rent increase notices, late fee calculators, and more. Accurate, cited, and instant — no signup required.",
  // Set NEXT_PUBLIC_SITE_URL in Vercel to your real domain (e.g. https://landlordkit.com).
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://landlordkit.com",
  twitter: "@landlordkit",
  // Single source of truth for the Pro price shown across the marketing surface.
  proMonthly: 12,
  proAnnual: 99,
} as const;

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean}`;
}
