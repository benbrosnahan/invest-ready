"use client";

import { useState } from "react";
import { SAVINGS_ACCOUNTS } from "@/lib/data";
import { ExternalIcon } from "@/components/shared/ui";
import { cn } from "@/lib/utils";

interface Props {
  accountType: "roth_ira" | "brokerage" | "hysa";
  openLinks: { label: string; url: string }[];
}

const SAVINGS_LINKS = SAVINGS_ACCOUNTS.map((a) => ({ label: `Open at ${a.name.split(" ")[0]}`, url: a.url }));

const WHAT_YOU_NEED = [
  "Social Security number",
  "Date of birth and home address",
  "A bank account to move money from",
  "A photo ID, sometimes",
];

/** The yes path does not end at a blank page: what you need and where to open the account. */
export default function AccountOpenGuide({ accountType, openLinks }: Props) {
  const [open, setOpen] = useState(false);
  const links = accountType === "hysa" ? SAVINGS_LINKS : openLinks;
  const provider =
    accountType === "hysa"
      ? "Compare the rates above, and check the account is FDIC insured."
      : "Any of these four works for a first account. Compare their fees before you pick. Vanguard charges $25 a year unless you choose e-delivery.";

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="open-guide"
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[64px] w-full items-center justify-between gap-3 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy sm:px-7"
        >
          <span>
            <span className="block font-display text-xl font-bold text-slate-900">How to open your account</span>
            <span className="mt-0.5 block text-sm text-slate-700">About 10 minutes, online.</span>
          </span>
          <svg
            aria-hidden
            className={cn("h-5 w-5 flex-shrink-0 text-slate-700 transition-transform", open && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h2>

      <div id="open-guide" hidden={!open} className="border-t border-line px-5 pb-6 sm:px-7">
        <ol className="mt-5 space-y-5">
          <li>
            <p className="text-base font-semibold text-slate-900">1. Pick a provider</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{provider}</p>
          </li>
          <li>
            <p className="text-base font-semibold text-slate-900">2. Have these ready</p>
            <ul className="mt-1.5 space-y-1">
              {WHAT_YOU_NEED.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <svg aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-navy" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Under 18, or no Social Security number? Ask the provider first. You may need a custodial account or an
              ITIN.
            </p>
          </li>
          <li>
            <p className="text-base font-semibold text-slate-900">3. Open it</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-between gap-2 rounded-full bg-navy px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-navy-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
                >
                  {link.label}
                  <ExternalIcon />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
