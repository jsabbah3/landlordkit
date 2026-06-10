import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LateFeeTool } from "@/components/tools/LateFeeTool";
import { FaqList } from "@/components/Faq";
import { Callout } from "@/components/ui/Callout";
import { StatuteCitation } from "@/components/StatuteCitation";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";
import { getStateBySlug, getStateByCode } from "@/lib/states";
import { getLateFeeRule, lateFeeStateCodes } from "@/tools/late-fee/data";
import { buildSummary, buildFaqs } from "@/tools/late-fee/content";

const BASE = "/tools/late-fee-calculator";

export function generateStaticParams() {
  return lateFeeStateCodes().map((code) => ({ state: getStateByCode(code)!.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  const rule = state && getLateFeeRule(state.code);
  if (!state || !rule) return {};
  return {
    title: `Rent Late Fee Calculator — ${state.name} (Cap & Grace Period)`,
    description: `What is the maximum late fee a landlord can charge in ${state.name}? See the cap and grace period, and calculate a compliant fee. Free.`,
    alternates: { canonical: `${BASE}/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  const rule = state && getLateFeeRule(state.code);
  if (!state || !rule) notFound();

  const summary = buildSummary(state, rule);
  const faqs = buildFaqs(state, rule);
  const path = `${BASE}/${slug}`;
  const others = lateFeeStateCodes().filter((c) => c !== state.code).map((c) => getStateByCode(c)!);

  return (
    <Container className="py-8">
      <JsonLd
        data={[
          softwareAppLd({ name: `Rent Late Fee Calculator — ${state.name}`, description: `Late fee cap and calculator for ${state.name}.`, path }),
          faqLd(faqs),
          breadcrumbLd([{ name: "Tools", path: "/tools" }, { name: "Late Fee", path: BASE }, { name: state.name, path }]),
        ]}
      />
      <Breadcrumbs crumbs={[{ name: "Tools", path: "/tools" }, { name: "Late Fee", path: BASE }, { name: state.name, path }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Rent Late Fee Calculator — {state.name}</h1>
        <p className="mt-3 text-lg text-ink/70">{summary}</p>
      </header>

      <LateFeeTool lockedStateCode={state.code} />

      <Section title={`${state.name} late fee rules`}>
        <div className="max-w-2xl space-y-4 text-ink/75">
          <p>{summary}</p>
          {rule.notes && <Callout tone="info">{rule.notes}</Callout>}
          <StatuteCitation cite={rule.cite} />
        </div>
      </Section>

      <Section title={`${state.name} late fee FAQ`}>
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
