import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-line bg-paper-2">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            {SITE.name}
          </p>
          <p className="mt-2 max-w-xs text-sm text-ink/60">{SITE.tagline}.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Tools</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/65">
            {TOOLS.slice(0, 6).map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="hover:text-brand-700"
                >
                  {t.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Learn</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/65">
            <li><Link href="/guides" className="hover:text-brand-700">Guides</Link></li>
            <li><Link href="/tools" className="hover:text-brand-700">All tools</Link></li>
            <li><Link href="/pricing" className="hover:text-brand-700">LandlordKit Pro</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/65">
            <li><Link href="/disclaimer" className="hover:text-brand-700">Disclaimer</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-700">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-brand-700">Terms</Link></li>
          </ul>
        </div>
      </Container>
      <Container className="border-t border-line py-6 text-xs text-ink/50">
        <p>
          © {year} {SITE.name}. Informational tools only — not legal advice. Rental
          laws vary by state, county, and city; always verify the cited statute.
        </p>
      </Container>
    </footer>
  );
}
