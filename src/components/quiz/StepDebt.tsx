"use client";

import SelectionCard from "@/components/shared/SelectionCard";
import { DebtAnswer } from "@/types";

interface Props {
  value: DebtAnswer | undefined;
  onChange: (v: DebtAnswer) => void;
  onNext: (selected: DebtAnswer) => void;
}

const OPTIONS: { value: DebtAnswer; label: string; description: string }[] = [
  {
    value: "high_interest",
    label: "Yes, high-interest debt",
    description: "Credit card balance I carry month to month, or a personal loan",
  },
  {
    value: "low_interest",
    label: "Only low-interest debt",
    description: "Student loans, car payments, or other debt under 8% interest",
  },
  {
    value: "none",
    label: "No debt at all",
    description: "Starting clean",
  },
];

export default function StepDebt({ value, onChange, onNext }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">
        Debt
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 leading-snug">
        Do you carry any high-interest debt?
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Credit cards typically charge 20 to 30% interest. That matters for what comes next.
      </p>
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
