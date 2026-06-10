/**
 * Shared types for state legal data. Every state-aware data file uses these so
 * provenance (statute citation, source URL, verification date, confidence) is
 * structured the same way and rendered by the same components.
 *
 * CONFIDENCE meaning:
 *   high   - value matches the primary statute text or an official state source.
 *   medium - value is from a reputable secondary source; spot-check the statute.
 *   low    - value is uncertain / the rule is nuanced; MUST verify before relying.
 */
export type Confidence = "high" | "medium" | "low";

export interface LegalProvenance {
  /** Human-readable citation, e.g. "Mass. Gen. Laws ch. 186, § 15B". */
  statute: string;
  /** Link to the statute or an official state page, if available. */
  statuteUrl?: string;
  /** ISO date (YYYY-MM-DD) the value was last checked against the source. */
  lastVerified: string;
  confidence: Confidence;
}
