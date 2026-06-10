import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "Landlord Guides",
  description:
    "Practical, plain-English guides for small landlords: security deposits, rent increases, late fees, cash flow, and more.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const published = GUIDES.filter((g) => g.published);
  const upcoming = GUIDES.filter((g) => !g.published);

  return (
    <Container className="py-8">
      <Breadcrumbs crumbs={[{ name: "Guides", path: "/guides" }]} />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Landlord guides
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          Clear answers to the questions small landlords actually search for —
          each one links to the tool that does the work for you.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {published.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardBody>
                <h2 className="font-display text-lg font-semibold text-ink group-hover:text-brand-700">
                  {g.title}
                </h2>
                <p className="mt-2 text-sm text-ink/65">{g.description}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {upcoming.length > 0 && (
        <>
          <h2 className="mt-12 mb-4 font-display text-xl font-semibold text-ink/80">
            Coming soon
          </h2>
          <ul className="space-y-2 text-ink/55">
            {upcoming.map((g) => (
              <li key={g.slug}>{g.title}</li>
            ))}
          </ul>
        </>
      )}
    </Container>
  );
}
