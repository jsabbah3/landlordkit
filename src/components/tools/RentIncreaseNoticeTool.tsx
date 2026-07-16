"use client";

import { useEffect, useMemo, useState } from "react";
import { US_STATES, getStateByCode } from "@/lib/states";
import { usd, percent, longDate, todayISO } from "@/lib/format";
import { track } from "@/lib/analytics";
import { getRentIncreaseRule, RENT_INCREASE } from "@/tools/rent-increase-notice/data";
import { loadProfile, mergeProfile, fetchCloudProfile } from "@/lib/profile";
import { useProStatus } from "@/lib/useProStatus";
import { SaveDetailsButton } from "@/components/SaveDetailsButton";
import {
  computeRequiredNotice,
  earliestEffectiveDate,
} from "@/tools/rent-increase-notice/logic";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { UpgradeNudge } from "@/components/UpgradeNudge";
import { TrackDeadlineButton } from "@/components/TrackDeadlineButton";

function toISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function RentIncreaseNoticeTool({
  lockedStateCode,
}: {
  lockedStateCode?: string;
}) {
  const { isPro } = useProStatus();
  const [stateCode, setStateCode] = useState(lockedStateCode ?? "CA");
  const [landlord, setLandlord] = useState("");
  const [tenant, setTenant] = useState("");
  const [property, setProperty] = useState("");
  const [currentRent, setCurrentRent] = useState("2000");
  const [newRent, setNewRent] = useState("2150");
  const [tenancyMonths, setTenancyMonths] = useState("");
  const [noticeDate, setNoticeDate] = useState(todayISO());
  // Empty = use the computed earliest lawful date; non-empty = user override.
  const [effectiveOverride, setEffectiveOverride] = useState("");
  const [generated, setGenerated] = useState(false);

  const rule = useMemo(
    () => getRentIncreaseRule(stateCode) ?? RENT_INCREASE.CA,
    [stateCode],
  );
  const state = getStateByCode(stateCode);

  const result = useMemo(
    () =>
      computeRequiredNotice({
        rule,
        currentRent: Number(currentRent),
        newRent: Number(newRent),
        tenancyMonths: Number(tenancyMonths),
      }),
    [rule, currentRent, newRent, tenancyMonths],
  );

  const earliest = useMemo(
    () => earliestEffectiveDate(result.requiredNoticeDays, noticeDate),
    [result.requiredNoticeDays, noticeDate],
  );

  // The shown effective date defaults to the earliest lawful date and updates
  // automatically as inputs change, until the user picks their own date.
  const effectiveValue = effectiveOverride || toISO(earliest);

  // Hydrate once from a shared URL (one-time read from an external system).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    const p = loadProfile();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration (profile, then URL overrides) */
    if (p.landlordName) setLandlord(p.landlordName);
    if (p.tenantName) setTenant(p.tenantName);
    if (p.propertyAddress) setProperty(p.propertyAddress);
    if (p.monthlyRent) setCurrentRent(p.monthlyRent);
    if (!lockedStateCode && p.state && getStateByCode(p.state)) setStateCode(p.state);
    if (q.get("current")) setCurrentRent(q.get("current")!);
    if (q.get("new")) setNewRent(q.get("new")!);
    if (q.get("tenancy")) setTenancyMonths(q.get("tenancy")!);
    if (!lockedStateCode && q.get("state")) {
      const s = q.get("state")!.toUpperCase();
      if (getStateByCode(s)) setStateCode(s);
    }

    fetchCloudProfile().then((cloud) => {
      if (!cloud) return;
      const m = mergeProfile(p, cloud);
      if (m.landlordName) setLandlord(m.landlordName);
      if (m.tenantName) setTenant(m.tenantName);
      if (m.propertyAddress) setProperty(m.propertyAddress);
      if (m.monthlyRent) setCurrentRent(m.monthlyRent);
      if (!lockedStateCode && m.state && getStateByCode(m.state)) setStateCode(m.state);
    });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [lockedStateCode]);

  const effectiveTooSoon =
    !!effectiveOverride && new Date(effectiveOverride) < earliest;

  function letterBody(): string {
    const eff = longDate(effectiveValue);
    return [
      `This letter is formal notice that the monthly rent for the property located at ${property || "[property address]"} will increase.`,
      `Current monthly rent: ${usd(Number(currentRent))}`,
      `New monthly rent: ${usd(Number(newRent))}`,
      `Effective date of new rent: ${eff}`,
      `This notice is provided ${result.requiredNoticeDays} or more days before the effective date, consistent with ${state?.name} requirements (${rule.cite.statute}). All other terms of your tenancy remain unchanged.`,
      `Please contact me with any questions. Thank you for being a valued tenant.`,
    ].join("\n\n");
  }

  async function handleDownloadPdf() {
    const { buildDocumentPdf, downloadPdf } = await import("@/lib/pdf/pdfDoc");
    const bytes = await buildDocumentPdf({
      blocks: [
        { type: "right", text: longDate(noticeDate) },
        { type: "spacer", size: 8 },
        { type: "paragraph", text: `To: ${tenant || "[tenant name]"}` },
        { type: "paragraph", text: property || "[property address]" },
        { type: "spacer", size: 6 },
        { type: "title", text: "Notice of Rent Increase" },
        { type: "rule" },
        { type: "paragraph", text: letterBody() },
        { type: "spacer", size: 10 },
        { type: "paragraph", text: `Sincerely,` },
        { type: "signature", label: `${landlord || "[landlord name]"} — Landlord` },
        { type: "spacer", size: 12 },
        { type: "paragraph", text: "Informational template — not legal advice. Verify your state and local requirements." },
      ],
      pro: isPro,
    });
    downloadPdf(bytes, `rent-increase-notice-${state?.slug ?? "letter"}.pdf`);
    setGenerated(true);
    track("pdf_downloaded", { tool: "rent-increase-notice", state: stateCode });
  }

  function shareUrl(): string {
    const q = new URLSearchParams({
      state: stateCode,
      current: currentRent,
      new: newRent,
    });
    if (tenancyMonths) q.set("tenancy", tenancyMonths);
    return `${window.location.origin}${window.location.pathname}?${q.toString()}`;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      <Card>
        <CardBody className="space-y-4">
          {!lockedStateCode && (
            <Field label="State" htmlFor="state">
              <Select id="state" value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Current monthly rent" htmlFor="current">
              <Input id="current" inputMode="decimal" value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} />
            </Field>
            <Field label="New monthly rent" htmlFor="new">
              <Input id="new" inputMode="decimal" value={newRent} onChange={(e) => setNewRent(e.target.value)} />
            </Field>
          </div>

          <Field
            label="Tenant's length of tenancy (months)"
            htmlFor="tenancy"
            hint="Optional — some states (e.g. NY) require more notice for longer tenancies."
          >
            <Input id="tenancy" inputMode="numeric" value={tenancyMonths} onChange={(e) => setTenancyMonths(e.target.value)} placeholder="e.g. 18" />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Notice date" htmlFor="noticeDate">
              <Input id="noticeDate" type="date" value={noticeDate} onChange={(e) => setNoticeDate(e.target.value)} />
            </Field>
            <Field label="Effective date" htmlFor="effDate">
              <Input id="effDate" type="date" value={effectiveValue} onChange={(e) => setEffectiveOverride(e.target.value)} />
            </Field>
          </div>

          <div className="border-t border-line pt-4">
            <p className="mb-3 text-sm font-medium text-ink/70">
              Letter details (optional)
            </p>
            <div className="space-y-3">
              <Field label="Landlord name" htmlFor="landlord">
                <Input id="landlord" value={landlord} onChange={(e) => setLandlord(e.target.value)} placeholder="Your name" />
              </Field>
              <Field label="Tenant name" htmlFor="tenant">
                <Input id="tenant" value={tenant} onChange={(e) => setTenant(e.target.value)} placeholder="Tenant name" />
              </Field>
              <Field label="Property address" htmlFor="property">
                <Input id="property" value={property} onChange={(e) => setProperty(e.target.value)} placeholder="123 Main St, Unit 2" />
              </Field>
              <SaveDetailsButton getDetails={() => ({ landlordName: landlord, tenantName: tenant, propertyAddress: property, monthlyRent: currentRent, state: stateCode })} />
            </div>
          </div>

          <Button onClick={handleDownloadPdf} className="w-full" size="lg">
            Download notice PDF
          </Button>
        </CardBody>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardBody>
            <p className="text-sm text-ink/60">Required written notice</p>
            <p className="font-display text-4xl font-semibold text-brand-700">
              {result.requiredNoticeDays} days
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-paper-2 p-3">
                <dt className="text-ink/55">Increase</dt>
                <dd className="font-medium">
                  {usd(result.increaseAmount)} ({percent(result.increasePct)})
                </dd>
              </div>
              <div className="rounded-lg bg-paper-2 p-3">
                <dt className="text-ink/55">Earliest effective date</dt>
                <dd className="font-medium">{longDate(toISO(earliest))}</dd>
              </div>
            </dl>

            {result.governingNotes.map((n) => (
              <p key={n} className="mt-3 text-sm text-ink/70">• {n}</p>
            ))}

            {effectiveTooSoon && (
              <Callout tone="warning" className="mt-3">
                Your chosen effective date is earlier than the {result.requiredNoticeDays}-day
                notice period allows. The earliest lawful date is{" "}
                {longDate(toISO(earliest))}.
              </Callout>
            )}

            <div className="mt-4">
              <TrackDeadlineButton
                kind="rent-increase"
                dedupeKey={`${state?.slug ?? stateCode}-${tenant || property || "unit"}`}
                dateISO={effectiveTooSoon ? toISO(earliest) : effectiveValue}
                title={`Rent increase takes effect${tenant ? ` — ${tenant}` : ""} (new rent ${usd(Number(newRent))})`}
                toolEvent="rent-increase-notice"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard?.writeText(shareUrl());
                  track("result_shared", { tool: "rent-increase-notice" });
                }}
              >
                Copy shareable link
              </Button>
            </div>
          </CardBody>
        </Card>

        {rule.rentControl !== "none" && (
          <Callout tone="warning" title="Rent control may apply">
            {rule.controlNote ??
              "A rent-control cap may limit how much you can raise the rent. Check your local rules."}
          </Callout>
        )}

        {generated && (
          <UpgradeNudge
            feature="rent-increase-saved-info"
            reason="Save your landlord and property details, add your logo, and remove the footer on every letter."
          />
        )}

        <LegalDisclaimer />
      </div>
    </div>
  );
}
