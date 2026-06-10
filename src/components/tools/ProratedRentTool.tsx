"use client";

import { useMemo, useState } from "react";
import { usd } from "@/lib/format";
import { track } from "@/lib/analytics";
import {
  computeProratedRent,
  daysInMonth,
  daysFromMoveIn,
  type ProrateMethod,
} from "@/tools/prorated-rent/calc";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";

const METHODS: { value: ProrateMethod; label: string }[] = [
  { value: "actual-days", label: "Actual days in month (most common)" },
  { value: "thirty-day", label: "30-day month" },
  { value: "banker-year", label: "Banker's year (÷365)" },
];

export function ProratedRentTool() {
  const [rent, setRent] = useState("1500");
  const [moveIn, setMoveIn] = useState("2026-06-10");
  const [method, setMethod] = useState<ProrateMethod>("actual-days");
  const [calculated, setCalculated] = useState(false);

  const { dim, days } = useMemo(() => {
    const [y, m, d] = moveIn.split("-").map(Number);
    return {
      dim: daysInMonth(y || 2026, m || 1),
      days: daysFromMoveIn(y || 2026, m || 1, d || 1),
    };
  }, [moveIn]);

  const result = useMemo(
    () => computeProratedRent({ monthlyRent: Number(rent), daysOccupied: days, daysInMonth: dim, method }),
    [rent, days, dim, method],
  );

  const comparison = METHODS.map((m) => ({
    ...m,
    value2: computeProratedRent({ monthlyRent: Number(rent), daysOccupied: days, daysInMonth: dim, method: m.value }).proratedRent,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      <Card>
        <CardBody className="space-y-4">
          <Field label="Monthly rent" htmlFor="rent">
            <Input id="rent" inputMode="decimal" value={rent} onChange={(e) => setRent(e.target.value)} />
          </Field>
          <Field label="Move-in date" htmlFor="movein" hint="We prorate from this day through the end of the month.">
            <Input id="movein" type="date" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} />
          </Field>
          <Field label="Proration method" htmlFor="method">
            <Select id="method" value={method} onChange={(e) => setMethod(e.target.value as ProrateMethod)}>
              {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Select>
          </Field>
          <Button className="w-full" size="lg" onClick={() => { setCalculated(true); track("tool_used", { tool: "prorated-rent", method }); }}>
            Calculate prorated rent
          </Button>
        </CardBody>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardBody>
            <p className="text-sm text-ink/60">Prorated rent ({days} of {dim} days)</p>
            <p className="font-display text-4xl font-semibold text-brand-700">{usd(result.proratedRent)}</p>
            <p className="mt-2 text-sm text-ink/65">Daily rate: {usd(result.dailyRate)} · {result.methodLabel}</p>

            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-ink/70">All methods compared</p>
              <div className="overflow-hidden rounded-lg border border-line">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-line">
                    {comparison.map((c) => (
                      <tr key={c.value} className={c.value === method ? "bg-brand-50" : ""}>
                        <td className="px-3 py-2 text-ink/70">{c.label}</td>
                        <td className="px-3 py-2 text-right font-medium">{usd(c.value2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {calculated && (
              <div className="mt-4">
                <Button variant="ghost" size="sm" onClick={async () => {
                  const q = new URLSearchParams({ rent, movein: moveIn, method });
                  await navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}?${q}`);
                  track("result_shared", { tool: "prorated-rent" });
                }}>
                  Copy shareable link
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
        <LegalDisclaimer />
      </div>
    </div>
  );
}
