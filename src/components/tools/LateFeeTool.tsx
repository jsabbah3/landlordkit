"use client";

import { useEffect, useMemo, useState } from "react";
import { US_STATES, getStateByCode } from "@/lib/states";
import { usd } from "@/lib/format";
import { track } from "@/lib/analytics";
import { getLateFeeRule, LATE_FEE } from "@/tools/late-fee/data";
import { computeMaxLateFee } from "@/tools/late-fee/calc";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";

export function LateFeeTool({ lockedStateCode }: { lockedStateCode?: string }) {
  const [stateCode, setStateCode] = useState(lockedStateCode ?? "CA");
  const [rent, setRent] = useState("1500");
  const [daysLate, setDaysLate] = useState("10");
  const [proposed, setProposed] = useState("");
  const [calculated, setCalculated] = useState(false);

  const rule = useMemo(
    () => getLateFeeRule(stateCode) ?? LATE_FEE.CA,
    [stateCode],
  );
  const state = getStateByCode(stateCode);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from URL */
    if (q.get("rent")) setRent(q.get("rent")!);
    if (q.get("days")) setDaysLate(q.get("days")!);
    if (!lockedStateCode && q.get("state")) {
      const s = q.get("state")!.toUpperCase();
      if (getStateByCode(s)) setStateCode(s);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [lockedStateCode]);

  const result = useMemo(
    () =>
      computeMaxLateFee({
        rule,
        monthlyRent: Number(rent),
        daysLate: Number(daysLate),
      }),
    [rule, rent, daysLate],
  );

  const proposedExceeds =
    result.maxFee != null && proposed !== "" && Number(proposed) > result.maxFee;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      <Card>
        <CardBody className="space-y-4">
          {!lockedStateCode && (
            <Field label="State" htmlFor="state">
              <Select id="state" value={stateCode} onChange={(e) => { setStateCode(e.target.value); setCalculated(false); }}>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </Select>
            </Field>
          )}
          <Field label="Monthly rent" htmlFor="rent">
            <Input id="rent" inputMode="decimal" value={rent} onChange={(e) => setRent(e.target.value)} />
          </Field>
          <Field label="Days rent is late" htmlFor="days">
            <Input id="days" inputMode="numeric" value={daysLate} onChange={(e) => setDaysLate(e.target.value)} />
          </Field>
          <Field
            label="Late fee you plan to charge (optional)"
            htmlFor="proposed"
            hint="We'll check it against your state's legal cap."
          >
            <Input id="proposed" inputMode="decimal" value={proposed} onChange={(e) => setProposed(e.target.value)} placeholder="e.g. 75" />
          </Field>
          <Button className="w-full" size="lg" onClick={() => { setCalculated(true); track("tool_used", { tool: "late-fee", state: stateCode }); }}>
            Check the cap
          </Button>
        </CardBody>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardBody>
            <p className="text-sm text-ink/60">Maximum lawful late fee</p>
            <p className="font-display text-4xl font-semibold text-brand-700">
              {result.maxFee != null ? usd(result.maxFee) : "No fixed cap"}
            </p>
            <p className="mt-2 text-sm text-ink/65">{result.explanation}</p>
            {!result.chargeable && (
              <Callout tone="warning" className="mt-3">
                The rent is within the {result.graceDays}-day grace period — a
                late fee can&apos;t be charged yet.
              </Callout>
            )}
            {proposedExceeds && (
              <Callout tone="warning" title="Over the legal cap" className="mt-3">
                {usd(Number(proposed))} exceeds {state?.name}&apos;s maximum of{" "}
                {usd(result.maxFee!)}. A fee above the cap is generally
                unenforceable.
              </Callout>
            )}
            {calculated && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    const q = new URLSearchParams({ state: stateCode, rent, days: daysLate });
                    await navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}?${q}`);
                    track("result_shared", { tool: "late-fee" });
                  }}
                >
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
