import Link from "next/link";
import Script from "next/script";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import { SITE } from "@/lib/site";

/**
 * Site header + the analytics loader. Plausible is loaded only when
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, so dev builds stay clean and we can
 * switch providers later without touching event code (see lib/analytics.ts).
 */
export function SiteHeader() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 font-display text-lg font-semibold text-white"
          >
            L
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            {SITE.name}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/70 sm:flex">
          <Link href="/tools" className="hover:text-brand-700">
            Tools
          </Link>
          <Link href="/guides" className="hover:text-brand-700">
            Guides
          </Link>
          <Link href="/pricing" className="hover:text-brand-700">
            Pro
          </Link>
        </nav>
        <div className="flex items-center gap-1">
          <ButtonLink href="/pricing" size="sm" variant="accent">
            Go Pro
          </ButtonLink>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
