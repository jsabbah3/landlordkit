import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal Disclaimer",
  description:
    "LandlordKit provides general informational tools, not legal advice.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <Container className="py-10">
      <Prose>
        <h1 className="font-display text-4xl font-semibold text-ink">
          Legal disclaimer
        </h1>
        <p className="mt-4">
          {SITE.name} provides free, general-purpose informational tools for
          landlords and rental-property owners. <strong>It is not a law firm
          and does not provide legal, tax, or financial advice.</strong>
        </p>
        <h2>No attorney–client relationship</h2>
        <p>
          Using these tools does not create an attorney–client relationship.
          The calculations, documents, and state summaries are provided for
          general information only and may not reflect the most current law.
        </p>
        <h2>Laws vary and change</h2>
        <p>
          Landlord–tenant law varies by state, county, and city, and changes
          frequently. Where we cite a statute, we show the date the value was
          last verified and a confidence indicator. You are responsible for
          confirming the current rule that applies to your situation — always
          read the cited statute and consult a licensed attorney before acting.
        </p>
        <h2>No warranty</h2>
        <p>
          The tools are provided &quot;as is,&quot; without warranty of any
          kind. {SITE.name} is not liable for any loss arising from reliance on
          the tools or their output.
        </p>
      </Prose>
    </Container>
  );
}
