// The Cense header, as in Loan Desk and Decode: the brand in orange, the tool's name in green, and the privacy
// promise as a pill, worded as Loan Desk words it. The answers stay in this tab's sessionStorage; nothing is sent.
export default function Nav() {
  return (
    <header className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 pt-5 sm:px-6 sm:pt-7">
      <p className="flex items-baseline gap-1.5 whitespace-nowrap font-display text-lg font-bold sm:text-xl">
        <a
          href="https://cense.beehiiv.com"
          className="rounded-md text-accent-hover hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        >
          Cense
        </a>
        <span className="text-slate-900">Invest Ready</span>
      </p>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-light px-3 py-1.5 text-xs font-semibold text-slate-900">
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="7" width="10" height="7" rx="1.5" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
        On your device
      </span>
    </header>
  );
}
