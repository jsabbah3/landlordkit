import { cn } from "./cn";

export function Section({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-8", className)}>
      {title ? (
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink mb-5">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
