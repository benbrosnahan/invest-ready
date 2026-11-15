"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import { Card, Label, Notice, buttonClass } from "@/components/shared/ui";
import Ladder from "@/components/results/Ladder";
import SavingsList from "@/components/results/SavingsList";
import FundCard from "@/components/results/FundCard";
import GrowthTable from "@/components/results/GrowthTable";
import AccountOpenGuide from "@/components/results/AccountOpenGuide";
import { cleanAnswers, getResult } from "@/lib/logic";
import { FEES_CHECKED } from "@/lib/data";
import { ANSWERS_KEY, storage } from "@/lib/utils";
import type { Answers, GateResult, PlanResult } from "@/types";

// The stored answers are read after hydration: undefined on the server and in the first client render, then the
// tab's value (or null). Nothing in this tab changes them while the page is open, so there is nothing to subscribe to.
const noSubscribe = () => () => {};

export default function ResultsPage() {
  const router = useRouter();
  const raw = useSyncExternalStore(noSubscribe, () => storage.get(ANSWERS_KEY), () => undefined);

  const state = useMemo(() => {
    if (raw === undefined) return undefined;
    let answers: Answers = {};
    try {
      answers = cleanAnswers(JSON.parse(raw ?? "null"));
    } catch {}
    const result = getResult(answers);
    return result ? { answers, result } : null;
  }, [raw]);

  useEffect(() => {
    if (state === null) router.replace("/");
  }, [state, router]);

  if (!state) return <Nav />;
  const { answers, result } = state;

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl space-y-5 px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <Card className="rise grid gap-6 md:grid-cols-[minmax(0,1fr)_16.5rem] md:gap-8">
          <div>
            <Label>Your answer</Label>
            <h1 className="mt-1 text-balance font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-slate-900 sm:text-[2.5rem]">
              {result.headline}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-700">{result.message}</p>
          </div>
          <Ladder answers={answers} result={result} />
        </Card>

        {result.type === "gate" ? <GateNext result={result} /> : <PlanNext result={result} risk={answers.risk} />}

        <div className="pt-3">
          <button type="button" onClick={() => router.push("/")} className={`${buttonClass.secondary} w-full`}>
            Start over
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

function GateNext({ result }: { result: GateResult }) {
  const savings = result.gate !== "high_debt";
  return (
    <>
      <Card aria-labelledby="next-heading">
        <Label>Your next step</Label>
        <h2 id="next-heading" className="mt-1 font-display text-2xl font-bold leading-tight text-slate-900">
          {result.nextTitle}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-slate-900">{result.nextStep}</p>
        {result.aside && <p className="mt-3 text-sm leading-relaxed text-slate-700">{result.aside}</p>}
        {savings && <SavingsList />}
      </Card>
      {savings && <AccountOpenGuide accountType="hysa" openLinks={[]} />}
    </>
  );
}

function PlanNext({ result, risk }: { result: PlanResult; risk: Answers["risk"] }) {
  const hysa = result.accountType === "hysa";
  return (
    <>
      <Card aria-labelledby="next-heading" className="border-brand-border">
        <Label>Your next step</Label>
        <h2 id="next-heading" className="mt-1 font-display text-2xl font-bold leading-tight text-slate-900">
          Open {result.accountType === "roth_ira" ? "a Roth IRA" : hysa ? "a high-yield savings account" : "a brokerage account"}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-slate-900">{result.accountReason}</p>
        {result.rule && (
          <Notice className="mt-4" title={result.accountType === "roth_ira" ? "Only pay from work goes in" : undefined}>
            {result.rule}
          </Notice>
        )}
        {!hysa && (
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            Does a job offer a 401(k) match? Put in enough to get the full match first. It is free money.
          </p>
        )}
        {hysa && <SavingsList />}
      </Card>

      {!hysa && result.funds.length > 0 && (
        <Card aria-labelledby="funds-heading">
          <h2 id="funds-heading" className="font-display text-2xl font-bold leading-tight text-slate-900">
            Funds to choose from
          </h2>
          <p className="mt-1.5 text-base leading-relaxed text-slate-700">Low-cost index funds. Pick one, or mix them.</p>
          <ul className="mt-4 divide-y divide-line">
            {result.funds.map((fund) => (
              <FundCard key={fund.ticker} fund={fund} />
            ))}
          </ul>
          <p className="mt-4 rounded-2xl bg-brand-light px-4 py-3 text-base leading-relaxed text-slate-900">
            {result.mix}
          </p>
          <p className="mt-2 text-xs text-slate-600">Fees from each fund&apos;s fact sheet, {FEES_CHECKED}.</p>
        </Card>
      )}

      {!hysa && <GrowthTable bondHeavy={risk === "conservative"} />}

      <AccountOpenGuide accountType={result.accountType} openLinks={result.openLinks} />
    </>
  );
}
