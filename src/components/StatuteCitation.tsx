import type { LegalProvenance } from "@/lib/legal";
import { longDate } from "@/lib/format";
import { Badge } from "./ui/Callout";
import { cn } from "./ui/cn";

const confidenceStyle = {
  high: "bg-brand-100 text-brand-800",
  medium: "bg-accent-400/20 text-ink",
  low: "bg-red-100 text-red-800",
} as const;

const confidenceLabel = {
  high: "Verified",
  medium: "Spot-check advised",
  low: "Low confidence — verify",
} as const;

/** Renders the legal provenance for a state rule: citation, source link,
 *  last-verified date, and a confidence badge. */
export function StatuteCitation({
  cite,
  className,
}: {
  cite: LegalProvenance;
  className?: string;
}) {
  return (
    <div className={cn("text-xs text-ink/60 leading-relaxed", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-ink/75">Source:</span>
        {cite.statuteUrl ? (
          <a
            href={cite.statuteUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-brand-700 underline underline-offset-2"
          >
            {cite.statute}
          </a>
        ) : (
          <span>{cite.statute}</span>
        )}
        <Badge className={confidenceStyle[cite.confidence]}>
          {confidenceLabel[cite.confidence]}
        </Badge>
      </div>
      <p className="mt-1">Last verified {longDate(cite.lastVerified)}.</p>
    </div>
  );
}
