import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DepositInterestTool } from "@/components/tools/DepositInterestTool";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";
import { US_STATES } from "@/lib/states";
import {
  DEPOSIT_INTEREST,
  depositRuleStateCodes,
} from "@/tools/security-deposit-interest/data";
import { TOOL_META } from "@/tools/security-deposit-interest/content";

const PATH = "/tools/security-deposit-interest-calculator";

export const metadata: Metadata = {
  title: "Security Deposit Interest Calculator (by State) — Free",
  description:
    "Calculate the interest you owe a tenant on their security deposit. State-specific rates, holding-period rules, and statute citations. Free PDF statement, no signup.",
  alternates: { canonical: PATH },
};

const nationalFaqs = [
  {
    q: "Which states require landlords to pay interest on security deposits?",
    a: `About a dozen states plus several cities require it — including ${depositRuleStateCodes()
      .map((c) => US_STATES.find((s) => s.code === c)?.name)
      .filter(Boolean)
      .join(", ")}. Most other states have no statewide requirement.`,
  },
  {
    q: "Is security deposit interest simple or compound?",
    a: "Every US state that requires deposit interest uses simple (non-compounded) interest. This calculator uses simple interest.",
  },
  {
    q: "Do I need an account to use this calculator?",
    a: "No. It's free, runs entirely in your browser, and you can download a PDF interest statement instantly.",
  },
];

export default function Page() {
  const stateCodesWithRules = depositRuleStateCodes();

  return (
    <Container className="py-8">
      <JsonLd
        data={[
          softwareAppLd({
            name: "Security Deposit Interest Calculator",
            description:
              "State-aware calculator for interest owed on rental security deposits.",
            path: PATH,
          }),
          faqLd(nationalFaqs),
          breadcrumbLd([
            { name: "Tools", path: "/tools" },
            { name: "Security Deposit Interest Calculator", path: PATH },
          ]),
        ]}
      />

      <Breadcrumbs
        crumbs={[
          { name: "Tools", path: "/tools" },
          { name: "Security Deposit Interest", path: PATH },
        ]}
      />

      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          {TOOL_META.h1}
        </h1>
        <p className="mt-3 text-lg text-ink/70">{TOOL_META.intro}</p>
      </header>

      <DepositInterestTool />

      <Section title="Security deposit interest rules by state">
        <p className="mb-4 max-w-2xl text-ink/70">
          Rules vary widely. Select your state in the calculator, or open a
          state page below for the exact rate, holding period, statute, and a
          worked example.
        </p>
        <div className="overflow-hidden rounded-card border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-2 text-ink/60">
              <tr>
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium">Interest required?</th>
                <th className="px-4 py-3 font-medium">Typical rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {stateCodesWithRules.map((code) => {
                const rule = DEPOSIT_INTEREST[code];
                const s = US_STATES.find((x) => x.code === code)!;
                return (
                  <tr key={code} className="hover:bg-paper">
                    <td className="px-4 py-3">
                      <Link
                        href={`${PATH}/${s.slug}`}
                        className="font-medium text-brand-700 hover:underline"
                      >
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 capitalize">{rule.required}</td>
                    <td className="px-4 py-3">
                      {rule.defaultRatePct != null
                        ? `${rule.defaultRatePct}%`
                        : "Bank rate"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Every state">
        <p className="mb-4 max-w-2xl text-ink/70">
          Open your state for its interest rule (or confirmation that none
          applies) plus its security deposit return deadline and rules.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {US_STATES.map((s) => (
            <Link
              key={s.code}
              href={`${PATH}/${s.slug}`}
              className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm hover:bg-brand-50"
            >
              <span className="text-ink/80">{s.name}</span>
              <span className="text-ink/45">
                {DEPOSIT_INTEREST[s.code] ? "interest" : "—"}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Frequently asked questions">
        <FaqList faqs={nationalFaqs} />
      </Section>
    </Container>
  );
}
