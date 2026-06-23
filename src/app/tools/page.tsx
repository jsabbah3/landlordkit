import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Callout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "All Landlord Tools",
  description:
    "Free, state-aware tools for small landlords: security deposit interest, rent increase notices, late fees, prorated rent, cash flow and more.",
  alternates: { canonical: "/tools" },
};

const CATEGORIES = [
  "Legal & compliance",
  "Documents",
  "Investing & finance",
] as const;

// Pro-only tools. Shown to everyone here (with a Pro badge) as both discovery
// for members and an upsell for free users; each page gates access itself.
const PRO_TOOLS = [
  {
    name: "Batch rent receipts",
    blurb:
      "Generate a receipt for every unit in one watermark-free PDF — perfect for the 1st of the month.",
    href: "/tools/rent-receipt-generator/batch",
  },
  {
    name: "Lease autofill",
    blurb:
      "Upload a lease PDF and pull the landlord, tenant, property, rent, and deposit into your saved details.",
    href: "/tools/lease-autofill",
  },
];

export default function ToolsPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs crumbs={[{ name: "Tools", path: "/tools" }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Landlord tools
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          Everything is free and runs in your browser. State-aware tools use
          each state&apos;s real rules with statute citations.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-ink/80">
          Pro tools
          <Badge className="bg-accent-400/20 text-accent-600">Pro</Badge>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRO_TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="group">
              <Card className="h-full border-accent-400/50 transition-shadow hover:shadow-md">
                <CardBody>
                  <Badge className="bg-accent-400/20 text-accent-600">Pro</Badge>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                    {t.name}
                  </h3>
                  <p className="mt-2 text-sm text-ink/65">{t.blurb}</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {CATEGORIES.map((cat) => {
        const items = TOOLS.filter((t) => t.category === cat);
        if (!items.length) return null;
        return (
          <section key={cat} className="mb-10">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink/80">
              {cat}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => {
                const inner = (
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardBody>
                      <div className="flex items-center gap-2">
                        {t.stateAware && (
                          <Badge className="bg-brand-100 text-brand-800">
                            50-state
                          </Badge>
                        )}
                        {t.status === "planned" && (
                          <Badge className="bg-paper-2 text-ink/55">
                            Coming soon
                          </Badge>
                        )}
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                        {t.name}
                      </h3>
                      <p className="mt-2 text-sm text-ink/65">{t.blurb}</p>
                    </CardBody>
                  </Card>
                );
                return t.status === "live" ? (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="group">
                    {inner}
                  </Link>
                ) : (
                  <div key={t.slug} className="opacity-70">
                    {inner}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </Container>
  );
}
