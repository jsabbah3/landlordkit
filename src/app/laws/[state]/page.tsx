import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge, Callout } from "@/components/ui/Callout";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { StateCheatSheetCapture } from "@/components/StateCheatSheetCapture";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd, breadcrumbLd } from "@/lib/seo";
import { longDate } from "@/lib/format";
import { getStateBySlug } from "@/lib/states";
import { hubStates, buildHub } from "@/lib/lawHub";
import { getTool } from "@/lib/tools";

const BASE = "/laws";
const YEAR = new Date().getFullYear();

export function generateStaticParams() {
  return hubStates().map((s) => ({ state: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state || !hubStates().some((s) => s.code === state.code)) return {};
  return {
    title: `${state.name} Landlord-Tenant Law (${YEAR}): Deposits, Late Fees, Notice`,
    description: `The verified ${state.name} rules for landlords — security deposit limits and deadlines, late fee caps, rent increase notice — every value cited to its statute with a last-verified date.`,
    alternates: { canonical: `${BASE}/${slug}` },
  };
}

const confidenceBadge = {
  high: { cls: "bg-brand-100 text-brand-800", label: "Verified" },
  medium: { cls: "bg-accent-400/20 text-ink", label: "Spot-check advised" },
} as const;

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  const hub = state && hubStates().some((s) => s.code === state.code) ? buildHub(state.code) : null;
  if (!state || !hub) notFound();

  const path = `${BASE}/${slug}`;
  const faqs = hub.sections.flatMap((s) =>
    s.rows.map((r) => ({
      q: r.question,
      a: `${r.value}${r.field.statute ? ` (${r.field.statute})` : ""}. ${r.field.lastVerified ? `Last verified ${longDate(r.field.lastVerified.slice(0, 10))}.` : ""} General information, not legal advice.`,
    })),
  );
  const others = hubStates().filter((s) => s.code !== state.code);

  return (
    <Container className="py-8">
      <JsonLd data={[faqLd(faqs), breadcrumbLd([{ name: "State Laws", path: BASE }, { name: state.name, path }])]} />
      <Breadcrumbs crumbs={[{ name: "State Laws", path: BASE }, { name: state.name, path }]} />

      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          {state.name} Landlord-Tenant Law: The Verified Rules ({YEAR})
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          Every value below cites its statute and shows the date we last checked
          it. Where we haven&apos;t verified a rule yet, we say so — we never
          guess at the law.
        </p>
      </header>

      <div className="max-w-3xl space-y-8">
        {hub.sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-4 font-display text-2xl font-semibold text-ink">{section.title}</h2>
            <div className="space-y-3">
              {section.rows.map((row) => {
                const conf = confidenceBadge[row.field.confidence as "high" | "medium"];
                const tool = row.toolSlug ? getTool(row.toolSlug) : undefined;
                return (
                  <Card key={row.label}>
                    <CardBody className="py-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-medium text-ink">{row.label}</p>
                        <Badge className={conf.cls}>{conf.label}</Badge>
                      </div>
                      <p className="mt-1 text-lg font-semibold text-brand-700">{row.value}</p>
                      <p className="mt-2 text-xs leading-relaxed text-ink/60">
                        {row.field.statute && (
                          <>
                            Source:{" "}
                            {row.field.statuteUrl ? (
                              <a href={row.field.statuteUrl} className="underline" rel="nofollow noopener" target="_blank">
                                {row.field.statute}
                              </a>
                            ) : (
                              row.field.statute
                            )}
                          </>
                        )}
                        {row.field.lastVerified && <> · Last verified {longDate(row.field.lastVerified.slice(0, 10))}</>}
                        {tool && (
                          <>
                            {" · "}
                            <Link href={`/tools/${tool.slug}/${state.slug}`} className="font-medium text-brand-700 underline">
                              {tool.short} tool for {state.name} →
                            </Link>
                          </>
                        )}
                      </p>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}

        {hub.unverified.length > 0 && (
          <Callout tone="info">
            <strong>Not yet verified for {state.name}:</strong>{" "}
            {hub.unverified.join(", ")}. We publish a value only after checking
            it against the statute — these are in our verification queue rather
            than guessed at.
          </Callout>
        )}

        <div className="rounded-card border border-line bg-paper-2 p-6">
          <h2 className="font-display text-lg font-semibold">
            The {state.name} Landlord Law Cheat Sheet
          </h2>
          <p className="mt-1 mb-4 text-sm text-ink/65">
            Everything on this page as a one-page PDF — plus an email when a{" "}
            {state.name} rule changes.
          </p>
          <StateCheatSheetCapture code={state.code} stateName={state.name} />
        </div>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold">Other states</h2>
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {others.map((s) => (
              <Link key={s.code} href={`${BASE}/${s.slug}`} className="text-brand-700 hover:underline">
                {s.name}
              </Link>
            ))}
          </p>
        </section>

        <LegalDisclaimer />
      </div>
    </Container>
  );
}
