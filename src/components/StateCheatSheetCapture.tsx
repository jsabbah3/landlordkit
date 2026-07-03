"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { track } from "@/lib/analytics";

/**
 * State-specific lead magnet: signup delivers the "[State] Landlord Law Cheat
 * Sheet" PDF instantly, generated client-side from the verified legal DB.
 * Same /api/subscribe backend as EmailCapture; distinct source for analytics.
 */
export function StateCheatSheetCapture({ code, stateName }: { code: string; stateName: string }) {
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
        body: JSON.stringify({ email, source: `cheatsheet:${code.toLowerCase()}` }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status >= 400 && res.status < 500) {
        setErrMsg(data.error || "Something went wrong — try again.");
        setState("error");
        return;
      }
      // Server-side save failure: still deliver the promised PDF.
      if (res.ok) track("email_signup", { source: `cheatsheet:${code.toLowerCase()}` });
      const [{ buildDocumentPdf, downloadPdf }, { buildStateCheatSheet }] = await Promise.all([
        import("@/lib/pdf/pdfDoc"),
        import("@/content/stateCheatSheet"),
      ]);
      const blocks = buildStateCheatSheet(code, stateName);
      if (blocks) {
        const bytes = await buildDocumentPdf({ blocks, pro: false });
        downloadPdf(bytes, `${stateName.toLowerCase().replace(/\s+/g, "-")}-landlord-law-cheat-sheet.pdf`);
      }
      setState("done");
    } catch {
      setErrMsg("Something went wrong — try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-sm font-medium text-brand-700">
        ✓ Your {stateName} cheat sheet is downloading. We&apos;ll email you when{" "}
        {stateName} rules change — no spam, unsubscribe anytime.
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
          {state === "busy" ? "Sending…" : `Get the ${stateName} cheat sheet`}
        </Button>
      </div>
      {state === "error" && <p className="text-sm text-red-600">{errMsg}</p>}
      <p className="text-xs text-ink/45">
        One-page PDF of the verified {stateName} rules, statutes cited. Instant download.
      </p>
    </form>
  );
}
