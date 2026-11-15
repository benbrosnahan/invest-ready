"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import type { Fund } from "@/types";

const ROLE_LABEL: Record<Fund["role"], string> = {
  core: "Core",
  world: "Adds the world",
  bonds: "Adds steadiness",
};

/** One fund. "What is it?" opens a plain description in place, so it works the same with touch, mouse or keys. */
export default function FundCard({ fund }: { fund: Fund }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <li className="py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-display text-lg font-bold text-slate-900">{fund.ticker}</span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                fund.role === "core" && "bg-brand-light text-slate-900",
                fund.role === "world" && "bg-slate-50 text-slate-900 ring-1 ring-line",
                fund.role === "bonds" && "bg-accent-light text-[#8A4213]"
              )}
            >
              {ROLE_LABEL[fund.role]}
            </span>
          </p>
          <p className="mt-0.5 text-sm leading-snug text-slate-700">{fund.name}</p>
        </div>
        <p className="text-right">
          <span className="tnum block text-base font-semibold text-slate-900">{fund.fee}</span>
          <span className="block text-xs text-slate-600">fee a year</span>
        </p>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="-ml-2 mt-1 inline-flex min-h-[40px] items-center gap-1 rounded-full px-2 text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
      >
        What is {fund.ticker}?
      </button>
      <p id={panelId} hidden={!open} className="mt-1 text-sm leading-relaxed text-slate-700">
        {fund.description}
      </p>
    </li>
  );
}
