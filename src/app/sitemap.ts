import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { TOOLS } from "@/lib/tools";
import { US_STATES, getStateByCode } from "@/lib/states";
import { rentIncreaseStateCodes } from "@/tools/rent-increase-notice/data";
import { lateFeeStateCodes } from "@/tools/late-fee/data";
import { depositReturnStateCodes } from "@/tools/security-deposit-return/data";
import { publishedGuides } from "@/content/guides";

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
    entry("/disclaimer", 0.2, "yearly"),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];

  for (const t of TOOLS) {
    if (t.status === "live") urls.push(entry(`/tools/${t.slug}`, 0.9, "weekly"));
  }

  // State pages per state-aware tool.
  const allStateCodes = US_STATES.map((s) => s.code);
  const stateAware: Record<string, string[]> = {
    // Deposit interest now has a substantive page for every state.
    "security-deposit-interest-calculator": allStateCodes,
    "rent-increase-notice-generator": rentIncreaseStateCodes(),
    "late-fee-calculator": lateFeeStateCodes(),
    "security-deposit-return-tracker": depositReturnStateCodes(),
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

  return urls;
}
