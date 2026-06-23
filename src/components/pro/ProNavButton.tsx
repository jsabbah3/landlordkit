"use client";

import { ButtonLink } from "@/components/ui/Button";
import { useProStatus } from "@/lib/useProStatus";

/**
 * Header CTA. Shows "Go Pro" to free/anonymous visitors and "Account" to
 * existing Pro members, so paying customers aren't nagged to upgrade again.
 * Client-side so the header stays statically rendered across all pages.
 */
export function ProNavButton() {
  const { isPro, loading } = useProStatus();

  if (!loading && isPro) {
    return (
      <ButtonLink href="/account" size="sm" variant="secondary">
        Account
      </ButtonLink>
    );
  }

  return (
    <ButtonLink href="/pricing" size="sm" variant="accent">
      Go Pro
    </ButtonLink>
  );
}
