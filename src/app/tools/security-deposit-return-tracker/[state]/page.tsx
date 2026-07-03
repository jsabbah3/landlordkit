import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DepositReturnTool } from "@/components/tools/DepositReturnTool";
import { FaqList } from "@/components/Faq";
import { Callout } from "@/components/ui/Callout";
import { StatuteCitation } from "@/components/StatuteCitation";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";
import { getStateBySlug, getStateByCode } from "@/lib/states";
import { getDepositReturnRule, depositReturnStateCodes } from "@/tools/security-deposit-return/data";
import { buildSummary, buildFaqs } from "@/tools/security-deposit-return/content";

const BASE = "/tools/security-deposit-return-tracker";

export function generateStaticParams() {
  return depositReturnStateCodes().map((code) => ({ state: getStateByCode(code)!.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  const rule = state && getDepositReturnRule(state.code);
  if (!state || !rule) return {};
  const low = rule.cite.confidence === "low";
  return {
    // Low-confidence: no number in the title, noindex until statute-verified.
    title: low
      ? `Security Deposit Return Tracker — ${state.name}`
      : `Security Deposit Return Deadline — ${state.name} (${rule.deadlineDays} Days)`,
    description: `How long does a landlord have to return a security deposit in ${state.name}? See the deadline, itemize deductions, and download a statement. Free.`,
    alternates: { canonical: `${BASE}/${slug}` },
    ...(low ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  const rule = state && getDepositReturnRule(state.code);
  if (!state || !rule) notFound();

  const summary = buildSummary(state, rule);
  const faqs = buildFaqs(state, rule);
  const path = `${BASE}/${slug}`;
  const others = depositReturnStateCodes().filter((c) => c !== state.code).map((c) => getStateByCode(c)!);

  return (
    <Container className="py-8">
      <JsonLd
        data={[
          softwareAppLd({ name: `Security Deposit Return Tracker — ${state.name}`, description: `Deposit return deadline and itemized statement for ${state.name}.`, path }),
          faqLd(faqs),
          breadcrumbLd([{ name: "Tools", path: "/tools" }, { name: "Deposit Return", path: BASE }, { name: state.name, path }]),
        ]}
      />
      <Breadcrumbs crumbs={[{ name: "Tools", path: "/tools" }, { name: "Deposit Return", path: BASE }, { name: state.name, path }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Security Deposit Return — {state.name}</h1>
        <p className="mt-3 text-lg text-ink/70">{summary}</p>
      </header>

      <DepositReturnTool lockedStateCode={state.code} />

      <Section title={`${state.name} deposit return rules`}>
        <div className="max-w-2xl space-y-4 text-ink/75">
          <p>{summary}</p>
          {rule.penalty && <Callout tone="warning" title="Penalty for non-compliance">{rule.penalty}</Callout>}
          <StatuteCitation cite={rule.cite} />
        </div>
      </Section>

      <Section title={`${state.name} deposit return FAQ`}>
        <FaqList faqs={faqs} />
      </Section>

      <Section title="Other states">
        <div className="flex flex-wrap gap-2">
          {others.map((s) => (
            <Link key={s.code} href={`${BASE}/${s.slug}`} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-brand-700 hover:bg-brand-50">{s.name}</Link>
          ))}
        </div>
      </Section>
    </Container>
  );
}
