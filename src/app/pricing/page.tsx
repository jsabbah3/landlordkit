import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GoProButton } from "@/components/pro/GoProButton";
import { isStripeConfigured } from "@/lib/env";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "LandlordKit Pro — Pricing",
  description:
    "LandlordKit Pro: saved property details, batch document generation, watermark-free branded PDFs, and a portfolio dashboard. $12/mo or $99/yr.",
  alternates: { canonical: "/pricing" },
};

const freeFeatures = [
  "Every calculator and document generator",
  "State-specific rules with statute citations",
  "PDF downloads (with a small footer)",
  "No account required",
];

const proFeatures = [
  "Saved landlord & property details (no re-typing)",
  "Batch generation — e.g. receipts for every unit at once",
  "Watermark-free PDFs with your own branding",
  "Multi-property portfolio dashboard (income/expense)",
  "All future tools + state-law update notifications",
];

export default function PricingPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs crumbs={[{ name: "Pro", path: "/pricing" }]} />
      <header className="mx-auto mt-4 mb-10 max-w-2xl text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Simple pricing
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          The core tools are free forever. Go Pro when you want to save time
          across multiple properties.
        </p>
      </header>

      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="font-display text-xl font-semibold">Free</h2>
            <p className="mt-1 text-3xl font-semibold">$0</p>
            <ul className="mt-5 space-y-2 text-sm text-ink/70">
              {freeFeatures.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-brand-600">✓</span> {f}
                </li>
              ))}
            </ul>
            <ButtonLink href="/tools" variant="secondary" className="mt-6 w-full">
              Use the free tools
            </ButtonLink>
          </CardBody>
        </Card>

        <Card className="border-brand-300 ring-1 ring-brand-200">
          <CardBody>
            <h2 className="font-display text-xl font-semibold text-brand-700">
              Pro
            </h2>
            <p className="mt-1 text-3xl font-semibold">
              ${SITE.proMonthly}
              <span className="text-base font-normal text-ink/55">/mo</span>
            </p>
            <p className="text-sm text-ink/55">or ${SITE.proAnnual}/year</p>
            <ul className="mt-5 space-y-2 text-sm text-ink/70">
              {proFeatures.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-brand-600">✓</span> {f}
                </li>
              ))}
            </ul>
            {isStripeConfigured() ? (
              <GoProButton plan="monthly" className="mt-6 w-full">
                Go Pro — ${SITE.proMonthly}/mo
              </GoProButton>
            ) : (
              <>
                <ButtonLink href="/account" variant="accent" className="mt-6 w-full">
                  Go Pro
                </ButtonLink>
                <p className="mt-3 text-center text-xs text-ink/45">
                  Stripe checkout coming online at launch.
                </p>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
