import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LateFeeTool } from "@/components/tools/LateFeeTool";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd, howToLd } from "@/lib/seo";
import { US_STATES } from "@/lib/states";
import { LATE_FEE } from "@/tools/late-fee/data";
import { TOOL_META } from "@/tools/late-fee/content";

const PATH = "/tools/late-fee-calculator";

export const metadata: Metadata = {
  title: "Rent Late Fee Calculator (by State) — Caps & Grace Periods",
  description:
    "Find your state's maximum legal late fee and grace period, then calculate a compliant late fee. Free, no signup.",
  alternates: { canonical: PATH },
};

const faqs = [
  {
    q: "How much can a landlord charge for a late rent payment?",
    a: "It depends on the state. Some cap late fees at a percentage of rent (e.g. Maine 4%, Nevada 5%) or a flat amount (New York: the lesser of $50 or 5%); many states have no fixed cap but require the fee to be reasonable. Pick your state for the exact limit.",
  },
  {
    q: "Can a late fee be higher than the state cap if it's in the lease?",
    a: "No. A lease term setting a late fee above the legal limit is generally void and unenforceable.",
  },
  {
    q: "Is the calculator free?",
    a: "Yes — free and no signup required.",
  },
];

export default function Page() {
  return (
    <Container className="py-8">
      <JsonLd
        data={[
          softwareAppLd({ name: "Rent Late Fee Calculator", description: "State-aware rent late fee cap calculator.", path: PATH }),
          faqLd(faqs),
          howToLd({
            name: "How to check your state's maximum late fee",
            description:
              "Find the legal late-fee cap and grace period for your state, then compute a compliant fee.",
            steps: [
              "Select your state to load its late-fee cap and grace period.",
              "Enter the monthly rent and how many days late the payment is.",
              "Review the maximum lawful fee (or the 'reasonable fee' standard).",
              "Optionally enter your planned fee to check it against the cap.",
            ],
          }),
          breadcrumbLd([{ name: "Tools", path: "/tools" }, { name: "Late Fee Calculator", path: PATH }]),
        ]}
      />
      <Breadcrumbs crumbs={[{ name: "Tools", path: "/tools" }, { name: "Late Fee", path: PATH }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">{TOOL_META.h1}</h1>
        <p className="mt-3 text-lg text-ink/70">{TOOL_META.intro}</p>
      </header>

      <LateFeeTool />

      <Section title="Late fee caps by state">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {US_STATES.filter((s) => LATE_FEE[s.code]).map((s) => {
            const r = LATE_FEE[s.code];
            const label =
              r.capType === "percent" ? `${r.capPercent}%`
                : r.capType === "flat" ? `$${r.capFlat}`
                : r.capType === "percent_or_flat" ? `$${r.capFlat}/${r.capPercent}%`
                : "—";
            return (
              <Link key={s.code} href={`${PATH}/${s.slug}`} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm hover:bg-brand-50">
                <span className="text-ink/80">{s.name}</span>
                <span className="text-ink/45">{label}</span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section title="Frequently asked questions">
        <FaqList faqs={faqs} />
      </Section>
    </Container>
  );
}
