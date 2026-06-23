import type { DueObligation } from "./engine";

export interface CustomDeadline {
  id: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  recurrence: "once" | "annual";
}

const pad = (n: number) => String(n).padStart(2, "0");

function nextOf(mmdd: string, from: Date): string {
  const [m, d] = mmdd.split("-").map(Number);
  let y = from.getFullYear();
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  if (new Date(y, m - 1, d) < today) y++;
  return `${y}${pad(m)}${pad(d)}`;
}

const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

/** DISPLAY alarm firing `days` before the event start. */
function valarm(days: number, summary: string) {
  return [
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `TRIGGER:-P${days}D`,
    `DESCRIPTION:${esc(summary)}`,
    "END:VALARM",
  ].join("\r\n");
}

function vevent(
  uid: string,
  date: string,
  summary: string,
  desc: string,
  rrule?: string,
  alarmDays: number[] = [],
) {
  return [
    "BEGIN:VEVENT",
    `UID:${uid}@getlandlordkit.com`,
    "DTSTAMP:20260101T000000Z",
    `DTSTART;VALUE=DATE:${date}`,
    `SUMMARY:${esc(summary)}`,
    desc ? `DESCRIPTION:${esc(desc)}` : "",
    rrule ? `RRULE:${rrule}` : "",
    ...alarmDays.map((d) => valarm(d, summary)),
    "END:VEVENT",
  ].filter(Boolean).join("\r\n");
}

/**
 * Build an .ics calendar from the user's obligations + custom deadlines.
 * Fixed obligations emit one yearly-recurring all-day event per due date;
 * anniversary items recur every N years; `varies` (undated) items are omitted.
 */
export function buildIcs(
  due: DueObligation[],
  custom: CustomDeadline[],
  today: Date = new Date(),
  /** Days-before to attach as DISPLAY reminders (e.g. [7, 1]). Empty = none. */
  alarmDays: number[] = [],
): string {
  const events: string[] = [];

  for (const { obligation: o, nextDue } of due) {
    const desc = `${o.what} (File with: ${o.fileWith}. Source: ${o.cite.statute}.) Not legal/tax advice.`;
    if (o.dueType === "fixed") {
      for (const mmdd of o.dueDates ?? []) {
        events.push(vevent(`${o.id}-${mmdd}`, nextOf(mmdd, today), o.title, desc, "FREQ=YEARLY", alarmDays));
      }
    } else if (o.dueType === "anniversary" && nextDue) {
      const interval = o.everyYears && o.everyYears > 1 ? `;INTERVAL=${o.everyYears}` : "";
      events.push(vevent(o.id, nextDue.replace(/-/g, ""), o.title, desc, `FREQ=YEARLY${interval}`, alarmDays));
    }
    // varies => no date, skipped
  }

  for (const c of custom) {
    events.push(
      vevent(
        `custom-${c.id}`,
        c.date.replace(/-/g, ""),
        c.title,
        "Custom deadline added in LandlordKit.",
        c.recurrence === "annual" ? "FREQ=YEARLY" : undefined,
        alarmDays,
      ),
    );
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LandlordKit//Compliance Calendar//EN",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}
