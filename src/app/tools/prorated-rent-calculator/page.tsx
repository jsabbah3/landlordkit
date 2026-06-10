import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProratedRentTool } from "@/components/tools/ProratedRentTool";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";

const PATH = "/tools/prorated-rent-calculator";

export const metadata: Metadata = {
  title: "Prorated Rent Calculator — Free, All Methods",
  description:
    "Calculate fair prorated rent for a partial first or last month. Compare the actual-days, 30-day, and banker's-year methods side by side. Free, no signup.",
  alternates: { canonical: PATH },
};

const faqs = [
  { q: "How is prorated rent calculated?", a: "Divide the monthly rent by the number of days in the month (or by 30, or annual rent by 365), then multiply by the number of days the tenant occupies the unit. The most common method divides by the actual days in the month." },
  { q: "Which proration method should I use?", a: "Most landlords use the actual-days method (rent ÷ days in month). Whatever you choose, state it in the lease so it's consistent and enforceable." },
  { q: "Is the calculator free?", a: "Yes — free and no signup. It shows all three methods so you can pick the fairest one." },
];

export default function Page() {
  return (
    <Container className="py-8">
      <JsonLd data={[
        softwareAppLd({ name: "Prorated Rent Calculator", description: "Calculate prorated rent across three methods.", path: PATH }),
        faqLd(faqs),
        breadcrumbLd([{ name: "Tools", path: "/tools" }, { name: "Prorated Rent Calculator", path: PATH }]),
      ]} />
      <Breadcrumbs crumbs={[{ name: "Tools", path: "/tools" }, { name: "Prorated Rent", path: PATH }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Prorated Rent Calculator</h1>
        <p className="mt-3 text-lg text-ink/70">Tenant moving in or out mid-month? Calculate the fair prorated rent — and compare all three accepted methods side by side. Free, no signup.</p>
      </header>
      <ProratedRentTool />
      <Section title="Frequently asked questions"><FaqList faqs={faqs} /></Section>
    </Container>
  );
}
