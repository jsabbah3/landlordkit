/** Shared number / currency / date formatting used by tools and PDFs. */

export const usd = (n: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

export const percent = (n: number, digits = 2): string =>
  `${(Number.isFinite(n) ? n : 0).toFixed(digits)}%`;

/** Format an ISO date (YYYY-MM-DD) or Date as e.g. "June 10, 2026". */
export const longDate = (d: string | Date): string => {
  const date = typeof d === "string" ? parseISODate(d) : d;
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

/** Parse a YYYY-MM-DD string as a *local* date (avoids UTC off-by-one). */
export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const [, y, mo, d] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Local-date Date → YYYY-MM-DD string (no UTC shift). */
export const isoDate = (d: Date): string => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const todayISO = (): string => isoDate(new Date());
