"use client";

import { Fund } from "@/types";
import InfoTooltip from "./InfoTooltip";

interface Props {
  fund: Fund;
  highlight?: boolean;
}

const ROLE_LABEL: Record<Fund["role"], string> = {
  primary: "Core holding",
  supporting: "Add for global coverage",
  bond: "Add for stability",
};

const ROLE_COLOR: Record<Fund["role"], string> = {
  primary: "bg-brand/10 text-brand",
  supporting: "bg-blue-50 text-blue-700",
  bond: "bg-amber-50 text-amber-700",
};

export default function FundCard({ fund }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-slate-900 text-sm">{fund.ticker}</span>
          <InfoTooltip
            content={fund.description}
            fee={fund.fee}
            provider={fund.provider}
          />
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLOR[fund.role]}`}
          >
            {ROLE_LABEL[fund.role]}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{fund.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">Fee: {fund.fee}</p>
      </div>
    </div>
  );
}
