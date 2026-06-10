import { cn } from "./cn";

/** Readable long-form text styling for legal pages and guides. */
export function Prose({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "max-w-2xl text-ink/80 leading-relaxed",
        "[&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-3",
        "[&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-6 [&_h3]:mb-2",
        "[&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5",
        "[&_a]:text-brand-700 [&_a]:underline",
        className,
      )}
      {...props}
    />
  );
}
