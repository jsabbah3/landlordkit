import Link from "next/link";

/** Visible breadcrumb trail. Pair with breadcrumbLd() for the JSON-LD version. */
export function Breadcrumbs({
  crumbs,
}: {
  crumbs: { name: string; path: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink/55">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1.5">
              {last ? (
                <span className="text-ink/70">{c.name}</span>
              ) : (
                <Link href={c.path} className="hover:text-brand-700">
                  {c.name}
                </Link>
              )}
              {!last && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
