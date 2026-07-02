import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Prose } from "@/components/ui/Prose";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { regulationIndex } from "@/lib/regulationIndex";

const PATH = "/reports/landlord-regulation-index-2026";

export const metadata: Metadata = {
  title: "The Landlord Regulation Index (2026): All States, Scored & Cited",
  description:
    "Which states regulate small landlords most heavily? A transparent index built from verified, statute-cited rules — deposit caps, interest, deadlines, late-fee caps, and notice periods.",
  alternates: { canonical: PATH },
};

export default function Page() {
  const { ranked, excluded } = regulationIndex();
  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];

  return (
    <Container className="py-8">
      <JsonLd data={breadcrumbLd([{ name: "Reports", path: "/reports" }, { name: "Regulation Index 2026", path: PATH }])} />
      <Breadcrumbs crumbs={[{ name: "Reports", path: "/reports" }, { name: "Regulation Index 2026", path: PATH }]} />

      <article className="mt-4 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          The Landlord Regulation Index ({new Date().getFullYear()})
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          How much statutory regulation binds a small landlord in each state —
          scored transparently from verified, statute-cited rules. {ranked.length}{" "}
          states ranked; {excluded.length} excluded because we haven&apos;t
          verified enough of their rules to score them honestly.
        </p>

        <Prose className="mt-8">
          <h2>Headlines</h2>
          <ul>
            <li><strong>Most regulated (of scored states):</strong> {top.name} — {top.score}/{top.max} points across {top.components.length} verified rule areas.</li>
            <li><strong>Least regulated (of scored states):</strong> {bottom.name} — {bottom.score}/{bottom.max} points.</li>
            <li>This is a <em>regulation intensity</em> measure, not a value judgment: the same score reads as tenant protection from one side and compliance load from the other.</li>
          </ul>
        </Prose>

        <h2 className="mt-10 mb-4 font-display text-2xl font-semibold">The ranking</h2>
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-paper-2 text-left">
                <th className="px-3 py-2 font-semibold text-ink/80">#</th>
                <th className="px-3 py-2 font-semibold text-ink/80">State</th>
                <th className="px-3 py-2 font-semibold text-ink/80">Score</th>
                <th className="px-3 py-2 font-semibold text-ink/80">Verified components</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((e, i) => (
                <tr key={e.code} className="border-t border-line">
                  <td className="px-3 py-2 text-ink/60">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link href={`/laws/${e.slug}`} className="font-medium text-brand-700 hover:underline">{e.name}</Link>
                  </td>
                  <td className="px-3 py-2 font-semibold text-ink">{e.score}/{e.max}</td>
                  <td className="px-3 py-2 text-ink/70">
                    {e.components.map((cc) => `${cc.label} (${cc.points}/${cc.max})`).join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Prose className="mt-10">
          <h2>Methodology</h2>
          <p>
            Each state is scored on up to seven rule areas, using only values we
            have verified against the statute (with a citation and
            last-verified date): a cap on deposit amounts (0–2), mandatory
            interest on deposits (0–2), the deposit return deadline (0–2, more
            points for tighter deadlines), a late-fee cap (0–2; a bare
            &quot;reasonableness&quot; standard scores 1), a mandatory grace
            period (0–1), rent-increase notice length (0–2), and
            month-to-month termination notice length (0–2). Ranking is by score
            <em> share</em>, so states with more verified components aren&apos;t
            penalized. States with fewer than four verified components are
            excluded rather than guessed at.
          </p>
          <p>
            <strong>Excluded pending verification:</strong> {excluded.join(", ")}.
          </p>
          <p>
            Reproduce freely with attribution and a link. Underlying data:
            state pages under <Link href="/laws">/laws</Link> and the{" "}
            <Link href="/press">press &amp; data page</Link>. General
            information, not legal advice.
          </p>
        </Prose>

        <div className="mt-8"><LegalDisclaimer /></div>
      </article>
    </Container>
  );
}
