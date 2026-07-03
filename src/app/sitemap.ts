import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { TOOLS } from "@/lib/tools";
import { US_STATES, getStateByCode } from "@/lib/states";
import { rentIncreaseStateCodes, RENT_INCREASE } from "@/tools/rent-increase-notice/data";
import { lateFeeStateCodes, LATE_FEE } from "@/tools/late-fee/data";
import { depositReturnStateCodes, DEPOSIT_RETURN } from "@/tools/security-deposit-return/data";
import { publishedGuides } from "@/content/guides";
import { hubStates } from "@/lib/lawHub";

/**
 * XML sitemap. Includes static pages, every live tool, each tool's programmatic
 * state pages, and published guides. As new state-aware tools go live, add
 * their state-code source here so their pages are indexed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({ url: absoluteUrl(path), lastModified: now, changeFrequency, priority });

  const urls: MetadataRoute.Sitemap = [
    entry("/", 1, "weekly"),
    entry("/tools", 0.9, "weekly"),
    entry("/guides", 0.7),
    entry("/pricing", 0.6),
    entry("/about", 0.5, "yearly"),
    entry("/disclaimer", 0.2, "yearly"),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];

  for (const t of TOOLS) {
    if (t.status === "live") urls.push(entry(`/tools/${t.slug}`, 0.9, "weekly"));
  }

  // State pages per state-aware tool. Low-confidence states are EXCLUDED
  // (and noindexed on-page): only statute-verified values get indexed —
  // fewer, stronger pages (audit A2). They re-enter automatically once
  // research upgrades their confidence.
  const allStateCodes = US_STATES.map((s) => s.code);
  const notLow = (codes: string[], data: Record<string, { cite: { confidence: string } }>) =>
    codes.filter((c) => data[c]?.cite.confidence !== "low");
  const stateAware: Record<string, string[]> = {
    // Deposit interest has a substantive, verified page for every state.
    "security-deposit-interest-calculator": allStateCodes,
    "rent-increase-notice-generator": notLow(rentIncreaseStateCodes(), RENT_INCREASE),
    "late-fee-calculator": notLow(lateFeeStateCodes(), LATE_FEE),
    "security-deposit-return-tracker": notLow(depositReturnStateCodes(), DEPOSIT_RETURN),
  };
  for (const [slug, codes] of Object.entries(stateAware)) {
    for (const code of codes) {
      const state = getStateByCode(code);
      if (state) urls.push(entry(`/tools/${slug}/${state.slug}`, 0.8));
    }
  }

  for (const g of publishedGuides()) {
    urls.push(entry(`/guides/${g.slug}`, 0.6));
  }

  // State law hubs (only states with enough verified fields publish).
  urls.push(entry("/laws", 0.8, "weekly"));
  for (const s of hubStates()) {
    urls.push(entry(`/laws/${s.slug}`, 0.8));
  }

  // Linkable assets (reports, press, embed program).
  urls.push(entry("/reports", 0.7, "weekly"));
  urls.push(entry("/reports/security-deposit-interest-2026", 0.8));
  urls.push(entry("/reports/landlord-regulation-index-2026", 0.8));
  urls.push(entry("/press", 0.5));
  urls.push(entry("/embed", 0.5));

  return urls;
}
