"use client";

import { useEffect, useState } from "react";
import { usd, longDate, todayISO } from "@/lib/format";
import { track } from "@/lib/analytics";
import { loadProfile } from "@/lib/profile";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { UpgradeNudge } from "@/components/UpgradeNudge";
import { SaveDetailsButton } from "@/components/SaveDetailsButton";

export function LeaseRenewalTool() {
  const [landlord, setLandlord] = useState("");
  const [tenant, setTenant] = useState("");
  const [property, setProperty] = useState("");
  const [currentRent, setCurrentRent] = useState("1800");
  const [newRent, setNewRent] = useState("1875");
  const [termMonths, setTermMonths] = useState("12");
  const [newStart, setNewStart] = useState("");
  const [respondBy, setRespondBy] = useState("");
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time profile prefill */
    if (p.landlordName) setLandlord(p.landlordName);
    if (p.tenantName) setTenant(p.tenantName);
    if (p.propertyAddress) setProperty(p.propertyAddress);
    if (p.monthlyRent) setCurrentRent(p.monthlyRent);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  async function handleDownloadPdf() {
    const { buildDocumentPdf, downloadPdf } = await import("@/lib/pdf/pdfDoc");
    const sameRent = Number(newRent) === Number(currentRent);
    const bytes = await buildDocumentPdf({
      blocks: [
        { type: "right", text: longDate(todayISO()) },
        { type: "spacer", size: 8 },
        { type: "paragraph", text: `To: ${tenant || "[tenant name]"}` },
        { type: "paragraph", text: property || "[property address]" },
        { type: "spacer", size: 6 },
        { type: "title", text: "Lease Renewal Offer" },
        { type: "rule" },
        { type: "paragraph", text: `Dear ${tenant || "Tenant"},` },
        {
          type: "paragraph",
          text: `We're pleased to offer you a renewal of your lease for the property at ${property || "[property address]"}. We value you as a tenant and hope you'll choose to stay.`,
        },
        {
          type: "paragraph",
          text: sameRent
            ? `The monthly rent will remain ${usd(Number(currentRent))}.`
            : `The new monthly rent will be ${usd(Number(newRent))} (currently ${usd(Number(currentRent))}).`,
        },
        {
          type: "paragraph",
          text: `Proposed renewal term: ${termMonths} months${newStart ? `, beginning ${longDate(newStart)}` : ""}. All other terms of your current lease remain in effect unless otherwise agreed in writing.`,
        },
        {
          type: "paragraph",
          text: respondBy
            ? `Please let us know your decision by ${longDate(respondBy)}. If you'd like to renew, sign below and return a copy.`
            : `If you'd like to renew, please sign below and return a copy. We're happy to answer any questions.`,
        },
        { type: "spacer", size: 8 },
        { type: "paragraph", text: "Sincerely," },
        { type: "signature", label: `${landlord || "[landlord name]"} — Landlord` },
        { type: "signature", label: "Tenant signature / date (to accept)" },
        { type: "spacer", size: 10 },
        { type: "paragraph", text: "Informational template — not legal advice." },
      ],
      pro: false,
    });
    downloadPdf(bytes, "lease-renewal-letter.pdf");
    setGenerated(true);
    track("pdf_downloaded", { tool: "lease-renewal" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current rent" htmlFor="cur"><Input id="cur" inputMode="decimal" value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} /></Field>
            <Field label="New rent" htmlFor="new"><Input id="new" inputMode="decimal" value={newRent} onChange={(e) => setNewRent(e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Renewal term (months)" htmlFor="term"><Input id="term" inputMode="numeric" value={termMonths} onChange={(e) => setTermMonths(e.target.value)} /></Field>
            <Field label="New lease start" htmlFor="start"><Input id="start" type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)} /></Field>
          </div>
          <Field label="Respond by (optional)" htmlFor="respond"><Input id="respond" type="date" value={respondBy} onChange={(e) => setRespondBy(e.target.value)} /></Field>
          <div className="border-t border-line pt-4 space-y-3">
            <Field label="Landlord name" htmlFor="ll"><Input id="ll" value={landlord} onChange={(e) => setLandlord(e.target.value)} /></Field>
            <Field label="Tenant name" htmlFor="tn"><Input id="tn" value={tenant} onChange={(e) => setTenant(e.target.value)} /></Field>
            <Field label="Property address" htmlFor="prop"><Input id="prop" value={property} onChange={(e) => setProperty(e.target.value)} /></Field>
            <SaveDetailsButton getDetails={() => ({ landlordName: landlord, tenantName: tenant, propertyAddress: property, monthlyRent: currentRent })} />
          </div>
          <Button className="w-full" size="lg" onClick={handleDownloadPdf}>Download renewal letter</Button>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {generated && (
          <UpgradeNudge feature="lease-renewal-saved-info" reason="Save your landlord and property details and add your branding to every letter." />
        )}
        <LegalDisclaimer />
      </div>
    </div>
  );
}
