import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DepositReturnTool } from "@/components/tools/DepositReturnTool";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";
import { US_STATES } from "@/lib/states";
import { DEPOSIT_RETURN } from "@/tools/security-deposit-return/data";
import { TOOL_META } from "@/tools/security-deposit-return/content";

const PATH = "/tools/security-deposit-return-tracker";

export const metadata: Metadata = {
  title: "Security Deposit Return Deadline Tracker (by State)",
  description:
    "How long does a landlord have to return a security deposit? See your state's deadline, itemize deductions, and download an itemized statement. Free.",
  alternates: { canonical: PATH },
};

const faqs = [
  {
    q: "How long does a landlord have to return a security deposit?",
    a: "Most states require return within 14 to 60 days of move-out, often with an itemized list of deductions. Pick your state for the exact deadline and penalty.",
  },
  {
    q: "Do I have to itemize deductions?",
    a: "Most states require an itemized statement of any deductions. Even where it isn't strictly required, itemizing protects you in a dispute.",
  },
  {
    q: "Is the tracker free?",
    a: "Yes — free, no signup, with a downloadable itemized statement PDF.",
  },
];

export default function Page() {
  return (
    <Container className="py-8">
      <JsonLd
        data={[
          softwareAppLd({ name: "Security Deposit Return Tracker", description: "State-aware deposit return deadline and itemized statement tool.", path: PATH }),
          faqLd(faqs),
          breadcrumbLd([{ name: "Tools", path: "/tools" }, { name: "Deposit Return Tracker", path: PATH }]),
        ]}
      />
      <Breadcrumbs crumbs={[{ name: "Tools", path: "/tools" }, { name: "Deposit Return", path: PATH }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">{TOOL_META.h1}</h1>
        <p className="mt-3 text-lg text-ink/70">{TOOL_META.intro}</p>
      </header>

      <DepositReturnTool />

      <Section title="Deposit return deadlines by state">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {US_STATES.filter((s) => DEPOSIT_RETURN[s.code]).map((s) => (
            <Link key={s.code} href={`${PATH}/${s.slug}`} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm hover:bg-brand-50">
              <span className="text-ink/80">{s.name}</span>
              <span className="text-ink/45">{DEPOSIT_RETURN[s.code].deadlineDays}d</span>
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
