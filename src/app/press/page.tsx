import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Prose } from "@/components/ui/Prose";
import { allStateLegal, fieldEntries } from "@/lib/legal-db";

export const metadata: Metadata = {
  title: "Press & Data — Cite LandlordKit's State Law Datasets",
  description:
    "Free, citable datasets on US landlord-tenant law: deposit interest, late-fee caps, notice periods, return deadlines — every value statute-cited with a verification date.",
  alternates: { canonical: "/press" },
};

export default function PressPage() {
  const states = allStateLegal();
  const verified = states.reduce(
    (n, r) => n + fieldEntries(r).filter((f) => f.confidence === "high" || f.confidence === "medium").length,
    0,
  );

  return (
    <Container className="py-8">
      <Breadcrumbs crumbs={[{ name: "Press & Data", path: "/press" }]} />
      <article className="mt-4 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Press &amp; data</h1>
        <p className="mt-3 text-lg text-ink/70">
          LandlordKit maintains structured, statute-cited datasets on US
          landlord-tenant law. Journalists, researchers, and bloggers may cite
          or reproduce them with attribution and a link.
        </p>

        <Prose className="mt-8">
          <h2>What we maintain</h2>
          <ul>
            <li><strong>{verified} verified data points</strong> across {states.length} jurisdictions: security-deposit caps, interest rules, return deadlines, late-fee caps and grace periods, rent-increase and termination notice periods.</li>
            <li>Every value carries the statute citation, a link to the source where available, a last-verified date, and an honest confidence flag. Values we haven&apos;t verified are marked unverified — never guessed.</li>
            <li>The datasets power the live calculators, so published numbers can&apos;t drift from the source data.</li>
          </ul>

          <h2>Citable assets</h2>
          <ul>
            <li><Link href="/reports/security-deposit-interest-2026">Security Deposit Interest Rates by State (2026)</Link> — report, chart, and <a href="/reports/security-deposit-interest-2026/csv">raw CSV</a>.</li>
            <li><Link href="/reports/landlord-regulation-index-2026">The Landlord Regulation Index (2026)</Link> — transparent scoring of state regulation intensity.</li>
            <li><Link href="/laws">State-by-state law pages</Link> — per-state verified rules with citations.</li>
            <li><Link href="/embed">Embeddable calculators</Link> — add any tool to your site with one snippet.</li>
          </ul>

          <h2>How to cite</h2>
          <p>
            &quot;Source: LandlordKit, <em>[asset name]</em>, getlandlordkit.com,
            accessed [date]&quot; with a link. For custom data pulls, methodology
            questions, or expert comment on state landlord-tenant rules, email{" "}
            <a href="mailto:jsabbah3@gmail.com">jsabbah3@gmail.com</a> — we
            respond fast and can provide worked examples for any state we cover.
          </p>

          <h2>About</h2>
          <p>
            LandlordKit is an independent, founder-run project providing free,
            statute-cited legal and financial tools for the ~10 million
            Americans who own a few rental units. All tools are free without
            signup; the data files are auditable. General information, not
            legal advice.
          </p>
        </Prose>
      </article>
    </Container>
  );
}
