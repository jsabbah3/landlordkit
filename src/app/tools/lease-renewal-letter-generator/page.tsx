import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeaseRenewalTool } from "@/components/tools/LeaseRenewalTool";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";

const PATH = "/tools/lease-renewal-letter-generator";

export const metadata: Metadata = {
  title: "Lease Renewal Letter Generator — Free PDF",
  description:
    "Create a professional lease renewal offer letter in seconds, with the new term and rent. Download a clean PDF to send your tenant. Free, no signup.",
  alternates: { canonical: PATH },
};

const faqs = [
  { q: "When should I send a lease renewal letter?", a: "Send it 60–90 days before the current lease ends, so the tenant has time to decide and you can plan for a turnover if they decline." },
  { q: "What should a lease renewal letter include?", a: "The property address, the renewal term, the current and new rent, the response deadline, and a place for both parties to sign. This generator includes all of that." },
  { q: "Is it free?", a: "Yes — free and no signup. You download a ready-to-send PDF." },
];

export default function Page() {
  return (
    <Container className="py-8">
      <JsonLd data={[
        softwareAppLd({ name: "Lease Renewal Letter Generator", description: "Generate a lease renewal offer letter PDF.", path: PATH }),
        faqLd(faqs),
        breadcrumbLd([{ name: "Tools", path: "/tools" }, { name: "Lease Renewal Letter Generator", path: PATH }]),
      ]} />
      <Breadcrumbs crumbs={[{ name: "Tools", path: "/tools" }, { name: "Lease Renewal", path: PATH }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Lease Renewal Letter Generator</h1>
        <p className="mt-3 text-lg text-ink/70">Offer your tenant a renewal in a clean, professional letter — with the new term and rent filled in. Download a PDF in seconds. Free, no signup.</p>
      </header>
      <LeaseRenewalTool />
      <Section title="Frequently asked questions"><FaqList faqs={faqs} /></Section>
    </Container>
  );
}
