import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardBody } from "@/components/ui/Card";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { publishedGuides, getGuide } from "@/content/guides";
import { getTool } from "@/lib/tools";

const BASE = "/guides";

export function generateStaticParams() {
  return publishedGuides().map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `${BASE}/${slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide || !guide.published || !guide.sections) notFound();

  const related = guide.relatedTools
    .map((s) => getTool(s))
    .filter((t) => t && t.status === "live");

  return (
    <Container className="py-8">
      <JsonLd
        data={breadcrumbLd([
          { name: "Guides", path: BASE },
          { name: guide.title, path: `${BASE}/${slug}` },
        ])}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Guides", path: BASE },
          { name: guide.title, path: `${BASE}/${slug}` },
        ]}
      />

      <article className="mt-4">
        <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink">
          {guide.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink/70">
          {guide.description}
        </p>

        <Prose className="mt-8">
          {guide.sections.map((s) => (
            <div key={s.h2}>
              <h2>{s.h2}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ))}
        </Prose>

        {related.length > 0 && (
          <div className="mt-10 max-w-2xl">
            <h2 className="mb-3 font-display text-xl font-semibold">
              Try the tool
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((t) => (
                <Link key={t!.slug} href={`/tools/${t!.slug}`} className="group">
                  <Card className="transition-shadow group-hover:shadow-md">
                    <CardBody>
                      <p className="font-medium text-brand-700">{t!.name}</p>
                      <p className="mt-1 text-sm text-ink/60">{t!.blurb}</p>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 max-w-2xl">
          <LegalDisclaimer />
        </div>
      </article>
    </Container>
  );
}
