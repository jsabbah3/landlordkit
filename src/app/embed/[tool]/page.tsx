import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LateFeeTool } from "@/components/tools/LateFeeTool";
import { DepositInterestTool } from "@/components/tools/DepositInterestTool";
import { ProratedRentTool } from "@/components/tools/ProratedRentTool";

/**
 * Chrome-free embeddable calculators (iframe targets). The attribution link
 * back to the full tool is the point of the program — sites that embed us
 * link to us. noindex: the canonical content lives on the tool pages.
 */
const EMBEDS: Record<string, { name: string; component: React.ComponentType; canonical: string }> = {
  "late-fee-calculator": { name: "Rent Late Fee Calculator", component: LateFeeTool, canonical: "/tools/late-fee-calculator" },
  "security-deposit-interest-calculator": { name: "Security Deposit Interest Calculator", component: DepositInterestTool, canonical: "/tools/security-deposit-interest-calculator" },
  "prorated-rent-calculator": { name: "Prorated Rent Calculator", component: ProratedRentTool, canonical: "/tools/prorated-rent-calculator" },
};

export function generateStaticParams() {
  return Object.keys(EMBEDS).map((tool) => ({ tool }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool } = await params;
  const e = EMBEDS[tool];
  if (!e) return {};
  return {
    title: `${e.name} (embed)`,
    robots: { index: false, follow: false },
    alternates: { canonical: e.canonical },
  };
}

export default async function EmbedPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const e = EMBEDS[tool];
  if (!e) notFound();
  const Tool = e.component;

  return (
    <div className="p-3">
      {/* Hide the site chrome inside the iframe. */}
      <style>{`header, footer { display: none !important; }`}</style>
      <Tool />
      <p className="mt-3 text-center text-xs text-ink/55">
        <a
          href={`https://getlandlordkit.com${e.canonical}?utm_source=embed&utm_medium=widget&utm_campaign=${tool}`}
          target="_blank"
          rel="noopener"
          className="underline hover:text-brand-700"
        >
          {e.name} by LandlordKit — free, statute-cited landlord tools
        </a>
      </p>
    </div>
  );
}
