"use client";

import { useMemo, useState } from "react";
import { useProStatus } from "@/lib/useProStatus";
import { US_STATES, getStateByCode } from "@/lib/states";
import { usd, longDate, todayISO } from "@/lib/format";
import { track } from "@/lib/analytics";
import { getDepositReturnRule, DEPOSIT_RETURN } from "@/tools/security-deposit-return/data";
import { computeDepositReturn, type Deduction } from "@/tools/security-deposit-return/calc";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { UpgradeNudge } from "@/components/UpgradeNudge";

export function DepositReturnTool({ lockedStateCode }: { lockedStateCode?: string }) {
  const { isPro } = useProStatus();
  const [stateCode, setStateCode] = useState(lockedStateCode ?? "CA");
  const [deposit, setDeposit] = useState("2000");
  const [moveOut, setMoveOut] = useState(todayISO());
  const [tenant, setTenant] = useState("");
  const [property, setProperty] = useState("");
  const [landlord, setLandlord] = useState("");
  const [deductions, setDeductions] = useState<Deduction[]>([
    { description: "", amount: 0 },
  ]);
  const [generated, setGenerated] = useState(false);

  const rule = useMemo(
    () => getDepositReturnRule(stateCode) ?? DEPOSIT_RETURN.CA,
    [stateCode],
  );
  const state = getStateByCode(stateCode);

  const result = useMemo(
    () =>
      computeDepositReturn({
        deposit: Number(deposit),
        deductions,
        moveOutISO: moveOut,
        rule,
      }),
    [deposit, deductions, moveOut, rule],
  );

  function updateDeduction(i: number, patch: Partial<Deduction>) {
    setDeductions((ds) => ds.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  }
  function addDeduction() {
    setDeductions((ds) => [...ds, { description: "", amount: 0 }]);
  }
  function removeDeduction(i: number) {
    setDeductions((ds) => ds.filter((_, j) => j !== i));
  }

  async function handleDownloadPdf() {
    const { buildDocumentPdf, downloadPdf } = await import("@/lib/pdf/pdfDoc");
    const usedDeductions = deductions.filter((d) => d.description || d.amount);
    const bytes = await buildDocumentPdf({
      blocks: [
        { type: "right", text: longDate(todayISO()) },
        { type: "title", text: "Security Deposit Itemized Statement" },
        { type: "rule" },
        { type: "paragraph", text: `Tenant: ${tenant || "[tenant name]"}` },
        { type: "paragraph", text: `Property: ${property || "[property address]"}` },
        { type: "paragraph", text: `Move-out date: ${longDate(moveOut)}` },
        { type: "spacer", size: 6 },
        { type: "paragraph", text: `Security deposit received: ${usd(Number(deposit))}` },
        { type: "heading", text: "Deductions" },
        ...(usedDeductions.length
          ? usedDeductions.map((d) => ({
              type: "paragraph" as const,
              text: `• ${d.description || "Deduction"}: ${usd(Number(d.amount) || 0)}`,
            }))
          : [{ type: "paragraph" as const, text: "• None" }]),
        { type: "paragraph", text: `Total deductions: ${usd(result.totalDeductions)}` },
        { type: "rule" },
        { type: "heading", text: `Amount returned to tenant: ${usd(result.amountToReturn)}` },
        ...(result.deadlineDate
          ? [{ type: "paragraph" as const, text: `Statutory return deadline: ${longDate(result.deadlineDate)} (${result.deadlineDays} days after move-out).` }]
          : []),
        { type: "spacer" },
        { type: "paragraph", text: "Informational statement — not legal advice." },
        { type: "signature", label: `${landlord || "[landlord name]"} — Landlord` },
      ],
      pro: isPro,
    });
    downloadPdf(bytes, `deposit-itemized-statement-${state?.slug ?? "statement"}.pdf`);
    setGenerated(true);
    track("pdf_downloaded", { tool: "security-deposit-return", state: stateCode });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      <Card>
        <CardBody className="space-y-4">
          {!lockedStateCode && (
            <Field label="State" htmlFor="state">
              <Select id="state" value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
                {US_STATES.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
              </Select>
            </Field>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Security deposit" htmlFor="deposit">
              <Input id="deposit" inputMode="decimal" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
            </Field>
            <Field label="Move-out date" htmlFor="moveout">
              <Input id="moveout" type="date" value={moveOut} onChange={(e) => setMoveOut(e.target.value)} />
            </Field>
          </div>

          <div>
            <Label>Deductions</Label>
            <div className="space-y-2">
              {deductions.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Description (e.g. carpet cleaning)"
                    value={d.description}
                    onChange={(e) => updateDeduction(i, { description: e.target.value })}
                  />
                  <Input
                    className="w-28"
                    inputMode="decimal"
                    placeholder="$"
                    value={d.amount || ""}
                    onChange={(e) => updateDeduction(i, { amount: Number(e.target.value) })}
                  />
                  <button
                    type="button"
                    onClick={() => removeDeduction(i)}
                    aria-label="Remove deduction"
                    className="shrink-0 rounded-lg border border-line px-3 text-ink/50 hover:bg-paper-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addDeduction} className="mt-2 text-sm font-medium text-brand-700">
              + Add deduction
            </button>
          </div>

          <div className="border-t border-line pt-4 space-y-3">
            <p className="text-sm font-medium text-ink/70">Statement details (optional)</p>
            <Field label="Tenant name" htmlFor="tenant"><Input id="tenant" value={tenant} onChange={(e) => setTenant(e.target.value)} /></Field>
            <Field label="Property address" htmlFor="property"><Input id="property" value={property} onChange={(e) => setProperty(e.target.value)} /></Field>
            <Field label="Landlord name" htmlFor="landlord"><Input id="landlord" value={landlord} onChange={(e) => setLandlord(e.target.value)} /></Field>
          </div>

          <Button className="w-full" size="lg" onClick={handleDownloadPdf}>
            Download itemized statement
          </Button>
        </CardBody>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardBody>
            <p className="text-sm text-ink/60">Amount to return to tenant</p>
            <p className="font-display text-4xl font-semibold text-brand-700">{usd(result.amountToReturn)}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-paper-2 p-3">
                <dt className="text-ink/55">Total deductions</dt>
                <dd className="font-medium">{usd(result.totalDeductions)}</dd>
              </div>
              <div className="rounded-lg bg-paper-2 p-3">
                <dt className="text-ink/55">Return by</dt>
                <dd className="font-medium">{result.deadlineDate ? longDate(result.deadlineDate) : "—"}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-ink/60">
              {state?.name} requires return within {result.deadlineDays} days of move-out.
            </p>
          </CardBody>
        </Card>

        {generated && (
          <UpgradeNudge
            feature="deposit-return-branding"
            reason="Add your logo, save your landlord details, and itemize deposits across every unit from one dashboard."
          />
        )}

        {rule.penalty && (
          <Callout tone="warning" title="Penalty for non-compliance">{rule.penalty}</Callout>
        )}
        <LegalDisclaimer />
      </div>
    </div>
  );
}
