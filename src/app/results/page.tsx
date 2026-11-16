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
import { decodeHash, encodeAnswers, sameAnswers } from "@/lib/share";
import ShareResult from "@/components/results/ShareResult";
import { FEES_CHECKED } from "@/lib/data";
import { ANSWERS_KEY, storage } from "@/lib/utils";
import type { Answers, GateResult, PlanResult, QuizResult } from "@/types";

// What the page answers from: the link's fragment first (a shared or reloaded result), then this tab's stored answers.
// Both are read after hydration: undefined on the server and in the first client render. The fragment can change
// while the page is open (an edited link, back and forward), so the page listens for that.
const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const SEP = "\u0000";
const snapshot = () => `${window.location.hash}${SEP}${storage.get(ANSWERS_KEY) ?? ""}`;

type View =
  | { kind: "loading" }
  | { kind: "none" }
  | { kind: "invalid" }
  | { kind: "result"; answers: Answers; result: QuizResult; shared: boolean; fromStorage: boolean };

function readView(snap: string | undefined): View {
  if (snap === undefined) return { kind: "loading" };
  const [hash, stored] = snap.split(SEP);
  let mine: Answers = {};
  try {
    mine = cleanAnswers(JSON.parse(stored || "null"));
  } catch {}

  const decoded = decodeHash(hash);
  if (decoded.status === "invalid") return { kind: "invalid" };
  if (decoded.status === "ok") {
    // A link opened in the tab that answered it is this student's own result; anywhere else it was shared.
    const shared = !getResult(mine) || !sameAnswers(mine, decoded.answers);
    return { kind: "result", answers: decoded.answers, result: decoded.result, shared, fromStorage: false };
  }
  const result = getResult(mine);
  return result ? { kind: "result", answers: mine, result, shared: false, fromStorage: true } : { kind: "none" };
}

export default function ResultsPage() {
  const router = useRouter();
  const snap = useSyncExternalStore(subscribe, snapshot, () => undefined);
  const view = useMemo(() => readView(snap), [snap]);
  const fragment = view.kind === "result" ? encodeAnswers(view.answers) : "";
  const shareUrl = typeof window === "undefined" || !fragment ? "" : `${window.location.origin}/results#${fragment}`;

  useEffect(() => {
    if (view.kind === "none") router.replace("/");
    // A result reached without a fragment gets one, so the address bar is the share link too.
    if (view.kind === "result" && view.fromStorage) window.history.replaceState(null, "", `#${fragment}`);
  }, [view, fragment, router]);

  if (view.kind === "loading" || view.kind === "none") return <Nav />;
  if (view.kind === "invalid") return <InvalidLink onStart={() => router.push("/")} />;
  const { answers, result, shared } = view;

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl space-y-5 px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        {shared && (
          <Notice title="Someone shared this answer with you">
            It comes from their answers, not yours. Take the five questions to get your own.
          </Notice>
        )}
        <Card className="rise grid gap-6 md:grid-cols-[minmax(0,1fr)_16.5rem] md:gap-8">
          <div>
            <Label>{shared ? "Their answer" : "Your answer"}</Label>
            <h1 className="mt-1 text-balance font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-slate-900 sm:text-[2.5rem]">
              {result.headline}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              {shared ? result.message.replace("Based on your answers", "Based on their answers") : result.message}
            </p>
          </div>
          <Ladder answers={answers} result={result} />
        </Card>

        {result.type === "gate" ? <GateNext result={result} /> : <PlanNext result={result} risk={answers.risk} />}

        {shareUrl && <ShareResult url={shareUrl} />}

        <div className="pt-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className={`${shared ? buttonClass.primary : buttonClass.secondary} w-full`}
          >
            {shared ? "Take the quiz yourself" : "Start over"}
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** A link that was cut short or changed. It gets no verdict, and says how to get one. */
function InvalidLink({ onStart }: { onStart: () => void }) {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <Card className="rise">
          <h1 className="text-balance font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-slate-900">
            This link does not hold a full answer
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-700">
            Part of it is missing or was changed, so it cannot show a result. Ask for the link again, or take the five
            questions to get your own answer.
          </p>
          <button type="button" onClick={onStart} className={`${buttonClass.primary} mt-6 w-full sm:w-auto`}>
            Take the quiz
          </button>
        </Card>
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
