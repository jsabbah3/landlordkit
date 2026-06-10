"use client";

import { useMemo, useState } from "react";
import { usd, percent } from "@/lib/format";
import { track } from "@/lib/analytics";
import { computeCashFlow, type CashFlowInput } from "@/tools/cash-flow/calc";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";

const DEFAULTS: CashFlowInput = {
  purchasePrice: 250000,
  downPaymentPct: 20,
  interestRatePct: 7,
  loanTermYears: 30,
  closingCosts: 7500,
  rehabCosts: 5000,
  monthlyRent: 2200,
  otherMonthlyIncome: 0,
  vacancyPct: 5,
  propertyTaxAnnual: 3000,
  insuranceAnnual: 1400,
  hoaMonthly: 0,
  maintenancePct: 5,
  managementPct: 8,
  capexPct: 5,
  otherMonthlyExpense: 0,
};

type Key = keyof CashFlowInput;

const FIELDS: { key: Key; label: string; suffix?: string }[] = [
  { key: "purchasePrice", label: "Purchase price", suffix: "$" },
  { key: "downPaymentPct", label: "Down payment", suffix: "%" },
  { key: "interestRatePct", label: "Interest rate", suffix: "%" },
  { key: "loanTermYears", label: "Loan term", suffix: "yrs" },
  { key: "closingCosts", label: "Closing costs", suffix: "$" },
  { key: "rehabCosts", label: "Upfront rehab", suffix: "$" },
  { key: "monthlyRent", label: "Monthly rent", suffix: "$" },
  { key: "otherMonthlyIncome", label: "Other income / mo", suffix: "$" },
  { key: "vacancyPct", label: "Vacancy", suffix: "%" },
  { key: "propertyTaxAnnual", label: "Property tax / yr", suffix: "$" },
  { key: "insuranceAnnual", label: "Insurance / yr", suffix: "$" },
  { key: "hoaMonthly", label: "HOA / mo", suffix: "$" },
  { key: "maintenancePct", label: "Maintenance (% rent)", suffix: "%" },
  { key: "managementPct", label: "Management (% income)", suffix: "%" },
  { key: "capexPct", label: "CapEx (% rent)", suffix: "%" },
  { key: "otherMonthlyExpense", label: "Other expense / mo", suffix: "$" },
];

export function CashFlowTool() {
  const [values, setValues] = useState<Record<Key, string>>(
    () => Object.fromEntries(
      (Object.keys(DEFAULTS) as Key[]).map((k) => [k, String(DEFAULTS[k])]),
    ) as Record<Key, string>,
  );

  const input = useMemo(
    () => Object.fromEntries(
      (Object.keys(values) as Key[]).map((k) => [k, Number(values[k]) || 0]),
    ) as unknown as CashFlowInput,
    [values],
  );
  const r = useMemo(() => computeCashFlow(input), [input]);

  const cashFlowPositive = r.monthlyCashFlow >= 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <Card>
        <CardBody>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            {FIELDS.map((f) => (
              <Field key={f.key} label={`${f.label}${f.suffix ? ` (${f.suffix})` : ""}`} htmlFor={f.key}>
                <Input
                  id={f.key}
                  inputMode="decimal"
                  value={values[f.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              </Field>
            ))}
          </div>
          <Button className="mt-5 w-full" size="lg" onClick={() => track("tool_used", { tool: "cash-flow" })}>
            Recalculate
          </Button>
        </CardBody>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardBody>
            <p className="text-sm text-ink/60">Monthly cash flow</p>
            <p className={`font-display text-4xl font-semibold ${cashFlowPositive ? "text-brand-700" : "text-red-600"}`}>
              {usd(r.monthlyCashFlow)}
            </p>
            <p className="mt-1 text-sm text-ink/60">{usd(r.annualCashFlow)} per year</p>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Cash-on-cash return", percent(r.cashOnCashPct)],
                ["Cap rate", percent(r.capRatePct)],
                ["Monthly mortgage (P&I)", usd(r.monthlyMortgage)],
                ["Net operating income / yr", usd(r.noiAnnual)],
                ["Operating expenses / mo", usd(r.operatingExpenses)],
                ["Total cash invested", usd(r.totalCashInvested)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-paper-2 p-3">
                  <dt className="text-ink/55">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </CardBody>
        </Card>
        <LegalDisclaimer />
      </div>
    </div>
  );
}
