"use client";

import { useEffect, useMemo, useState } from "react";
import { US_STATES, getStateByCode } from "@/lib/states";
import { usd, percent, todayISO, parseISODate } from "@/lib/format";
import { track } from "@/lib/analytics";
import {
  getDepositRule,
  type DepositInterestRule,
} from "@/tools/security-deposit-interest/data";
import {
  computeDepositInterest,
  resolveExemptAmount,
} from "@/tools/security-deposit-interest/calc";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { StatuteCitation } from "@/components/StatuteCitation";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { UpgradeNudge } from "@/components/UpgradeNudge";

const rateBasisNote: Record<DepositInterestRule["rateBasis"], string> = {
  fixed: "This rate is set by statute. You can lower it if your bank paid less.",
  "published-annually":
    "This rate is published each year — confirm the current year's figure with the cited source before relying on it.",
  "bank-passbook":
    "The rate equals what your bank actually paid. Enter your account's rate for an accurate figure.",
  none: "",
};

function monthsBetween(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO);
  const to = parseISODate(toISO);
  if (!from || !to || to < from) return 0;
  const days = (to.getTime() - from.getTime()) / 86_400_000;
  return days / 30.4375; // average month length
}

export function DepositInterestTool({
  lockedStateCode,
}: {
  lockedStateCode?: string;
}) {
  const defaultRateFor = (code: string) => {
    const r = getDepositRule(code);
    return r.defaultRatePct != null ? String(r.defaultRatePct) : "0";
  };

  const [stateCode, setStateCode] = useState(lockedStateCode ?? "MA");
  const [deposit, setDeposit] = useState("2000");
  const [moveIn, setMoveIn] = useState("2024-06-01");
  const [moveOut, setMoveOut] = useState(todayISO());
  const [monthlyRent, setMonthlyRent] = useState("");
  const [rate, setRate] = useState(() => defaultRateFor(lockedStateCode ?? "MA"));
  const [calculated, setCalculated] = useState(false);

  const rule = useMemo(() => getDepositRule(stateCode), [stateCode]);
  const state = getStateByCode(stateCode);

  // Hydrate inputs once from a shared URL (?deposit=&movein=&rate=&state=...).
  // We read window.location so the page itself stays fully static (no
  // searchParams). This is a one-time read from an external system on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from URL */
    if (q.get("deposit")) setDeposit(q.get("deposit")!);
    if (q.get("movein")) setMoveIn(q.get("movein")!);
    if (q.get("moveout")) setMoveOut(q.get("moveout")!);
    if (q.get("rent")) setMonthlyRent(q.get("rent")!);
    if (!lockedStateCode && q.get("state")) {
      const s = q.get("state")!.toUpperCase();
      if (getStateByCode(s)) {
        setStateCode(s);
        if (!q.get("rate")) setRate(defaultRateFor(s));
      }
    }
    if (q.get("rate")) setRate(q.get("rate")!);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [lockedStateCode]);

  const months = monthsBetween(moveIn, moveOut);
  const exemptAmount = resolveExemptAmount(rule, Number(monthlyRent));
  const result = useMemo(
    () =>
      computeDepositInterest({
        deposit: Number(deposit),
        monthsHeld: months,
        annualRatePct: Number(rate),
        minHoldingMonths: rule.minHoldingMonths,
        exemptAmount,
      }),
    [deposit, months, rate, rule.minHoldingMonths, exemptAmount],
  );

  const notRequired = rule.required === "no";

  function handleCalculate() {
    setCalculated(true);
    track("tool_used", {
      tool: "security-deposit-interest",
      state: stateCode,
      required: rule.required,
    });
  }

  function shareUrl(): string {
    const q = new URLSearchParams({
      state: stateCode,
      deposit,
      movein: moveIn,
      moveout: moveOut,
      rate,
    });
    if (monthlyRent) q.set("rent", monthlyRent);
    return `${window.location.origin}${window.location.pathname}?${q.toString()}`;
  }

  async function handleDownloadPdf() {
    const { buildDocumentPdf, downloadPdf } = await import("@/lib/pdf/pdfDoc");
    const bytes = await buildDocumentPdf({
      blocks: [
        { type: "title", text: "Security Deposit Interest Statement" },
        { type: "right", text: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
        { type: "rule" },
        { type: "paragraph", text: `State: ${state?.name ?? stateCode}` },
        { type: "paragraph", text: `Security deposit held: ${usd(Number(deposit))}` },
        { type: "paragraph", text: `Period held: ${moveIn} to ${moveOut} (${result.years.toFixed(2)} years)` },
        { type: "paragraph", text: `Annual interest rate applied: ${percent(Number(rate))}` },
        ...(exemptAmount > 0 ? [{ type: "paragraph" as const, text: `Amount exempt from interest: ${usd(exemptAmount)} (interest computed on ${usd(result.interestBase)})` }] : []),
        { type: "rule" },
        { type: "heading", text: result.eligible ? `Interest owed to tenant: ${usd(result.interest)}` : "No interest owed" },
        ...(result.reason ? [{ type: "paragraph" as const, text: result.reason }] : []),
        { type: "paragraph", text: `Total to return (deposit + interest): ${usd(result.totalDue)}` },
        { type: "spacer" },
        { type: "heading", text: "Applicable rule" },
        { type: "paragraph", text: rule.summary },
        { type: "paragraph", text: `Citation: ${rule.cite.statute}` },
        { type: "spacer" },
        { type: "paragraph", text: "This statement is informational only and is not legal advice." },
        { type: "signature", label: "Landlord signature / date" },
      ],
      pro: false,
    });
    downloadPdf(bytes, `deposit-interest-${state?.slug ?? "statement"}.pdf`);
    track("pdf_downloaded", { tool: "security-deposit-interest", state: stateCode });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      {/* Inputs */}
      <Card>
        <CardBody className="space-y-4">
          {!lockedStateCode && (
            <Field label="State" htmlFor="state">
              <Select
                id="state"
                value={stateCode}
                onChange={(e) => {
                  setStateCode(e.target.value);
                  setRate(defaultRateFor(e.target.value));
                  setCalculated(false);
                }}
              >
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <Field label="Security deposit amount" htmlFor="deposit">
            <Input
              id="deposit"
              inputMode="decimal"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              placeholder="2000"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Move-in / deposit date" htmlFor="movein">
              <Input id="movein" type="date" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} />
            </Field>
            <Field label="Return / move-out date" htmlFor="moveout">
              <Input id="moveout" type="date" value={moveOut} onChange={(e) => setMoveOut(e.target.value)} />
            </Field>
          </div>

          {rule.exempt && (
            <Field
              label="Monthly rent"
              htmlFor="rent"
              hint="Used to compute the amount exempt from interest in this state."
            >
              <Input id="rent" inputMode="decimal" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} placeholder="1000" />
            </Field>
          )}

          <Field
            label="Annual interest rate (%)"
            htmlFor="rate"
            hint={rateBasisNote[rule.rateBasis] || undefined}
          >
            <Input id="rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
          </Field>

          <Button onClick={handleCalculate} className="w-full" size="lg">
            Calculate interest
          </Button>
        </CardBody>
      </Card>

      {/* Result */}
      <div className="space-y-4">
        {notRequired ? (
          <Callout tone="warning" title="No statewide interest requirement">
            {state?.name} does not require landlords to pay interest on security
            deposits. Some cities have their own rules, and your lease can still
            promise interest. You can still calculate a figure below.
          </Callout>
        ) : null}

        <Card>
          <CardBody>
            <p className="text-sm text-ink/60">Interest owed to tenant</p>
            <p className="font-display text-4xl font-semibold text-brand-700">
              {result.eligible ? usd(result.interest) : usd(0)}
            </p>
            {!result.eligible && result.reason ? (
              <p className="mt-1 text-sm text-ink/60">{result.reason}</p>
            ) : null}
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-paper-2 p-3">
                <dt className="text-ink/55">Time held</dt>
                <dd className="font-medium">{result.years.toFixed(2)} yrs</dd>
              </div>
              <div className="rounded-lg bg-paper-2 p-3">
                <dt className="text-ink/55">Total to return</dt>
                <dd className="font-medium">{usd(result.totalDue)}</dd>
              </div>
            </dl>

            {calculated && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={handleDownloadPdf}>
                  Download PDF statement
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await navigator.clipboard?.writeText(shareUrl());
                    track("result_shared", { tool: "security-deposit-interest" });
                  }}
                >
                  Copy shareable link
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {calculated && (
          <UpgradeNudge
            feature="deposit-interest-batch"
            reason="Generate interest statements for every unit at once and save your property details — no re-typing."
          />
        )}

        <Card>
          <CardBody className="space-y-3">
            <p className="font-display text-lg font-semibold">
              {state?.name} rule
            </p>
            <p className="text-sm text-ink/75">{rule.summary}</p>
            {rule.appliesTo && (
              <p className="text-sm text-ink/60">
                <span className="font-medium">Applies to:</span> {rule.appliesTo}
              </p>
            )}
            <p className="text-sm text-ink/60">
              <span className="font-medium">When paid:</span> {rule.payTiming}
            </p>
            <StatuteCitation cite={rule.cite} />
          </CardBody>
        </Card>

        <LegalDisclaimer />
      </div>
    </div>
  );
}
