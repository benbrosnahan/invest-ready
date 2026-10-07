"use client";

import { useState } from "react";

interface Props {
  accountType: "roth_ira" | "brokerage" | "hysa";
  openLinks: { label: string; url: string }[];
}

const HYSA_LINKS = [
  { label: "Open at Wealthfront", url: "https://www.wealthfront.com" },
  { label: "Open at Marcus", url: "https://www.marcus.com/us/en" },
  { label: "Open at SoFi", url: "https://www.sofi.com/banking/high-yield-savings-account" },
];

const WHAT_YOU_NEED = [
  "Social Security Number",
  "Date of birth",
  "Home address",
  "Bank account and routing number",
  "State ID or driver's license (sometimes required)",
];

const ROTH_NOTE =
  "To contribute to a Roth IRA, you need earned income in the year you contribute. The 2026 annual limit is $7,500.";

export default function AccountOpenGuide({ accountType, openLinks }: Props) {
  const [open, setOpen] = useState(false);
  const links = accountType === "hysa" ? HYSA_LINKS : openLinks;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <div>
          <p className="font-bold text-slate-900 text-sm">How to open your account</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Takes about 10 minutes. Free with no minimums.
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                1. Choose a provider
              </p>
              <p className="text-sm text-slate-600">
                {accountType === "hysa"
                  ? "Wealthfront, Marcus, and SoFi all offer online high-yield savings accounts. Compare current rates before choosing."
                  : "Fidelity, Vanguard, Robinhood, and Schwab are all free with no minimums for most accounts."}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                2. What you will need
              </p>
              <ul className="space-y-1">
                {WHAT_YOU_NEED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-brand mt-0.5 shrink-0">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {accountType === "roth_ira" && (
              <div className="bg-amber-50 rounded-xl px-3 py-2.5">
                <p className="text-xs text-amber-800">{ROTH_NOTE}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                3. Open your account
              </p>
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors"
                  >
                    {link.label}
                    <svg
                      className="w-3.5 h-3.5 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
