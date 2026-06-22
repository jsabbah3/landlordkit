"use client";

import { useEffect, useState } from "react";
import { usd, longDate, todayISO } from "@/lib/format";
import { track } from "@/lib/analytics";
import { loadProfile } from "@/lib/profile";
import { useProStatus } from "@/lib/useProStatus";
import type { Block } from "@/lib/pdf/pdfDoc";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { GoProButton } from "@/components/pro/GoProButton";
import { SITE } from "@/lib/site";

const METHODS = ["Cash", "Check", "Bank transfer", "Money order", "Online / app", "Credit card"];

interface UnitRow {
  tenant: string;
  property: string;
  amount: string;
}

const emptyRow = (): UnitRow => ({ tenant: "", property: "", amount: "" });

/** Block set for a single receipt — mirrors the single Rent Receipt tool. */
function receiptBlocks(args: {
  landlord: string;
  tenant: string;
  property: string;
  amount: string;
  paidOn: string;
  period: string;
  method: string;
}): Block[] {
  const { landlord, tenant, property, amount, paidOn, period, method } = args;
  return [
    { type: "title", text: "Rent Receipt" },
    { type: "right", text: `Date: ${longDate(paidOn)}` },
    { type: "rule" },
    { type: "heading", text: `Amount received: ${usd(Number(amount) || 0)}` },
    { type: "paragraph", text: `Received from: ${tenant || "[tenant name]"}` },
    { type: "paragraph", text: `Property: ${property || "[property address]"}` },
    { type: "paragraph", text: `Payment date: ${longDate(paidOn)}` },
    { type: "paragraph", text: `Rental period covered: ${period || "[period]"}` },
    { type: "paragraph", text: `Payment method: ${method}` },
    { type: "spacer", size: 10 },
    {
      type: "paragraph",
      text: "This receipt confirms the rent payment described above was received in full for the period stated.",
    },
    { type: "signature", label: `${landlord || "[landlord name]"} — Received by` },
  ];
}

export function BatchRentReceiptTool() {
  const { isPro, loading } = useProStatus();

  // Shared across every receipt in the batch.
  const [landlord, setLandlord] = useState("");
  const [paidOn, setPaidOn] = useState(todayISO());
  const [period, setPeriod] = useState("");
  const [method, setMethod] = useState(METHODS[0]);

  // One row per unit/tenant.
  const [rows, setRows] = useState<UnitRow[]>([emptyRow(), emptyRow()]);

  // Prefill the shared landlord + the first row from the saved profile.
  useEffect(() => {
    const p = loadProfile();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time profile prefill */
    if (p.landlordName) setLandlord(p.landlordName);
    if (p.tenantName || p.propertyAddress || p.monthlyRent) {
      setRows((prev) => {
        const next = [...prev];
        next[0] = {
          tenant: p.tenantName ?? "",
          property: p.propertyAddress ?? "",
          amount: p.monthlyRent ?? "",
        };
        return next;
      });
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setRow = (i: number, patch: Partial<UnitRow>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (i: number) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const filledRows = rows.filter((r) => r.tenant.trim() || r.property.trim() || r.amount.trim());

  async function handleGenerate() {
    const { buildDocumentPdf, downloadPdf } = await import("@/lib/pdf/pdfDoc");
    const blocks: Block[] = [];
    filledRows.forEach((r, i) => {
      if (i > 0) blocks.push({ type: "pageBreak" });
      blocks.push(
        ...receiptBlocks({
          landlord,
          tenant: r.tenant,
          property: r.property,
          amount: r.amount,
          paidOn,
          period,
          method,
        }),
      );
    });
    const bytes = await buildDocumentPdf({ blocks, pro: true });
    downloadPdf(bytes, `rent-receipts-${period || paidOn}.pdf`.replace(/\s+/g, "-"));
    track("pdf_downloaded", { tool: "batch-rent-receipt", count: filledRows.length });
  }

  if (loading) {
    return (
      <Card>
        <CardBody>
          <p className="text-sm text-ink/60">Checking your account…</p>
        </CardBody>
      </Card>
    );
  }

  // Pro gate. Batch generation is a paid feature; show a non-blocking upsell.
  if (!isPro) {
    return (
      <Card className="border-accent-400">
        <CardBody className="space-y-4">
          <h2 className="font-display text-xl font-semibold">
            Batch rent receipts — a Pro feature
          </h2>
          <p className="text-sm text-ink/70">
            Generate a watermark-free receipt for every unit in one click — one
            tidy PDF, one per page. Perfect for the 1st of the month. The{" "}
            <a href="/tools/rent-receipt-generator" className="underline">
              single rent receipt generator
            </a>{" "}
            is free forever.
          </p>
          <div className="flex flex-wrap gap-2">
            <GoProButton plan="monthly">Go Pro — ${SITE.proMonthly}/mo</GoProButton>
            <ButtonLink href="/pricing" variant="secondary">
              See what&apos;s included
            </ButtonLink>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Shared details</h2>
          <p className="text-sm text-ink/60">
            These apply to every receipt in the batch.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Landlord name" htmlFor="ll">
              <Input id="ll" value={landlord} onChange={(e) => setLandlord(e.target.value)} />
            </Field>
            <Field label="Payment date" htmlFor="paid">
              <Input id="paid" type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} />
            </Field>
            <Field label="Period covered" htmlFor="per">
              <Input id="per" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="June 2026" />
            </Field>
            <Field label="Payment method" htmlFor="meth">
              <Select id="meth" value={method} onChange={(e) => setMethod(e.target.value)}>
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Units</h2>
            <span className="text-sm text-ink/55">{filledRows.length} ready</span>
          </div>
          <div className="space-y-3">
            {rows.map((r, i) => (
              <div key={i} className="grid items-end gap-2 sm:grid-cols-[1fr_1fr_120px_auto]">
                <Field label={i === 0 ? "Tenant" : ""} htmlFor={`t${i}`}>
                  <Input id={`t${i}`} value={r.tenant} onChange={(e) => setRow(i, { tenant: e.target.value })} placeholder="Tenant name" />
                </Field>
                <Field label={i === 0 ? "Property / unit" : ""} htmlFor={`p${i}`}>
                  <Input id={`p${i}`} value={r.property} onChange={(e) => setRow(i, { property: e.target.value })} placeholder="123 Main St #2" />
                </Field>
                <Field label={i === 0 ? "Amount" : ""} htmlFor={`a${i}`}>
                  <Input id={`a${i}`} inputMode="decimal" value={r.amount} onChange={(e) => setRow(i, { amount: e.target.value })} placeholder="1500" />
                </Field>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRow(i)}
                  aria-label={`Remove unit ${i + 1}`}
                  disabled={rows.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={addRow}>
            + Add unit
          </Button>
        </CardBody>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={handleGenerate}
        disabled={filledRows.length === 0}
      >
        Generate {filledRows.length || ""} receipt{filledRows.length === 1 ? "" : "s"} (one PDF)
      </Button>

      <LegalDisclaimer />
    </div>
  );
}
