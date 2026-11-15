"use client";

import { useState } from "react";
import { futureValue, GROWTH_YEARS, formatDollars, MAX_MONTHLY } from "@/lib/compound";
import { Card } from "@/components/shared/ui";

/**
 * What a steady monthly amount could grow to. Quiet on purpose: one assumption, said plainly, and an honest
 * caveat for bond-heavy mixes. Amounts are in roughly today's dollars because 7% is an after-inflation figure.
 */
export default function GrowthTable({ bondHeavy = false }: { bondHeavy?: boolean }) {
  const [raw, setRaw] = useState("200");
  const monthly = Math.min(Number(raw) || 0, MAX_MONTHLY);

  return (
    <Card aria-labelledby="growth-heading">
      <h2 id="growth-heading" className="font-display text-2xl font-bold leading-tight text-slate-900">
        How it could grow
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label htmlFor="monthly" className="text-base font-semibold text-slate-900">
          Each month
        </label>
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-700">
            $
          </span>
          <input
            id="monthly"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={5}
            value={raw}
            onChange={(e) => setRaw(e.target.value.replace(/[^\d]/g, "").slice(0, 5))}
            aria-describedby="growth-note"
            className="tnum min-h-[48px] w-32 rounded-full border border-slate-500 bg-white pl-8 pr-4 text-base text-slate-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>
      </div>

      <table className="mt-5 w-full text-left">
        <caption className="sr-only">Growth of {formatDollars(monthly)} a month at 7% a year</caption>
        <thead>
          <tr className="border-b border-line text-sm text-slate-600">
            <th scope="col" className="pb-2 font-semibold">After</th>
            <th scope="col" className="pb-2 text-right font-semibold">You put in</th>
            <th scope="col" className="pb-2 text-right font-semibold">Could be worth</th>
          </tr>
        </thead>
        <tbody>
          {GROWTH_YEARS.map((yr) => (
            <tr key={yr} className="border-b border-line last:border-0">
              <th scope="row" className="py-3 text-base font-semibold text-slate-900">
                {yr} years
              </th>
              <td className="tnum py-3 text-right text-base text-slate-700">{formatDollars(monthly * yr * 12)}</td>
              <td className="tnum py-3 text-right font-display text-lg font-bold text-slate-900">
                {formatDollars(futureValue(monthly, yr))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p id="growth-note" className="mt-4 text-sm leading-relaxed text-slate-700">
        At 7% a year, close to what the S&amp;P 500 has averaged after inflation since 1928, so these are roughly
        today&apos;s dollars. Before fees and taxes.{" "}
        {bondHeavy ? "A bond-heavy mix like yours has usually grown less than this. " : ""}
        Past returns do not promise future ones.
      </p>
    </Card>
  );
}
