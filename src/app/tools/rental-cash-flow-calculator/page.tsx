import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CashFlowTool } from "@/components/tools/CashFlowTool";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";

const PATH = "/tools/rental-cash-flow-calculator";

export const metadata: Metadata = {
  title: "Rental Cash Flow & Cash-on-Cash Return Calculator",
  description:
    "Estimate monthly cash flow, cap rate, and cash-on-cash return on a rental property. Includes mortgage, vacancy, and operating expenses. Free, no signup.",
  alternates: { canonical: PATH },
};

const faqs = [
  { q: "How do you calculate rental property cash flow?", a: "Cash flow = effective rental income − operating expenses − mortgage payment. Operating expenses include taxes, insurance, maintenance, management, vacancy, and capital reserves, but not the mortgage (that's financing)." },
  { q: "What is a good cash-on-cash return?", a: "Many investors target 8–12% cash-on-cash, though it depends on the market and your goals. The calculator divides your annual cash flow by the total cash you invested (down payment + closing + rehab)." },
  { q: "What's the difference between cap rate and cash-on-cash?", a: "Cap rate = net operating income ÷ purchase price (ignores financing). Cash-on-cash = annual cash flow ÷ cash invested (includes your mortgage). Both are shown here." },
];

export default function Page() {
  return (
    <Container className="py-8">
      <JsonLd data={[
        softwareAppLd({ name: "Rental Cash Flow Calculator", description: "Estimate cash flow, cap rate, and cash-on-cash return.", path: PATH }),
        faqLd(faqs),
        breadcrumbLd([{ name: "Tools", path: "/tools" }, { name: "Rental Cash Flow Calculator", path: PATH }]),
      ]} />
      <Breadcrumbs crumbs={[{ name: "Tools", path: "/tools" }, { name: "Cash Flow", path: PATH }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Rental Cash Flow Calculator</h1>
        <p className="mt-3 text-lg text-ink/70">Estimate monthly cash flow, cap rate, and cash-on-cash return before you buy. Adjust any input to see the numbers update instantly. Free, no signup.</p>
      </header>
      <CashFlowTool />
      <Section title="Frequently asked questions"><FaqList faqs={faqs} /></Section>
    </Container>
  );
}
