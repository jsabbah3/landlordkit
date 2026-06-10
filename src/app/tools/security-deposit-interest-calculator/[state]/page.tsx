import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DepositInterestTool } from "@/components/tools/DepositInterestTool";
import { FaqList } from "@/components/Faq";
import { Callout } from "@/components/ui/Callout";
import { StatuteCitation } from "@/components/StatuteCitation";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";
import { getStateBySlug, getStateByCode } from "@/lib/states";
import {
  getDepositRule,
  depositRuleStateCodes,
} from "@/tools/security-deposit-interest/data";
import { buildFaqs, buildExample } from "@/tools/security-deposit-interest/content";

const BASE = "/tools/security-deposit-interest-calculator";

// Pre-render only states that have a substantive rule (avoids thin pages).
export function generateStaticParams() {
  return depositRuleStateCodes().map((code) => ({
    state: getStateByCode(code)!.slug,
  }));
}

// Unknown states 404 rather than rendering an empty page.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};
  return {
    title: `Security Deposit Interest Calculator — ${state.name}`,
    description: `How much security deposit interest do landlords owe tenants in ${state.name}? Calculate it free with ${state.name}'s exact rate, holding period, and statute. PDF statement included.`,
    alternates: { canonical: `${BASE}/${slug}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const rule = getDepositRule(state.code);
  const faqs = buildFaqs(state, rule);
  const example = buildExample(state, rule);
  const path = `${BASE}/${slug}`;

  // Sibling states for internal linking.
  const others = depositRuleStateCodes()
    .filter((c) => c !== state.code)
    .map((c) => getStateByCode(c)!);

  return (
    <Container className="py-8">
      <JsonLd
        data={[
          softwareAppLd({
            name: `Security Deposit Interest Calculator — ${state.name}`,
            description: `Calculate security deposit interest owed under ${state.name} law.`,
            path,
          }),
          faqLd(faqs),
          breadcrumbLd([
            { name: "Tools", path: "/tools" },
            { name: "Security Deposit Interest", path: BASE },
            { name: state.name, path },
          ]),
        ]}
      />

      <Breadcrumbs
        crumbs={[
          { name: "Tools", path: "/tools" },
          { name: "Security Deposit Interest", path: BASE },
          { name: state.name, path },
        ]}
      />

      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Security Deposit Interest Calculator — {state.name}
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          {rule.required === "no"
            ? `${state.name} has no statewide law requiring deposit interest. Here's what that means and how to calculate a figure anyway.`
            : `Calculate the interest you owe a ${state.name} tenant on their security deposit, using the state's own rule and statute.`}
        </p>
      </header>

      <DepositInterestTool lockedStateCode={state.code} />

      <Section title={`How ${state.name} treats security deposit interest`}>
        <div className="max-w-2xl space-y-4 text-ink/75">
          <p>{rule.summary}</p>
          {rule.appliesTo && (
            <Callout tone="info" title="Scope">
              {rule.appliesTo}
            </Callout>
          )}
          <p>
            <span className="font-medium text-ink">When it must be paid: </span>
            {rule.payTiming}
          </p>
          <Callout tone="neutral" title="Worked example">
            {example}
          </Callout>
          <StatuteCitation cite={rule.cite} />
        </div>
      </Section>

      <Section title={`${state.name} security deposit interest FAQ`}>
        <FaqList faqs={faqs} />
      </Section>

      <Section title="Other states">
        <div className="flex flex-wrap gap-2">
          {others.map((s) => (
            <Link
              key={s.code}
              href={`${BASE}/${s.slug}`}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-brand-700 hover:bg-brand-50"
            >
              {s.name}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink/60">
          Need the full picture?{" "}
          <Link href={BASE} className="text-brand-700 underline">
            See the security deposit interest calculator for all states
          </Link>
          .
        </p>
      </Section>
    </Container>
  );
}
