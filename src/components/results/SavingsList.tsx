import { SAVINGS_ACCOUNTS, SAVINGS_CHECKED } from "@/lib/data";
import { ExternalIcon, Label } from "@/components/shared/ui";

/** Three savings accounts to compare, with the date the rates were read. Not a ranking. */
export default function SavingsList() {
  return (
    <div className="mt-6">
      <Label id="savings-heading">Savings accounts to compare</Label>
      <ul aria-labelledby="savings-heading" className="mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line">
        {SAVINGS_ACCOUNTS.map((acct) => (
          <li key={acct.name}>
            <a
              href={acct.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[56px] items-center gap-3 bg-white px-4 py-3 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-slate-900">{acct.name}</span>
                <span className="mt-0.5 block text-sm leading-snug text-slate-700">{acct.note}</span>
              </span>
              <span className="text-right">
                <span className="tnum block font-display text-lg font-bold text-slate-900">{acct.apy}</span>
                <span className="block text-xs text-slate-600">APY</span>
              </span>
              <ExternalIcon />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-600">
        Rates read from each bank&apos;s site on {SAVINGS_CHECKED}. They change often, so check before you open.
      </p>
    </div>
  );
}
