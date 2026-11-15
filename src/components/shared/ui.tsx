// Shared primitives, matching Loan Desk's. Type floor 13px, body 16px, inputs 16px (iOS zooms on anything smaller),
// tap targets at least 40px, primary buttons 48px, pill buttons, 24px card radius.

import { cn } from "@/lib/utils";

export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7", className)} {...rest}>
      {children}
    </section>
  );
}

/** A quiet label above a section. Sentence case, not tracked capitals. */
export function Label({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <p id={id} className={cn("text-sm font-semibold text-slate-600", className)}>
      {children}
    </p>
  );
}

export const buttonClass = {
  primary:
    "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-navy-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2",
  secondary:
    "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-900 transition-colors hover:border-navy hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2",
  ghost:
    "inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2",
};

/** A rule the student needs before acting. An icon and a title, so colour is never the only cue. */
export function Notice({
  title,
  children,
  tone = "info",
  className,
}: {
  title?: string;
  children: React.ReactNode;
  tone?: "info" | "warn";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        tone === "info" ? "border-brand-border bg-brand-light" : "border-accent/40 bg-accent-light",
        className
      )}
    >
      <div className="flex gap-3">
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
            tone === "info" ? "bg-navy" : "bg-accent-hover"
          )}
        >
          {tone === "info" ? "i" : "!"}
        </span>
        <div className="min-w-0 flex-1 text-sm leading-relaxed text-slate-900">
          {title && <p className="font-bold">{title}</p>}
          <div className={cn(title && "mt-1")}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ExternalIcon() {
  return (
    <svg aria-hidden className="h-4 w-4 flex-shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}
