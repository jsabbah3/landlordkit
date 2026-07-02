/**
 * Site health check: fetches the live sitemap, verifies every URL returns 200
 * (catches broken/removed pages before Google does), and spot-checks the
 * pages that matter (analytics tag, schema, robots).
 *
 * Usage: node scripts/growth/check-site.mjs [--fast]
 *   --fast checks a 30-URL sample instead of the full sitemap.
 */
const BASE = "https://getlandlordkit.com";
const fast = process.argv.includes("--fast");

const fail = [];
const warn = [];

async function get(url) {
  const res = await fetch(url, { redirect: "manual", headers: { "User-Agent": "LandlordKit-HealthCheck" } });
  return res;
}

// 1. Robots + sitemap
const robots = await (await get(`${BASE}/robots.txt`)).text();
if (!robots.includes("Sitemap:")) fail.push("robots.txt missing Sitemap line");
const smRes = await get(`${BASE}/sitemap.xml`);
if (smRes.status !== 200) fail.push(`sitemap.xml → ${smRes.status}`);
const sm = await smRes.text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`Sitemap: ${urls.length} URLs`);

// 2. Every sitemap URL must be 200 (no redirects — canonicals should be direct)
const sample = fast ? urls.filter((_, i) => i % Math.ceil(urls.length / 30) === 0) : urls;
let done = 0;
const POOL = 10;
async function worker(queue) {
  for (;;) {
    const url = queue.pop();
    if (!url) return;
    try {
      const res = await get(url);
      if (res.status !== 200) fail.push(`${res.status}: ${url}`);
    } catch (e) {
      fail.push(`FETCH-ERROR: ${url} (${e.message})`);
    }
    if (++done % 50 === 0) process.stdout.write(`  ...${done}/${sample.length}\n`);
  }
}
const queue = [...sample].reverse(); // single shared queue across the pool
await Promise.all(Array.from({ length: POOL }, () => worker(queue)));
console.log(`Checked ${sample.length} URLs${fast ? " (sample)" : ""}`);

// 3. Key-page spot checks
const home = await (await get(BASE)).text();
if (!/googletagmanager|plausible/.test(home)) fail.push("No analytics tag on homepage");
const laws = await (await get(`${BASE}/laws`)).text();
if (!laws.includes("Landlord-Tenant Law")) warn.push("/laws content check failed");
const stateSample = await (await get(`${BASE}/laws/texas`)).text();
if (!stateSample.includes("FAQPage")) warn.push("/laws/texas missing FAQ schema");
if (!stateSample.includes("Last verified")) warn.push("/laws/texas missing provenance");
const press = await get(`${BASE}/press`);
if (press.status !== 200) warn.push(`/press → ${press.status}`);
const csv = await get(`${BASE}/reports/security-deposit-interest-2026/csv`);
if (csv.status !== 200) warn.push(`report CSV → ${csv.status}`);

// 4. Report
console.log("\n== RESULT ==");
if (!fail.length && !warn.length) console.log("ALL CHECKS PASS ✅");
for (const f of fail) console.log(`FAIL: ${f}`);
for (const w of warn) console.log(`WARN: ${w}`);
process.exit(fail.length ? 1 : 0);
