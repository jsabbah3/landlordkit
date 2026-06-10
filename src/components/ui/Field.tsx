import { cn } from "./cn";

const inputBase =
  "w-full rounded-lg border border-line bg-white px-3.5 h-11 text-ink placeholder:text-ink/40 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-ink/80 mb-1.5", className)}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputBase, "pr-8", className)} {...props}>
      {children}
    </select>
  );
}

/** Label + control + optional hint/error, wrapped for consistent spacing. */
export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-ink/55">{hint}</p> : null}
    </div>
  );
}
