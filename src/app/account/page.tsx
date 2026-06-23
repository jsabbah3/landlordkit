import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { GoProButton } from "@/components/pro/GoProButton";
import { SignInForm } from "@/components/account/SignInForm";
import { ManageBillingButton } from "@/components/account/ManageBillingButton";
import { getProStatus } from "@/lib/pro";
import { isStripeConfigured, proEnabledClient } from "@/lib/env";
import { longDate } from "@/lib/format";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const accountsLive = proEnabledClient();
  const status = await getProStatus();

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Your account
      </h1>

      <div className="mt-6 max-w-md">
        {!accountsLive ? (
          <Card>
            <CardBody>
              <p className="text-ink/70">
                Accounts and LandlordKit Pro are coming online at launch. All the
                core tools are free to use right now — no account needed.
              </p>
            </CardBody>
          </Card>
        ) : !status.signedIn ? (
          <Card>
            <CardBody>
              <h2 className="font-display text-lg font-semibold">Sign in</h2>
              <p className="mt-1 mb-4 text-sm text-ink/60">
                We&apos;ll email you a secure sign-in link — no password.
              </p>
              <SignInForm />
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink/55">Signed in as</p>
                  <p className="font-medium">{status.email}</p>
                </div>
                {status.isPro ? (
                  <Badge className="bg-brand-100 text-brand-800">Pro</Badge>
                ) : (
                  <Badge className="bg-paper-2 text-ink/60">Free</Badge>
                )}
              </div>

              {status.isPro ? (
                <>
                  <p className="text-sm text-ink/70">
                    Your Pro subscription is active
                    {status.currentPeriodEnd
                      ? ` through ${longDate(status.currentPeriodEnd.slice(0, 10))}`
                      : ""}
                    .
                  </p>
                  <ManageBillingButton />
                </>
              ) : (
                <>
                  <p className="text-sm text-ink/70">
                    Upgrade to Pro (${SITE.proMonthly}/mo) to save your details,
                    batch-generate documents, and remove the PDF footer.
                  </p>
                  {isStripeConfigured() ? (
                    <div className="flex flex-wrap gap-2">
                      <GoProButton plan="monthly">
                        Go Pro — ${SITE.proMonthly}/mo
                      </GoProButton>
                      <GoProButton plan="annual">
                        Annual — ${SITE.proAnnual}/yr
                      </GoProButton>
                    </div>
                  ) : (
                    <p className="text-sm text-ink/45">
                      Billing isn&apos;t enabled yet.
                    </p>
                  )}
                </>
              )}

              <form action="/auth/signout" method="post">
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </CardBody>
          </Card>
        )}
      </div>

      {status.isPro ? (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Your Pro tools
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            Time-savers included with your subscription. Every free tool also
            generates watermark-free PDFs while you&apos;re signed in.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {PRO_TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-xl border border-line bg-white p-5 transition-colors hover:border-brand-300 hover:bg-paper-2"
              >
                <h3 className="font-display font-semibold text-ink">{t.name}</h3>
                <p className="mt-1 text-sm text-ink/65">{t.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}

const PRO_TOOLS = [
  {
    name: "Batch rent receipts",
    blurb:
      "Generate a receipt for every unit in one watermark-free PDF — perfect for the 1st of the month.",
    href: "/tools/rent-receipt-generator/batch",
  },
  {
    name: "Lease autofill",
    blurb:
      "Upload a lease PDF and pull the landlord, tenant, property, rent, and deposit into your saved details.",
    href: "/tools/lease-autofill",
  },
  {
    name: "Compliance calendar",
    blurb:
      "Build your filing-deadline calendar — cloud-synced across your devices and exportable to your calendar app.",
    href: "/tools/compliance-calendar",
  },
];
