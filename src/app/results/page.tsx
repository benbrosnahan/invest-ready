"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "@/components/shared/Nav";
import FundCard from "@/components/results/FundCard";
import GrowthTable from "@/components/results/GrowthTable";
import AccountOpenGuide from "@/components/results/AccountOpenGuide";
import { storage } from "@/lib/utils";
import type { QuizResult, GateResult, PlanResult } from "@/types";

const GATE_CONFIG = {
  no_income: {
    icon: "⏳",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    badgeText: "Build income first",
  },
  no_emergency: {
    icon: "🪣",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-800",
    badgeText: "Build your cushion first",
  },
  high_debt: {
    icon: "🏹",
    color: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-800",
    badgeText: "Clear high-interest debt first",
  },
};

const ACCOUNT_LABEL: Record<PlanResult["accountType"], string> = {
  roth_ira: "Roth IRA",
  brokerage: "Taxable Brokerage",
  hysa: "High-Yield Savings Account",
};

const HYSA_DISCLAIMER =
  "Rates as of June 2026. Rates change frequently, verify before opening.";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const stored = storage.get("invest-ready-result");
    if (!stored) {
      router.replace("/");
      return;
    }
    try {
      setResult(JSON.parse(stored));
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!result) return null;

  if (result.type === "gate") {
    return <GateScreen result={result} />;
  }

  return <PlanScreen result={result} />;
}

function GateScreen({ result }: { result: GateResult }) {
  const router = useRouter();
  const config = GATE_CONFIG[result.gate];

  return (
    <>
      <Nav />
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className={`rounded-2xl border-2 p-6 mb-6 ${config.color}`}>
              <div className="flex items-start gap-4">
                <span className="text-3xl">{config.icon}</span>
                <div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${config.badge} inline-block mb-2`}>
                    {config.badgeText}
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{result.headline}</h1>
                  <p className="text-sm text-slate-700 leading-relaxed">{result.message}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-2">
                {result.actionTitle}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{result.actionMessage}</p>

              {result.gate !== "high_debt" && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Top high-yield savings accounts (June 2026)
                  </p>
                  {[
                    { name: "Wealthfront Cash", apy: "3.30%", note: "No minimum, no fees", url: "https://www.wealthfront.com" },
                    { name: "Marcus by Goldman Sachs", apy: "3.40%", note: "No minimum, no fees", url: "https://www.marcus.com/us/en" },
                    { name: "SoFi Savings", apy: "3.10%", note: "Higher with direct deposit", url: "https://www.sofi.com/banking/high-yield-savings-account" },
                  ].map((acct) => (
                    <a key={acct.name} href={acct.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5 hover:bg-slate-100 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{acct.name}</p>
                        <p className="text-xs text-slate-500">{acct.note}</p>
                      </div>
                      <span className="text-brand font-bold text-sm">{acct.apy}</span>
                    </a>
                  ))}
                  <p className="text-[10px] text-slate-400 mt-1">{HYSA_DISCLAIMER}</p>
                </div>
              )}
            </div>

            {result.gate !== "high_debt" && (
              <div className="mb-6">
                <AccountOpenGuide accountType="hysa" openLinks={[]} />
              </div>
            )}

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-hover transition-colors"
            >
              Start over
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}

function PlanScreen({ result }: { result: PlanResult }) {
  const router = useRouter();
  const isHYSA = result.accountType === "hysa";

  return (
    <>
      <Nav />
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-xl space-y-5">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-2xl p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-200 block mb-2">
                Your result
              </span>
              <h1 className="text-2xl font-bold mb-1">
                {isHYSA ? "Save first, then invest." : "You're ready to start investing."}
              </h1>
              <p className="text-teal-100 text-sm leading-relaxed">
                {isHYSA
                  ? "Your goal is within a few years. A high-yield savings account is the right move before putting money in the market."
                  : "You've got income, a cushion, and no high-interest debt holding you back."}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-1">
                Recommended account
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {ACCOUNT_LABEL[result.accountType]}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{result.accountReason}</p>
            </div>
          </motion.div>

          {!isHYSA && result.funds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.14 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-1">
                  Fund options
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  These are well-known index funds that could fit your profile. Pick one or mix them. Press the{" "}
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 align-middle">i</span>{" "}
                  to learn what each one is.
                </p>
                <div className="space-y-2.5">
                  {result.funds.map((fund) => (
                    <FundCard key={fund.ticker} fund={fund} />
                  ))}
                </div>
                {result.allocationLabel && (
                  <div className="mt-4 bg-brand/5 rounded-xl px-4 py-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-semibold text-brand">Potential mix: </span>
                      {result.allocationLabel}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {isHYSA && result.hysa && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.14 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">
                  Top accounts to consider
                </p>
                <div className="space-y-2">
                  {result.hysa.map((acct) => (
                    <a key={acct.name} href={acct.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5 hover:bg-slate-100 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{acct.name}</p>
                        <p className="text-xs text-slate-500">{acct.note}</p>
                      </div>
                      <span className="text-brand font-bold text-sm">{acct.apy}</span>
                    </a>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-3">{HYSA_DISCLAIMER}</p>
              </div>
            </motion.div>
          )}

          {!isHYSA && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.20 }}
            >
              <GrowthTable />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: isHYSA ? 0.20 : 0.26 }}
          >
            <AccountOpenGuide
              accountType={result.accountType}
              openLinks={result.openLinks}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Start over
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-4 leading-relaxed">
              This tool is for educational purposes only. It is not financial advice.
              Consider consulting a licensed financial advisor before investing.
            </p>
          </motion.div>

        </div>
      </div>
    </>
  );
}
