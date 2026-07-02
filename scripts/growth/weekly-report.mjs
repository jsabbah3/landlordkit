/**
 * Weekly growth report from Google Search Console CSV exports.
 *
 * Usage:
 *   1. GSC → Performance → last 7 days → Export → CSV. Unzip into a dated
 *      folder: growth/gsc/YYYY-MM-DD/ (keep Google's file names: Pages.csv,
 *      Queries.csv — "Top pages"/"Top queries" variants handled).
 *   2. node scripts/growth/weekly-report.mjs
 *
 * Compares the newest folder with the previous one (if any) and writes
 * growth/reports/week-<date>.md with trends and flags. No dependencies.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const GSC_DIR = "growth/gsc";
const OUT_DIR = "growth/reports";

function parseCsv(text) {
  // GSC CSVs are simple: quoted fields, comma-separated, header row.
  const rows = [];
  for (const line of text.split(/\r?\n/).filter(Boolean)) {
    const cells = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQ) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') inQ = false;
        else cur += ch;
      } else if (ch === '"') inQ = true;
      else if (ch === ",") { cells.push(cur); cur = ""; }
      else cur += ch;
    }
    cells.push(cur);
    rows.push(cells);
  }
  const [header, ...data] = rows;
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i]])));
}

function loadFolder(folder) {
  const out = {};
  for (const f of readdirSync(join(GSC_DIR, folder))) {
    const lower = f.toLowerCase();
    const kind = lower.includes("page") ? "pages" : lower.includes("quer") ? "queries" : null;
    if (!kind) continue;
    const rows = parseCsv(readFileSync(join(GSC_DIR, folder, f), "utf8"));
    out[kind] = rows.map((r) => ({
      key: r["Top pages"] ?? r["Page"] ?? r["Top queries"] ?? r["Query"] ?? "",
      clicks: Number(r["Clicks"] ?? 0),
      impressions: Number(r["Impressions"] ?? 0),
      ctr: parseFloat(String(r["CTR"] ?? "0").replace("%", "")) || 0,
      position: Number(r["Position"] ?? 0),
    }));
  }
  return out;
}

const folders = existsSync(GSC_DIR)
  ? readdirSync(GSC_DIR).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort()
  : [];
if (!folders.length) {
  console.error(`No GSC exports found. Create ${GSC_DIR}/YYYY-MM-DD/ with the CSVs (see header comment).`);
  process.exit(1);
}
const cur = loadFolder(folders.at(-1));
const prev = folders.length > 1 ? loadFolder(folders.at(-2)) : null;
const date = folders.at(-1);

const sum = (rows, k) => (rows ?? []).reduce((a, r) => a + r[k], 0);
const idx = (rows) => new Map((rows ?? []).map((r) => [r.key, r]));

let md = `# Growth report — week of ${date}\n\n`;
const totals = { clicks: sum(cur.pages, "clicks"), impressions: sum(cur.pages, "impressions") };
if (prev) {
  const p = { clicks: sum(prev.pages, "clicks"), impressions: sum(prev.pages, "impressions") };
  const pct = (a, b) => (b ? `${a >= b ? "+" : ""}${(((a - b) / b) * 100).toFixed(0)}%` : "n/a");
  md += `**Clicks:** ${totals.clicks} (${pct(totals.clicks, p.clicks)} vs prior) · **Impressions:** ${totals.impressions} (${pct(totals.impressions, p.impressions)})\n\n`;
} else {
  md += `**Clicks:** ${totals.clicks} · **Impressions:** ${totals.impressions} (first report — baseline)\n\n`;
}

const top = (rows, k, n = 10) => [...(rows ?? [])].sort((a, b) => b[k] - a[k]).slice(0, n);
md += `## Top pages by clicks\n\n| Page | Clicks | Impr. | CTR | Pos |\n|---|---|---|---|---|\n`;
for (const r of top(cur.pages, "clicks")) md += `| ${r.key} | ${r.clicks} | ${r.impressions} | ${r.ctr}% | ${r.position.toFixed(1)} |\n`;
md += `\n## Top queries by impressions\n\n| Query | Clicks | Impr. | Pos |\n|---|---|---|---|\n`;
for (const r of top(cur.queries, "impressions")) md += `| ${r.key} | ${r.clicks} | ${r.impressions} | ${r.position.toFixed(1)} |\n`;

// Flags — the "what to act on" section (decision rules in OPERATIONS.md §4).
md += `\n## Flags\n\n`;
const flags = [];
for (const r of cur.pages ?? []) {
  if (r.impressions >= 100 && r.ctr < 1) flags.push(`LOW-CTR: ${r.key} — ${r.impressions} impressions but ${r.ctr}% CTR. Rewrite title/description.`);
  if (r.position > 4 && r.position <= 15 && r.impressions >= 50) flags.push(`STRIKING-DISTANCE: ${r.key} at position ${r.position.toFixed(1)} — add internal links + enrich content to push to page 1.`);
}
if (prev) {
  const prevPages = idx(prev.pages);
  for (const r of top(cur.pages, "clicks", 20)) {
    const was = prevPages.get(r.key);
    if (was && was.clicks >= 5 && r.clicks < was.clicks * 0.5) flags.push(`DROP: ${r.key} clicks ${was.clicks} → ${r.clicks}. Check the page + SERP.`);
  }
  const curQ = idx(cur.queries);
  for (const q of top(prev.queries ?? [], "impressions", 25)) if (!curQ.has(q.key)) flags.push(`LOST-QUERY: "${q.key}" vanished from top queries.`);
}
md += flags.length ? flags.map((f) => `- ${f}`).join("\n") + "\n" : "- None this week.\n";
md += `\n_Next: fill the weekly table in gtm/metrics.md (GA4 + Stripe numbers), then follow OPERATIONS.md §3._\n`;

mkdirSync(OUT_DIR, { recursive: true });
const out = join(OUT_DIR, `week-${date}.md`);
writeFileSync(out, md);
console.log(`Wrote ${out} (${flags.length} flags)`);
