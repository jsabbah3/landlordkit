import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} handles your data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Container className="py-10">
      <Prose>
        <h1 className="font-display text-4xl font-semibold text-ink">
          Privacy policy
        </h1>
        <p className="mt-4 text-sm text-ink/55">
          This is a starter policy. Have it reviewed before launch.
        </p>
        <h2>Free tools run in your browser</h2>
        <p>
          The free calculators and document generators run entirely in your
          browser. The numbers and text you enter are <strong>not sent to our
          servers</strong> and are not stored by us. PDFs are generated locally
          on your device.
        </p>
        <h2>Analytics</h2>
        <p>
          We use privacy-friendly, cookieless analytics to understand which
          tools are used and how visitors find us. This does not track you
          across other websites and does not collect personal information.
        </p>
        <h2>Pro accounts</h2>
        <p>
          If you create a Pro account, we store the information needed to
          provide the service (such as your email, saved property details, and
          subscription status) using our processors (Supabase for accounts and
          Stripe for payments). We never see or store full card numbers.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about privacy? Email{" "}
          <a href="mailto:hello@landlordkit.com">hello@landlordkit.com</a>.
        </p>
      </Prose>
    </Container>
  );
}
