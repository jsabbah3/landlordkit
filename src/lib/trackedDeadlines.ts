/**
 * Tracked deadlines — the "save this as a thing that reminds me" loop that
 * turns one-shot calculators into recurring value. A tracked deadline is just
 * a one-time custom deadline on the Compliance Calendar, so it reuses that
 * tool's storage AND its reminder feed (7-day / 1-day alarms) with zero new
 * infrastructure. Free users get it in their calendar + .ics export; Pro users
 * with the reminder feed enabled get it pushed to their phone.
 *
 * Storage contract is shared byte-for-byte with ComplianceCalendarTool
 * (localStorage key `lk_compliance_v1`, shape { profile, custom, completed }).
 */
import type { CustomDeadline } from "@/tools/compliance-calendar/ical";

const LS_KEY = "lk_compliance_v1";

interface ComplianceStore {
  profile?: unknown;
  custom?: CustomDeadline[];
  completed?: Record<string, string>;
}

/** Append (or replace by id) a deadline in a custom-deadline list. Pure. */
export function mergeCustom(list: CustomDeadline[], d: CustomDeadline): CustomDeadline[] {
  const without = list.filter((x) => x.id !== d.id);
  return [...without, d];
}

/** Stable id so re-tracking the same obligation updates rather than duplicates. */
export function trackedDeadlineId(kind: string, key: string, dateISO: string): string {
  return `${kind}-${key}-${dateISO}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
}

/**
 * Add a deadline to the user's compliance calendar. Writes localStorage
 * (works for everyone, immediately), then best-effort syncs to the cloud
 * profile for signed-in Pro users so their reminder feed picks it up.
 * Returns the merged store so callers can reflect state if they want.
 */
export function addTrackedDeadline(d: CustomDeadline): ComplianceStore {
  let store: ComplianceStore = {};
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    store = raw ? (JSON.parse(raw) as ComplianceStore) : {};
  } catch {
    store = {};
  }
  const next: ComplianceStore = { ...store, custom: mergeCustom(store.custom ?? [], d) };
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {
    /* storage blocked — the cloud sync below may still land */
  }

  // Best-effort cloud sync: only when a cloud profile already exists (signed-in
  // Pro who has used the calendar). Fetch → merge → post, so we never clobber
  // their saved profile. Silent on every failure.
  void (async () => {
    try {
      const res = await fetch("/api/compliance-profile");
      if (!res.ok) return; // not signed in, or not Pro (403)
      const json = (await res.json()) as { profile: ComplianceStore | null };
      const cloud = json.profile;
      if (!cloud) return; // no cloud calendar yet — localStorage holds it until they save
      const merged: ComplianceStore = { ...cloud, custom: mergeCustom(cloud.custom ?? [], d) };
      await fetch("/api/compliance-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: merged }),
      });
    } catch {
      /* ignore — localStorage is the source of truth */
    }
  })();

  return next;
}
