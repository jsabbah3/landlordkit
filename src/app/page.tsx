import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Callout";
import { TOOLS } from "@/lib/tools";
import { SITE } from "@/lib/site";
import { EmailCapture } from "@/components/EmailCapture";

export default function Home() {
  const live = TOOLS.filter((t) => t.status === "live");
  const planned = TOOLS.filter((t) => t.status === "planned");

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-gradient-to-b from-brand-50 to-paper">
        <Container className="py-16 sm:py-24">
          <div className="max-w-2xl">
            <Badge className="bg-brand-100 text-brand-800">
              Free tools · No signup
            </Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Accurate, state-aware tools for small landlords.
            </h1>
            <p className="mt-4 text-lg text-ink/70">
              Security deposit interest, rent increase notices, late fees and
              more — with each state&apos;s real rules, statute citations, and
              instant PDF documents. Built for the 10 million Americans who own
              1–10 units.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/tools" size="lg">
                Browse the tools
              </ButtonLink>
              <ButtonLink href="/guides" size="lg" variant="secondary">
                Read the guides
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Live tools */}
      <Container className="py-14">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Tools available now
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardBody>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-brand-100 text-brand-800">
                      {t.category}
                    </Badge>
                    {t.stateAware && (
                      <Badge className="bg-paper-2 text-ink/60">
                        50-state
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold text-ink group-hover:text-brand-700">
                    {t.name}
                  </h3>
                  <p className="mt-2 text-sm text-ink/65">{t.blurb}</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {/* Coming soon */}
        <h2 className="mt-14 font-display text-2xl font-semibold tracking-tight">
          Coming soon
        </h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {planned.map((t) => (
            <span
              key={t.slug}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink/55"
            >
              {t.name}
            </span>
          ))}
        </div>
      </Container>

      {/* Trust strip */}
      <section className="border-y border-line bg-paper-2">
        <Container className="grid gap-8 py-12 sm:grid-cols-3">
          {[
            ["Genuinely accurate", "Every state rule cites its statute and shows when it was last verified."],
            ["Private by default", "Calculations run in your browser. Free tools never require an account."],
            ["Real documents", "Download polished PDFs you can actually send to a tenant."],
          ].map(([title, body]) => (
            <div key={title}>
              <h3 className="font-display text-lg font-semibold text-ink">
                {title}
              </h3>
              <p className="mt-2 text-sm text-ink/65">{body}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Lead magnet */}
      <Container className="py-14">
        <div className="rounded-card border border-line bg-white p-6 sm:p-8">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Free: the Landlord Year-End Tax Prep Checklist
            </h2>
            <p className="mt-2 mb-5 text-ink/70">
              The income, deductions, depreciation items, and January deadlines
              small landlords actually miss — on one page, ready for your tax
              folder.
            </p>
            <EmailCapture source="homepage" />
          </div>
        </div>
      </Container>

      {/* Pro CTA */}
      <Container className="py-16">
        <Card className="bg-brand-700 text-white">
          <CardBody className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                LandlordKit Pro
              </h2>
              <p className="mt-1 max-w-md text-brand-100">
                Save your property details, batch-generate documents, remove the
                footer, and track your portfolio — ${SITE.proMonthly}/mo.
              </p>
            </div>
            <ButtonLink
              href="/pricing"
              variant="accent"
              size="lg"
              className="mt-4 sm:mt-0"
            >
              See Pro
            </ButtonLink>
          </CardBody>
        </Card>
      </Container>
    </>
  );
}
