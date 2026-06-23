"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { saveProfile, syncProfileToCloud, type SavedProfile } from "@/lib/profile";
import { useProStatus } from "@/lib/useProStatus";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { GoProButton } from "@/components/pro/GoProButton";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { SITE } from "@/lib/site";

/** Extract the text layer from a PDF entirely in the browser, so the raw file
 *  never leaves the device. Returns "" for image-only (scanned) PDFs. */
async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  // Bundled worker — Turbopack/webpack resolve this URL at build time.
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let out = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    out += content.items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n";
  }
  return out.trim();
}

const FIELD_LABELS: [keyof SavedProfile, string][] = [
  ["landlordName", "Landlord name"],
  ["tenantName", "Tenant name"],
  ["propertyAddress", "Property address"],
  ["monthlyRent", "Monthly rent"],
  ["leaseStartDate", "Lease start"],
  ["leaseEndDate", "Lease end"],
  ["securityDeposit", "Security deposit"],
];

type Status = "idle" | "reading" | "extracting" | "review" | "saved";

export function LeaseUploadTool() {
  const { isPro, leaseExtract, loading } = useProStatus();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<SavedProfile>({});

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setStatus("reading");
    let text = "";
    try {
      text = await extractPdfText(file);
    } catch {
      setStatus("idle");
      setError("Couldn't read that PDF. Make sure it's a valid PDF file.");
      return;
    }
    if (text.length < 40) {
      setStatus("idle");
      setError(
        "This looks like a scanned PDF with no text layer. Type your details into the tools instead — we don't read images yet.",
      );
      return;
    }

    setStatus("extracting");
    try {
      const res = await fetch("/api/lease-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setStatus("idle");
        setError(body.error ?? "Extraction failed. Please try again.");
        return;
      }
      const body = (await res.json()) as { fields: SavedProfile };
      setFields(body.fields ?? {});
      setStatus("review");
      track("lease_extracted", {});
    } catch {
      setStatus("idle");
      setError("Network error. Please try again.");
    }
  }

  function setField(key: keyof SavedProfile, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    const saved = saveProfile(fields);
    syncProfileToCloud(saved);
    setStatus("saved");
    track("lease_saved_to_profile", {});
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

  if (!isPro) {
    return (
      <Card className="border-accent-400">
        <CardBody className="space-y-4">
          <h2 className="font-display text-xl font-semibold">
            Lease autofill — a Pro feature
          </h2>
          <p className="text-sm text-ink/70">
            Upload a lease PDF and we&apos;ll pull out the landlord, tenant,
            property, rent, dates, and deposit so you never retype them. Your
            file stays on your device — we only read the text, and we don&apos;t
            store the lease.
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

  if (!leaseExtract) {
    return (
      <Card>
        <CardBody>
          <p className="text-sm text-ink/70">
            Lease autofill is coming online shortly. In the meantime, every tool
            lets you enter details by hand and save them for reuse.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="space-y-4">
          <p className="text-sm text-ink/70">
            Upload a lease PDF. We read the text in your browser and extract the
            key details — your file never leaves your device, and the lease is
            never stored.
          </p>
          <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-line bg-paper-2 px-4 py-8 text-center text-sm text-ink/70 hover:bg-paper-3">
            <input
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={status === "reading" || status === "extracting"}
            />
            {status === "reading"
              ? "Reading PDF…"
              : status === "extracting"
                ? "Extracting details…"
                : "Choose a lease PDF"}
          </label>
          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>
          )}
        </CardBody>
      </Card>

      {(status === "review" || status === "saved") && (
        <Card>
          <CardBody className="space-y-4">
            <h2 className="font-display text-lg font-semibold">
              Check the details
            </h2>
            <p className="text-sm text-ink/60">
              We pulled these from your lease — please confirm or fix anything
              before saving. Blank means we couldn&apos;t find it.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {FIELD_LABELS.map(([key, label]) => (
                <Field key={key} label={label} htmlFor={key}>
                  <Input
                    id={key}
                    value={fields[key] ?? ""}
                    onChange={(e) => setField(key, e.target.value)}
                  />
                </Field>
              ))}
            </div>
            {status === "saved" ? (
              <p className="rounded-md bg-brand-50 p-3 text-sm text-brand-800">
                Saved. Your tools will now prefill with these details.
              </p>
            ) : (
              <Button size="lg" className="w-full" onClick={handleSave}>
                Save these details
              </Button>
            )}
          </CardBody>
        </Card>
      )}

      <LegalDisclaimer />
    </div>
  );
}
