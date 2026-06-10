import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms for using ${SITE.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Container className="py-10">
      <Prose>
        <h1 className="font-display text-4xl font-semibold text-ink">
          Terms of service
        </h1>
        <p className="mt-4 text-sm text-ink/55">
          This is a starter agreement. Have it reviewed before launch.
        </p>
        <h2>Acceptance</h2>
        <p>
          By using {SITE.name} you agree to these terms and to our{" "}
          <a href="/disclaimer">legal disclaimer</a> and{" "}
          <a href="/privacy">privacy policy</a>.
        </p>
        <h2>Informational use only</h2>
        <p>
          The tools are provided for general information and convenience. They
          are not legal, tax, or financial advice, and outputs may be
          incomplete or out of date. You are solely responsible for verifying
          any result and for your compliance with applicable law.
        </p>
        <h2>Subscriptions</h2>
        <p>
          Pro is billed monthly or annually through Stripe and renews
          automatically until cancelled. You can cancel any time through the
          customer portal; access continues until the end of the paid period.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE.name} is not liable for
          any indirect or consequential damages arising from use of the
          service. The tools are provided &quot;as is.&quot;
        </p>
        <h2>Changes</h2>
        <p>
          We may update these terms; continued use after changes constitutes
          acceptance.
        </p>
      </Prose>
    </Container>
  );
}
