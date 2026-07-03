import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RentIncreaseNoticeTool } from "@/components/tools/RentIncreaseNoticeTool";
import { FaqList } from "@/components/Faq";
import { Callout } from "@/components/ui/Callout";
import { StatuteCitation } from "@/components/StatuteCitation";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, faqLd, breadcrumbLd } from "@/lib/seo";
import { getStateBySlug, getStateByCode } from "@/lib/states";
import {
  getRentIncreaseRule,
  rentIncreaseStateCodes,
} from "@/tools/rent-increase-notice/data";
import { buildSummary, buildFaqs, buildExample } from "@/tools/rent-increase-notice/content";

const BASE = "/tools/rent-increase-notice-generator";

export function generateStaticParams() {
  return rentIncreaseStateCodes().map((code) => ({
    state: getStateByCode(code)!.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  const rule = state && getRentIncreaseRule(state.code);
  if (!state || !rule) return {};
  const low = rule.cite.confidence === "low";
  return {
    // Low-confidence states: don't assert the number in the title, and keep
    // the page out of the index until the value is statute-verified (the
    // WA/CO audit lesson). The tool stays usable with its confidence badge.
    title: low
      ? `Rent Increase Notice Generator — ${state.name}`
      : `Rent Increase Notice — ${state.name} (${rule.baseNoticeDays}-Day Rule)`,
    description: `How much notice must ${state.name} landlords give to raise rent? Generate a compliant ${state.name} rent increase letter (PDF) with the correct notice period. Free.`,
    alternates: { canonical: `${BASE}/${slug}` },
    ...(low ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  const rule = state && getRentIncreaseRule(state.code);
  if (!state || !rule) notFound();

  const summary = buildSummary(state, rule);
  const faqs = buildFaqs(state, rule);
  const example = buildExample(state, rule);
  const path = `${BASE}/${slug}`;

  const others = rentIncreaseStateCodes()
    .filter((c) => c !== state.code)
    .map((c) => getStateByCode(c)!);

  return (
    <Container className="py-8">
      <JsonLd
        data={[
          softwareAppLd({
            name: `Rent Increase Notice Generator — ${state.name}`,
            description: `Generate a ${state.name}-compliant rent increase notice.`,
            path,
          }),
          faqLd(faqs),
          breadcrumbLd([
            { name: "Tools", path: "/tools" },
            { name: "Rent Increase Notice", path: BASE },
            { name: state.name, path },
          ]),
        ]}
      />

      <Breadcrumbs
        crumbs={[
          { name: "Tools", path: "/tools" },
          { name: "Rent Increase Notice", path: BASE },
          { name: state.name, path },
        ]}
      />

      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Rent Increase Notice — {state.name}
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          {state.name} landlords must give at least{" "}
          <strong>{rule.baseNoticeDays} days&apos;</strong> written notice to
          raise rent on a month-to-month tenancy. Generate a compliant letter
          below.
        </p>
      </header>

      <RentIncreaseNoticeTool lockedStateCode={state.code} />

      <Section title={`${state.name} rent increase rules`}>
        <div className="max-w-2xl space-y-4 text-ink/75">
          <p>{summary}</p>
          {rule.rentControl !== "none" && (
            <Callout tone="warning" title="Rent control">
              {rule.controlNote ?? "A rent-control cap may apply."}
            </Callout>
          )}
          <Callout tone="neutral" title="Worked example">
            {example}
          </Callout>
          <StatuteCitation cite={rule.cite} />
        </div>
      </Section>

      <Section title={`${state.name} rent increase FAQ`}>
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
      </Section>
    </Container>
  );
}
