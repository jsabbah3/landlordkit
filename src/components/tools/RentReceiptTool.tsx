"use client";

import { useEffect, useState } from "react";
import { usd, longDate, todayISO } from "@/lib/format";
import { track } from "@/lib/analytics";
import { loadProfile, mergeProfile, fetchCloudProfile } from "@/lib/profile";
import { useProStatus } from "@/lib/useProStatus";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { UpgradeNudge } from "@/components/UpgradeNudge";
import { SaveDetailsButton } from "@/components/SaveDetailsButton";

const METHODS = ["Cash", "Check", "Bank transfer", "Money order", "Online / app", "Credit card"];

export function RentReceiptTool() {
  const { isPro } = useProStatus();
  const [landlord, setLandlord] = useState("");
  const [tenant, setTenant] = useState("");
  const [property, setProperty] = useState("");
  const [amount, setAmount] = useState("1500");
  const [paidOn, setPaidOn] = useState(todayISO());
  const [period, setPeriod] = useState("");
  const [method, setMethod] = useState(METHODS[0]);
  const [receiptNo, setReceiptNo] = useState("");
  const [generated, setGenerated] = useState(false);

  // Prefill from the saved profile once on mount (no-op if none saved).
  // Cloud profile loads async and wins over local when signed in.
  useEffect(() => {
    const p = loadProfile();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time profile prefill */
    if (p.landlordName) setLandlord(p.landlordName);
    if (p.tenantName) setTenant(p.tenantName);
    if (p.propertyAddress) setProperty(p.propertyAddress);
    if (p.monthlyRent) setAmount(p.monthlyRent);

    fetchCloudProfile().then((cloud) => {
      if (!cloud) return;
      const m = mergeProfile(p, cloud);
      if (m.landlordName) setLandlord(m.landlordName);
      if (m.tenantName) setTenant(m.tenantName);
      if (m.propertyAddress) setProperty(m.propertyAddress);
      if (m.monthlyRent) setAmount(m.monthlyRent);
    });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  async function handleDownloadPdf() {
    const { buildDocumentPdf, downloadPdf } = await import("@/lib/pdf/pdfDoc");
    const bytes = await buildDocumentPdf({
      blocks: [
        { type: "title", text: "Rent Receipt" },
        { type: "right", text: receiptNo ? `Receipt #: ${receiptNo}` : `Date: ${longDate(paidOn)}` },
        { type: "rule" },
        { type: "heading", text: `Amount received: ${usd(Number(amount))}` },
        { type: "paragraph", text: `Received from: ${tenant || "[tenant name]"}` },
        { type: "paragraph", text: `Property: ${property || "[property address]"}` },
        { type: "paragraph", text: `Payment date: ${longDate(paidOn)}` },
        { type: "paragraph", text: `Rental period covered: ${period || "[period, e.g. June 2026]"}` },
        { type: "paragraph", text: `Payment method: ${method}` },
        { type: "spacer", size: 10 },
        { type: "paragraph", text: "This receipt confirms the rent payment described above was received in full for the period stated." },
        { type: "signature", label: `${landlord || "[landlord name]"} — Received by` },
      ],
      pro: isPro,
    });
    downloadPdf(bytes, `rent-receipt-${period || paidOn}.pdf`.replace(/\s+/g, "-"));
    setGenerated(true);
    track("pdf_downloaded", { tool: "rent-receipt" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount received" htmlFor="amt"><Input id="amt" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
            <Field label="Payment date" htmlFor="paid"><Input id="paid" type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Period covered" htmlFor="per"><Input id="per" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="June 2026" /></Field>
            <Field label="Payment method" htmlFor="meth">
              <Select id="meth" value={method} onChange={(e) => setMethod(e.target.value)}>
                {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Receipt number (optional)" htmlFor="rno"><Input id="rno" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} placeholder="0001" /></Field>
          <div className="border-t border-line pt-4 space-y-3">
            <Field label="Landlord name" htmlFor="ll"><Input id="ll" value={landlord} onChange={(e) => setLandlord(e.target.value)} /></Field>
            <Field label="Tenant name" htmlFor="tn"><Input id="tn" value={tenant} onChange={(e) => setTenant(e.target.value)} /></Field>
            <Field label="Property address" htmlFor="prop"><Input id="prop" value={property} onChange={(e) => setProperty(e.target.value)} /></Field>
            <SaveDetailsButton getDetails={() => ({ landlordName: landlord, tenantName: tenant, propertyAddress: property, monthlyRent: amount })} />
          </div>
          <Button className="w-full" size="lg" onClick={handleDownloadPdf}>Download receipt</Button>
          <a href="/tools/rent-receipt-generator/batch" className="block text-center text-sm text-brand-700 underline underline-offset-2">
            Have multiple units? Batch-generate every receipt at once →
          </a>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {generated && (
          <UpgradeNudge feature="rent-receipt-batch" reason="Generate receipts for every unit at once and save your details — perfect for the 1st of the month." />
        )}
        <LegalDisclaimer />
      </div>
    </div>
  );
}
