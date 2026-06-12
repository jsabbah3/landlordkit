"use client";

/**
 * Privacy-friendly analytics shim. Every meaningful event goes through track()
 * so the provider can be swapped by editing one file. Two providers supported,
 * both optional and env-gated (set one in Vercel):
 *   - GA4:       NEXT_PUBLIC_GA_ID        (free forever, custom events included)
 *   - Plausible: NEXT_PUBLIC_PLAUSIBLE_DOMAIN  (paid after trial, cookieless)
 *
 * Funnel events used across the app:
 *   tool_used, pdf_downloaded, result_shared,
 *   email_signup (lead magnet), upgrade_prompt_shown, upgrade_clicked
 */
type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: EventProps }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props?: EventProps): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
    window.gtag?.("event", event, props ?? {});
  } catch {
    /* never let analytics break the app */
  }
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, props ?? {});
  }
}
