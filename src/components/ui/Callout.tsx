import { cn } from "./cn";

type Tone = "info" | "warning" | "neutral";

const tones: Record<Tone, string> = {
  info: "border-brand-200 bg-brand-50 text-brand-900",
  warning: "border-accent-400 bg-accent-400/10 text-ink",
  neutral: "border-line bg-paper-2 text-ink/80",
};

export function Callout({
  tone = "info",
  title,
  className,
  children,
}: {
  tone?: Tone;
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-lg border p-4 text-sm", tones[tone], className)}>
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      {children}
    </div>
  );
}

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
