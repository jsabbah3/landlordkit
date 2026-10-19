"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { useProStatus } from "@/lib/useProStatus";
import { addTrackedDeadline, trackedDeadlineId } from "@/lib/trackedDeadlines";
import { longDate } from "@/lib/format";

/**
 * "Track this deadline" — saves a computed deadline into the user's compliance
 * calendar so it becomes an ongoing tracked obligation with reminders, instead
 * of a one-shot calculation they forget. The recurring-value / free→Pro loop.
 */
export function TrackDeadlineButton({
  kind,
  dedupeKey,
  dateISO,
  title,
  toolEvent,
  recurrence = "once",
  label,
}: {
  /** Obligation type, e.g. "deposit-return" (part of the dedupe id). */
  kind: string;
  /** Stable per-obligation key (e.g. state slug or tenant) for the dedupe id. */
  dedupeKey: string;
  /** Deadline date, ISO YYYY-MM-DD (first occurrence if recurring). */
  dateISO: string;
  /** Human title shown in the calendar / reminder, e.g. "Return Jane's deposit". */
  title: string;
  /** Analytics tool label. */
  toolEvent: string;
  /** "once" (default) or "annual" for recurring reminders. */
  recurrence?: "once" | "annual";
  /** Override the button label (else a sensible default per recurrence). */
  label?: string;
}) {
  const { isPro } = useProStatus();
  const [saved, setSaved] = useState(false);
  const annual = recurrence === "annual";

  function onTrack() {
    addTrackedDeadline({
      id: trackedDeadlineId(kind, dedupeKey, dateISO),
      title,
      date: dateISO,
      recurrence,
    });
    setSaved(true);
    track("deadline_tracked", { tool: toolEvent, isPro, recurrence });
  }

  if (saved) {
    return (
      <div className="rounded-lg border border-brand-300 bg-brand-50 p-3 text-sm">
        <p className="font-medium text-brand-800">
          {annual ? `✓ Tracking yearly — next ${longDate(dateISO)}` : `✓ Tracking — due ${longDate(dateISO)}`}
        </p>
        <p className="mt-1 text-ink/70">
          {isPro ? (
            <>
              It&apos;s on your{" "}
              <Link href="/tools/compliance-calendar" className="underline">
                compliance calendar
              </Link>
              . Turn on reminders there and we&apos;ll ping you 7 days and 1 day
              before — on your phone.
            </>
          ) : (
            <>
              Saved to your{" "}
              <Link href="/tools/compliance-calendar" className="underline">
                compliance calendar
              </Link>{" "}
              (export to your phone). <strong>Pro</strong> pushes an automatic
              reminder 7 days and 1 day before the deadline.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <Button variant="secondary" className="w-full" onClick={onTrack}>
      {label ??
        (annual
          ? `🔁 Remind me every year (next: ${longDate(dateISO)})`
          : `🔔 Track this deadline — remind me before ${longDate(dateISO)}`)}
    </Button>
  );
}
