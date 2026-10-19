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
import { usd } from "@/lib/format";
import { getDepositRule } from "@/tools/security-deposit-interest/data";
import {
  CITY_DEPOSIT_INTEREST,
  getCityRule,
  citiesForState,
} from "@/tools/security-deposit-interest/cities";

const BASE = "/tools/security-deposit-interest-calculator";
const YEAR = new Date().getFullYear();

export function generateStaticParams() {
  return CITY_DEPOSIT_INTEREST.map((c) => ({
    state: getStateByCode(c.stateCode)!.slug,
    city: c.slug,
  }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getStateBySlug(stateSlug);
  const rule = state && getCityRule(state.code, citySlug);
  if (!state || !rule) return {};
  return {
    title: `${rule.city} Security Deposit Interest Calculator (${YEAR}) — ${rule.defaultRatePct}% rate`,
    description: `${rule.city} landlords owe interest on security deposits. ${YEAR} rate, who's covered, when to pay, and the penalty for missing it — plus a free calculator and tenant-ready PDF statement.`,
    alternates: { canonical: `${BASE}/${stateSlug}/${citySlug}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getStateBySlug(stateSlug);
  const rule = state && getCityRule(state.code, citySlug);
  if (!state || !rule) notFound();

  const path = `${BASE}/${stateSlug}/${citySlug}`;
  const stateRule = getDepositRule(state.code);
  const exInterest =
    Math.round(rule.example.deposit * ((rule.defaultRatePct ?? 0) / 100) * rule.example.years * 100) / 100;
  const siblings = citiesForState(state.code).filter((c) => c.slug !== rule.slug);
  const {
    city, slug, stateCode, scope, penalty, priorRateNote, example, faqs, ...toolRule
  } = rule;
  void slug; void stateCode; void example;

  return (
    <Container className="py-8">
      <JsonLd
        data={[
          softwareAppLd({
            name: `${city} Security Deposit Interest Calculator`,
            description: `Calculate security deposit interest owed under ${city}'s local ordinance.`,
            path,
          }),
          faqLd(faqs),
          breadcrumbLd([
            { name: "Tools", path: "/tools" },
            { name: "Security Deposit Interest", path: BASE },
            { name: state.name, path: `${BASE}/${stateSlug}` },
            { name: city, path },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Tools", path: "/tools" },
          { name: "Security Deposit Interest", path: BASE },
          { name: state.name, path: `${BASE}/${stateSlug}` },
          { name: city, path },
        ]}
      />

      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          {city} Security Deposit Interest Calculator ({YEAR})
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          {stateRule.required === "no"
            ? `${state.name} has no statewide deposit-interest law — but ${city} does. `
            : `${city} has its own rule on top of ${state.name}'s. `}
          Current rate: <strong>{rule.rateLabel}</strong>.
        </p>
      </header>

      <Callout tone="info" title={`Who ${city}'s rule covers`} className="mb-6 max-w-2xl">
        {scope}
      </Callout>

      <DepositInterestTool
        lockedStateCode={state.code}
        ruleOverride={toolRule}
        jurisdictionLabel={`${city}, ${state.name}`}
      />

      <Section title={`How ${city} deposit interest works`}>
        <div className="max-w-2xl space-y-4 text-ink/75">
          <p>{rule.summary}</p>
          <p>
            <span className="font-medium text-ink">When it must be paid: </span>
            {rule.payTiming}
          </p>
          {penalty && (
            <Callout tone="warning" title="Penalty for getting it wrong">
              {penalty}
            </Callout>
          )}
          <Callout tone="neutral" title="Worked example">
            A {usd(example.deposit)} deposit held {example.years} year at {rule.defaultRatePct}% earns{" "}
            {usd(exInterest)} in interest.{" "}
            {priorRateNote ?? ""} Rates reset every year, so confirm the current
            figure with the city source below before paying.
          </Callout>
          <StatuteCitation cite={rule.cite} />
        </div>
      </Section>

      <Section title={`${city} security deposit interest FAQ`}>
        <FaqList faqs={faqs} />
      </Section>

      <Section title="Related">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`${BASE}/${stateSlug}`}
            className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-brand-700 hover:bg-brand-50"
          >
            {state.name} (statewide rule)
          </Link>
          {siblings.map((c) => (
            <Link
              key={c.slug}
              href={`${BASE}/${stateSlug}/${c.slug}`}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-brand-700 hover:bg-brand-50"
            >
              {c.city}
            </Link>
          ))}
        </div>
      </Section>
    </Container>
  );
}
