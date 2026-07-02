import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { getProStatus } from "@/lib/pro";
import { getServiceSupabase } from "@/lib/supabase/server";
import { allStateLegal, fieldEntries } from "@/lib/legal-db";
import { hubStates } from "@/lib/lawHub";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Growth dashboard",
  robots: { index: false, follow: false },
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "jsabbah3@gmail.com";

/**
 * Founder-only growth dashboard: the numbers OPERATIONS.md tells you to check,
 * aggregated in one place. 404s for anyone but the admin account (defense in
 * depth: it exposes counts, nothing sensitive, but there's no reason to share).
 * GA4/GSC live in their own dashboards — this covers what only the app knows.
 */
export default async function GrowthAdminPage() {
  const status = await getProStatus();
  if (!status.signedIn || status.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) notFound();

  // Legal-data coverage.
  const states = allStateLegal();
  let high = 0, medium = 0, low = 0, unv = 0;
  for (const r of states) {
    for (const f of fieldEntries(r)) {
      if (f.confidence === "high") high++;
      else if (f.confidence === "medium") medium++;
      else if (f.confidence === "low") low++;
      else unv++;
    }
  }

  // Funnel counts (service role; RLS-protected tables).
  const supabase = getServiceSupabase();
  let subscribers: number | null = null;
  let proSubs: number | null = null;
  let signups7d: number | null = null;
  if (supabase) {
    // eslint-disable-next-line react-hooks/purity -- server component, force-dynamic; fresh timestamp per request is the point
    const since = new Date(Date.now() - 7 * 86400_000).toISOString();
    const [subs, pros, recent] = await Promise.all([
      supabase.from("subscribers").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }).in("status", ["active", "trialing"]),
      supabase.from("subscribers").select("id", { count: "exact", head: true }).gte("created_at", since),
    ]);
    subscribers = subs.count ?? null;
    proSubs = pros.count ?? null;
    signups7d = recent.count ?? null;
  }

  const stat = (label: string, value: string | number, sub?: string) => (
    <Card key={label}>
      <CardBody>
        <p className="text-sm text-ink/60">{label}</p>
        <p className="mt-1 font-display text-3xl font-semibold text-ink">{value}</p>
        {sub && <p className="mt-1 text-xs text-ink/50">{sub}</p>}
      </CardBody>
    </Card>
  );

  return (
    <Container className="py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Growth dashboard</h1>
      <p className="mt-2 text-sm text-ink/60">
        Weekly ritual: OPERATIONS.md §3. GA4 → funnel events · GSC → search ·
        Stripe → revenue truth. Below: what only the app knows.
      </p>

      <h2 className="mt-8 mb-3 font-display text-lg font-semibold">Funnel (app-side)</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {stat("Email subscribers", subscribers ?? "—", signups7d != null ? `+${signups7d} last 7 days` : undefined)}
        {stat("Active Pro subscriptions", proSubs ?? "—", "Stripe dashboard is the revenue truth")}
        {stat("MRR vs goal", proSubs != null ? `~$${proSubs * 12} / $1,000` : "—", "assumes monthly plan")}
      </div>

      <h2 className="mt-8 mb-3 font-display text-lg font-semibold">Content engine</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {stat("State law hubs live", `${hubStates().length}/51`, "threshold: ≥4 verified fields")}
        {stat("Verified data points", high + medium, `${high} high · ${medium} medium`)}
        {stat("Verification backlog", low + unv, `${low} low-confidence · ${unv} unverified`)}
      </div>

      <div className="mt-8 rounded-card border border-line bg-paper-2 p-5 text-sm text-ink/70">
        <p className="font-medium text-ink">Run the scripts (locally):</p>
        <pre className="mt-2 overflow-x-auto text-xs leading-relaxed">{`node scripts/growth/check-site.mjs --fast   # site health (weekly)
node scripts/growth/staleness.mjs            # re-verification queue (weekly)
node scripts/growth/weekly-report.mjs        # after dropping the GSC CSV export`}</pre>
        <p className="mt-3">
          Assets &amp; status: <code>growth/assets-inventory.md</code> · Experiments:{" "}
          <code>growth/experiments.md</code> · <Link href="/laws" className="underline">/laws</Link> ·{" "}
          <Link href="/reports" className="underline">/reports</Link> ·{" "}
          <Link href="/press" className="underline">/press</Link>
        </p>
      </div>
    </Container>
  );
}
