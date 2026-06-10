export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group p-5">
          <summary className="cursor-pointer list-none font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-4">
              {f.q}
              <span className="text-brand-600 transition-transform group-open:rotate-45">
                +
              </span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
