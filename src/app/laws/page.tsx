import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardBody } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { hubStates, pendingStates, buildHub, verifiedFieldCount } from "@/lib/lawHub";
import { getStateLegal } from "@/lib/legal-db";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Landlord-Tenant Law by State (${YEAR}) — Verified, Statute-Cited`,
  description:
    "State-by-state landlord-tenant rules — security deposits, late fees, rent increase notice — every value cited to its statute with a last-verified date.",
  alternates: { canonical: "/laws" },
};

export default function LawsIndexPage() {
  const live = hubStates();
  const pending = pendingStates();

  return (
    <Container className="py-8">
      <JsonLd data={breadcrumbLd([{ name: "State Laws", path: "/laws" }])} />
      <Breadcrumbs crumbs={[{ name: "State Laws", path: "/laws" }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Landlord-Tenant Law by State ({YEAR})
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          The rules that actually bind small landlords — deposits, late fees,
          notice periods — with the statute cited and a last-verified date on
          every value. States appear here once enough of their rules are
          verified; we never publish a guess.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {live.map((s) => {
          const rec = getStateLegal(s.code)!;
          const hub = buildHub(s.code)!;
          const highlight = hub.sections[0]?.rows[0];
          return (
            <Link key={s.code} href={`/laws/${s.slug}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardBody>
                  <h2 className="font-display text-lg font-semibold text-ink">{s.name}</h2>
                  <p className="mt-1 text-sm text-ink/65">
                    {verifiedFieldCount(rec)} verified rules
                    {highlight ? ` — e.g. ${highlight.label.toLowerCase()}: ${highlight.value}` : ""}
                  </p>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>

      {pending.length > 0 && (
        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-xl font-semibold text-ink/80">
            In the verification queue
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            {pending.map((s) => s.name).join(", ")}. Their pages publish as we
            verify each rule against the statute — the state-aware calculators
            already cover several of these with per-value confidence flags.
          </p>
        </section>
      )}
    </Container>
  );
}
