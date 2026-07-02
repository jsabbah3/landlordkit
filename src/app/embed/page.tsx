import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardBody } from "@/components/ui/Card";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Embed Our Free Landlord Calculators",
  description:
    "Add LandlordKit's statute-cited landlord calculators to your own site with one iframe snippet — free, with attribution.",
  alternates: { canonical: "/embed" },
};

const TOOLS = [
  { slug: "late-fee-calculator", name: "Rent Late Fee Calculator", blurb: "State late-fee caps and grace periods, statute-cited." },
  { slug: "security-deposit-interest-calculator", name: "Security Deposit Interest Calculator", blurb: "Computes the interest owed under each state's rule." },
  { slug: "prorated-rent-calculator", name: "Prorated Rent Calculator", blurb: "All three accepted proration methods, side by side." },
];

export default function EmbedIndexPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs crumbs={[{ name: "Embed", path: "/embed" }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Embed our calculators on your site
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          Property-management blogs, landlord associations, and legal-aid sites
          can add any calculator below with one snippet. Free to use; the only
          requirement is keeping the attribution link intact. The tools run
          entirely in the visitor&apos;s browser and update automatically when
          state rules change.
        </p>
      </header>

      <div className="max-w-3xl space-y-6">
        {TOOLS.map((t) => (
          <Card key={t.slug}>
            <CardBody>
              <h2 className="font-display text-lg font-semibold">{t.name}</h2>
              <p className="mt-1 text-sm text-ink/65">{t.blurb}</p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-ink p-4 text-xs leading-relaxed text-paper">
{`<iframe
  src="${SITE.url}/embed/${t.slug}"
  title="${t.name} — LandlordKit"
  width="100%" height="720" frameborder="0"
  loading="lazy" style="border:1px solid #e5e1d8;border-radius:12px">
</iframe>`}
              </pre>
            </CardBody>
          </Card>
        ))}
        <p className="text-sm text-ink/60">
          Want a different tool, a specific state pre-selected, or a white-label
          version? Email us — see the <a href="/press" className="underline">press &amp; data page</a>.
        </p>
      </div>
    </Container>
  );
}
