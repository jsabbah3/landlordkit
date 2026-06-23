"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";

/**
 * Fires the Pro conversion event when Stripe redirects the buyer back to
 * /account?checkout=success. The actual subscription is created by the webhook
 * (server-side), which client analytics can't observe — so this success landing
 * is where we close the funnel for GA4. Stripe remains the source of truth for
 * revenue; this exists for funnel attribution.
 *
 * Guarded with sessionStorage so a refresh of the success URL doesn't double-count.
 */
export function CheckoutSuccessTracker() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("checkout") !== "success") return;
    const KEY = "lk_pro_subscribed_fired";
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage blocked — fire anyway, at worst a rare double-count */
    }
    track("pro_subscribed", {});
  }, [params]);

  return null;
}
