"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { track } from "@/lib/analytics";

/**
 * Email capture with a real incentive: the Landlord Year-End Tax Prep
 * Checklist PDF, generated client-side and downloaded immediately on signup.
 * Posts to /api/subscribe (same-origin; stored server-side in Supabase).
 */
export function EmailCapture({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status >= 400 && res.status < 500) {
        // Bad input (invalid email) — ask the user to correct it.
        setErrMsg(data.error || "Something went wrong — try again.");
        setState("error");
        return;
      }
      // Server-side save failure: still deliver the promised PDF — never hold
      // the lead magnet hostage to our storage. (Signup isn't tracked then.)
      if (res.ok) track("email_signup", { source });
      // Deliver the incentive immediately, client-side.
      const [{ buildDocumentPdf, downloadPdf }, { TAX_CHECKLIST_BLOCKS }] =
        await Promise.all([
          import("@/lib/pdf/pdfDoc"),
          import("@/content/taxChecklist"),
        ]);
      const bytes = await buildDocumentPdf({ blocks: TAX_CHECKLIST_BLOCKS, pro: false });
      downloadPdf(bytes, "landlord-tax-prep-checklist.pdf");
      setState("done");
    } catch {
      setErrMsg("Something went wrong — try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-sm font-medium text-brand-700">
        ✓ Your checklist is downloading. We&apos;ll email you when state laws
        change or new tools launch — no spam, unsubscribe anytime.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          className="sm:max-w-xs"
        />
        <Button type="submit" disabled={state === "busy"}>
          {state === "busy" ? "Sending…" : "Get the free checklist"}
        </Button>
      </div>
      {state === "error" && <p className="text-sm text-red-600">{errMsg}</p>}
      <p className="text-xs text-ink/45">
        Free PDF, instant download. We only email for law changes and new tools.
      </p>
    </form>
  );
}
