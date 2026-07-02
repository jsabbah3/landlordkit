import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardBody } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Reports & Data Studies",
  description:
    "Original, citable data studies on US landlord-tenant law, built from LandlordKit's verified, statute-cited datasets.",
  alternates: { canonical: "/reports" },
};

const REPORTS = [
  {
    href: "/reports/security-deposit-interest-2026",
    name: "Security Deposit Interest Rates by State (2026)",
    blurb: "The states that require deposit interest, ranked by rate, with every statute cited and the raw data downloadable.",
  },
  {
    href: "/reports/landlord-regulation-index-2026",
    name: "The Landlord Regulation Index (2026)",
    blurb: "A transparent score of how heavily each state regulates small landlords — computed only from verified rules.",
  },
];

export default function ReportsPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs crumbs={[{ name: "Reports", path: "/reports" }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Reports &amp; data studies</h1>
        <p className="mt-3 text-lg text-ink/70">
          Original analyses built from our verified state-law datasets. Free to
          cite with attribution — see the <Link href="/press" className="underline">press &amp; data page</Link>.
        </p>
      </header>
      <div className="grid max-w-3xl gap-4">
        {REPORTS.map((r) => (
          <Link key={r.href} href={r.href} className="group">
            <Card className="transition-shadow group-hover:shadow-md">
              <CardBody>
                <h2 className="font-display text-lg font-semibold text-ink">{r.name}</h2>
                <p className="mt-1 text-sm text-ink/65">{r.blurb}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
