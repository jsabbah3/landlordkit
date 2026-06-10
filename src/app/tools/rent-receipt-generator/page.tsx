import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RentReceiptTool } from "@/components/tools/RentReceiptTool";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";

const PATH = "/tools/rent-receipt-generator";

export const metadata: Metadata = {
  title: "Rent Receipt Generator — Free PDF, No Signup",
  description:
    "Generate a polished rent receipt PDF instantly. Record the amount, period, and payment method, and give your tenant proof of payment. Free, no signup.",
  alternates: { canonical: PATH },
};

const faqs = [
  { q: "What should a rent receipt include?", a: "The amount paid, the date received, the tenant's name, the property, the rental period covered, the payment method, and who received it. This generator includes all of those fields." },
  { q: "Are landlords required to give rent receipts?", a: "Some states require a receipt on request (especially for cash payments). Even where it isn't required, a receipt protects both parties and is good practice." },
  { q: "Is it free?", a: "Yes — free and no signup. Download a clean PDF receipt instantly." },
];

export default function Page() {
  return (
    <Container className="py-8">
      <JsonLd data={[
        softwareAppLd({ name: "Rent Receipt Generator", description: "Generate a rent receipt PDF.", path: PATH }),
        faqLd(faqs),
        breadcrumbLd([{ name: "Tools", path: "/tools" }, { name: "Rent Receipt Generator", path: PATH }]),
      ]} />
      <Breadcrumbs crumbs={[{ name: "Tools", path: "/tools" }, { name: "Rent Receipt", path: PATH }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Rent Receipt Generator</h1>
        <p className="mt-3 text-lg text-ink/70">Give your tenant clean proof of payment. Fill in the details and download a professional rent receipt PDF instantly. Free, no signup.</p>
      </header>
      <RentReceiptTool />
      <Section title="Frequently asked questions"><FaqList faqs={faqs} /></Section>
    </Container>
  );
}
