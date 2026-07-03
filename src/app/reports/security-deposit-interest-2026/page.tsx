import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Prose } from "@/components/ui/Prose";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { US_STATES } from "@/lib/states";
import { DEPOSIT_INTEREST } from "@/tools/security-deposit-interest/data";
import { getGuideTable } from "@/content/guideTables";

const PATH = "/reports/security-deposit-interest-2026";

export const metadata: Metadata = {
  title: "Security Deposit Interest Rates by State: The 2026 Report",
  description:
    "Which US states require landlords to pay interest on security deposits in 2026, at what rate, and under which statute. Verified against primary sources; free to cite with attribution.",
  alternates: { canonical: PATH },
};

const NAME = new Map(US_STATES.map((s) => [s.code, s.name]));

export default function Page() {
  const entries = Object.entries(DEPOSIT_INTEREST).filter(([, r]) => r.required === "yes");
  // Chart only states with a true fixed/published percentage; formula-based
  // rates (MD's Treasury floor, DC's semi-annual savings rate) would chart
  // misleadingly at their floor value.
  const rated = entries
    .filter(([, r]) => typeof r.defaultRatePct === "number" && !r.rateLabel)
    .sort((a, b) => (b[1].defaultRatePct ?? 0) - (a[1].defaultRatePct ?? 0));
  const bankRate = entries.filter(([, r]) => typeof r.defaultRatePct !== "number" || r.rateLabel);
  const max = Math.max(...rated.map(([, r]) => r.defaultRatePct ?? 0));
  const table = getGuideTable("deposit-interest");
  const barH = 26;
  const chartH = rated.length * barH + 8;

  return (
    <Container className="py-8">
      <JsonLd data={breadcrumbLd([{ name: "Reports", path: "/reports" }, { name: "Deposit Interest 2026", path: PATH }])} />
      <Breadcrumbs crumbs={[{ name: "Reports", path: "/reports" }, { name: "Deposit Interest 2026", path: PATH }]} />

      <article className="mt-4 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Security Deposit Interest Rates by State: The 2026 Report
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          {entries.length} states (including DC) require landlords to pay
          interest on tenant security deposits. Rates run from a fraction of a
          percent to a statutory 5% — this report maps every rule to its
          statute, verified against primary sources.
        </p>

        <Prose className="mt-8">
          <h2>Key findings</h2>
          <ul>
            <li><strong>{entries.length} of 51 jurisdictions</strong> require deposit interest; the other {51 - entries.length} require none at all.</li>
            <li><strong>Massachusetts, Ohio, and Florida</strong> set the highest fixed benchmark at 5% — though Ohio applies it only to the amount above one month&apos;s rent after 6 months, and Florida only when the landlord elects an interest-bearing account.</li>
            <li><strong>{bankRate.length} states</strong> peg the obligation to the actual bank account rate rather than a fixed figure.</li>
            <li>Several states publish the rate annually (Connecticut, Maryland, DC, North Dakota, Illinois) — a landlord can be compliant one year and out of compliance the next without touching anything.</li>
          </ul>
        </Prose>

        <h2 className="mt-10 mb-4 font-display text-2xl font-semibold">Statutory / published rates, ranked</h2>
        <svg viewBox={`0 0 640 ${chartH}`} role="img" aria-label="Bar chart of security deposit interest rates by state" className="w-full rounded-card border border-line bg-white p-2">
          {rated.map(([code, r], i) => {
            const w = Math.max(4, ((r.defaultRatePct ?? 0) / max) * 420);
            const y = i * barH + 6;
            return (
              <g key={code}>
                <text x={150} y={y + 13} textAnchor="end" fontSize="12" fill="#3d4a44">{NAME.get(code)}</text>
                <rect x={160} y={y} width={w} height={barH - 9} rx={3} fill="#2f7d60" />
                <text x={166 + w} y={y + 13} fontSize="12" fill="#1a4d3b" fontWeight="600">{r.defaultRatePct}%</text>
              </g>
            );
          })}
        </svg>
        <p className="mt-2 text-xs text-ink/55">
          Published-annually rates shown at their most recent published value.
          Not charted (rate depends on a formula or the deposit&apos;s actual
          bank account): {bankRate.map(([c]) => NAME.get(c)).join(", ")} — see
          the table below for each rule.
        </p>

        <h2 className="mt-10 mb-4 font-display text-2xl font-semibold">The full table</h2>
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-paper-2 text-left">
                {table.headers.map((h) => <th key={h} className="px-3 py-2 font-semibold text-ink/80">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.stateSlug} className="border-t border-line">
                  <td className="px-3 py-2">
                    <Link href={`/tools/${table.toolSlug}/${row.stateSlug}`} className="font-medium text-brand-700 hover:underline">{row.stateName}</Link>
                  </td>
                  {row.cells.map((c, i) => <td key={i} className="px-3 py-2 text-ink/75">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Prose className="mt-10">
          <h2>Methodology &amp; how to cite</h2>
          <p>
            Every value is checked against the state statute (or the official
            published rate) and carries a last-verified date; at least two
            sources are cross-checked before a value is marked verified. The
            same data files power our <Link href="/tools/security-deposit-interest-calculator">state calculators</Link>,
            so this report can&apos;t drift from the live tools.
          </p>
          <p>
            Journalists and researchers may reproduce this table with
            attribution and a link to LandlordKit. Download the raw data as{" "}
            <a href={`${PATH}/csv`}>CSV</a>, or see the <Link href="/press">press &amp; data page</Link>.
            General information, not legal advice.
          </p>
        </Prose>

        <div className="mt-8"><LegalDisclaimer /></div>
      </article>
    </Container>
  );
}
