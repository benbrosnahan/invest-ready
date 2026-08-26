"use client";

import SelectionCard from "@/components/shared/SelectionCard";
import { IncomeAnswer } from "@/types";

interface Props {
  value: IncomeAnswer | undefined;
  onChange: (v: IncomeAnswer) => void;
  onNext: (selected: IncomeAnswer) => void;
}

const OPTIONS: { value: IncomeAnswer; label: string; description: string }[] = [
  {
    value: "consistent",
    label: "Yes, it's consistent",
    description: "Job, stipend, scholarship, or regular allowance",
  },
  {
    value: "variable",
    label: "Yes, but it varies",
    description: "Gig work, freelance, part-time, or seasonal",
  },
  {
    value: "none",
    label: "Not right now",
    description: "Between jobs or not currently earning",
  },
];

export default function StepIncome({ value, onChange, onNext }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">
        Income
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 leading-snug">
        Do you have a regular source of income right now?
      </h2>
      <p className="text-sm text-slate-500 mb-6">Even part-time work or work-study counts.</p>
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={value === opt.value}
            onClick={() => {
              onChange(opt.value);
              setTimeout(() => onNext(opt.value), 180);
            }}
          />
        ))}
      </div>
    </div>
  );
}
