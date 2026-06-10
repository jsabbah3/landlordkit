import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RentIncreaseNoticeTool } from "@/components/tools/RentIncreaseNoticeTool";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";
import { US_STATES } from "@/lib/states";
import { RENT_INCREASE } from "@/tools/rent-increase-notice/data";
import { TOOL_META } from "@/tools/rent-increase-notice/content";

const PATH = "/tools/rent-increase-notice-generator";

export const metadata: Metadata = {
  title: "Rent Increase Notice Generator (All 50 States) — Free PDF",
  description:
    "Generate a compliant rent increase letter with your state's required notice period and rent-control caveats. Free PDF download, no signup.",
  alternates: { canonical: PATH },
};

const faqs = [
  {
    q: "How much notice do I have to give to raise rent?",
    a: "Most US states require at least 30 days' written notice for a month-to-month tenancy, but several require 60 or 90 days — and some scale the notice with the size of the increase or the length of tenancy. Pick your state for the exact rule.",
  },
  {
    q: "Can I raise the rent during a fixed-term lease?",
    a: "Usually not. Rent is generally locked for the fixed term unless the lease allows an increase. Increases typically take effect at renewal or during a month-to-month tenancy.",
  },
  {
    q: "Does the generated letter cost anything?",
    a: "No. The generator is free and requires no signup. You download a ready-to-send PDF.",
  },
];

export default function Page() {
  return (
    <Container className="py-8">
      <JsonLd
        data={[
          softwareAppLd({
            name: "Rent Increase Notice Generator",
            description:
              "Generate a state-compliant rent increase notice letter with the correct notice period.",
            path: PATH,
          }),
          faqLd(faqs),
          breadcrumbLd([
            { name: "Tools", path: "/tools" },
            { name: "Rent Increase Notice Generator", path: PATH },
          ]),
        ]}
      />

      <Breadcrumbs
        crumbs={[
          { name: "Tools", path: "/tools" },
          { name: "Rent Increase Notice", path: PATH },
        ]}
      />

      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          {TOOL_META.h1}
        </h1>
        <p className="mt-3 text-lg text-ink/70">{TOOL_META.intro}</p>
      </header>

      <RentIncreaseNoticeTool />

      <Section title="Rent increase notice periods by state">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {US_STATES.filter((s) => RENT_INCREASE[s.code]).map((s) => (
            <Link
              key={s.code}
              href={`${PATH}/${s.slug}`}
              className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm hover:bg-brand-50"
            >
              <span className="text-ink/80">{s.name}</span>
              <span className="text-ink/45">
                {RENT_INCREASE[s.code].baseNoticeDays}d
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Frequently asked questions">
        <FaqList faqs={faqs} />
      </Section>
    </Container>
  );
}
