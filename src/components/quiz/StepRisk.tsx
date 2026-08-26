"use client";

import SelectionCard from "@/components/shared/SelectionCard";
import { RiskAnswer } from "@/types";

interface Props {
  value: RiskAnswer | undefined;
  onChange: (v: RiskAnswer) => void;
  onNext: (override?: RiskAnswer) => void;
}

const OPTIONS: { value: RiskAnswer; label: string; description: string }[] = [
  {
    value: "conservative",
    label: "Pull it out. I can't afford to lose that.",
    description: "Protecting what I have matters more than maximizing growth",
  },
  {
    value: "moderate",
    label: "Leave it and wait. I trust the market recovers.",
    description: "I want growth and can handle some short-term swings",
  },
  {
    value: "growth",
    label: "Put more in. A dip is a buying opportunity.",
    description: "Long-term growth is the priority, I'm not worried about dips",
  },
];

export default function StepRisk({ value, onChange, onNext }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">
        Risk
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 leading-snug">
        If your investment dropped 10% next month, what would you do?
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        There is no wrong answer. This just helps us suggest the right mix for you.
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
