"use client";

import SelectionCard from "@/components/shared/SelectionCard";
import { GoalAnswer } from "@/types";

interface Props {
  value: GoalAnswer | undefined;
  onChange: (v: GoalAnswer) => void;
  onNext: (selected: GoalAnswer) => void;
}

const OPTIONS: { value: GoalAnswer; label: string; description: string }[] = [
  {
    value: "retirement",
    label: "Retirement",
    description: "I won't touch this money for decades",
  },
  {
    value: "big_goal",
    label: "A big goal",
    description: "House, travel, car, or something else within the next 10 years",
  },
  {
    value: "wealth",
    label: "Growing my wealth",
    description: "No specific goal, just want money working for me",
  },
  {
    value: "soon",
    label: "Might need it within 1 to 3 years",
    description: "I want growth but may need access to it soon",
  },
];

export default function StepGoal({ value, onChange, onNext }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">
        Goal
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 leading-snug">
        What do you want this money to do?
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Pick what feels closest. You can always adjust later.
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
