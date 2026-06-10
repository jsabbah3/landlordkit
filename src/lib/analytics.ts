"use client";

/**
 * Privacy-friendly analytics shim. We funnel every meaningful event through
 * track() so the analytics provider can be swapped (Plausible -> GA4) by
 * editing one file. Events we care about for the funnel:
 *   - tool_used        (a calculation / document was produced)
 *   - pdf_downloaded   (free output created)
 *   - upgrade_prompt_shown / upgrade_clicked (free -> Pro funnel)
 *
 * Plausible is loaded via a <script> tag (see SiteHeader); if it's absent this
 * no-ops safely, so local dev and ad-blocked users never see errors.
 */
type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: EventProps }) => void;
  }
}

export function track(event: string, props?: EventProps): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* never let analytics break the app */
  }
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, props ?? {});
  }
}
