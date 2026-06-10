import { Callout } from "./ui/Callout";

/**
 * The "not legal advice" disclaimer. Shown on every state-aware tool and page.
 * Keeping it in one component means a single edit updates the whole site.
 */
export function LegalDisclaimer({ className }: { className?: string }) {
  return (
    <Callout tone="neutral" className={className}>
      <p>
        <strong>Not legal advice.</strong> LandlordKit provides general
        informational tools, not legal advice. Landlord-tenant laws change and
        vary by city and county. Verify the cited statute and consult a licensed
        attorney before acting on any result.
      </p>
    </Callout>
  );
}
