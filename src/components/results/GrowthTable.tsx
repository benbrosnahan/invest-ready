"use client";

import { useState } from "react";
import { futureValue, GROWTH_YEARS, formatCompact, formatFull } from "@/lib/compound";

export default function GrowthTable() {
  const [monthly, setMonthly] = useState(200);
  const [raw, setRaw] = useState("200");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^\d]/g, "");
    setRaw(digits);
    const n = Number(digits) || 0;
    setMonthly(n);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="font-bold text-slate-900 text-base mb-1">How your money grows</h3>
      <p className="text-xs text-slate-500 mb-4">
        Assumes 7% average annual return (S&P 500 historical average). Illustrative only.
      </p>

      <div className="flex items-center gap-3 mb-5">
        <label className="text-sm text-slate-600 whitespace-nowrap">Monthly investment:</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={raw}
            onChange={handleChange}
            className="pl-6 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm w-24 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-4 py-2.5 font-semibold text-slate-600 text-xs">Years</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-600 text-xs">You invested</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-600 text-xs">Portfolio value</th>
            </tr>
          </thead>
          <tbody>
            {GROWTH_YEARS.map((yr, i) => {
              const fv = futureValue(monthly, yr);
              const contributed = monthly * yr * 12;
              return (
                <tr
                  key={yr}
                  className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{yr} yrs</td>
                  <td className="px-4 py-3 text-slate-500">{formatCompact(contributed)}</td>
                  <td className="px-4 py-3 text-right font-bold text-brand">
                    {formatFull(fv)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-slate-400 mt-3">
        Past returns do not guarantee future results.
      </p>
    </div>
  );
}
