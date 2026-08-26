"use client";

import SelectionCard from "@/components/shared/SelectionCard";
import { EmergencyAnswer } from "@/types";

interface Props {
  value: EmergencyAnswer | undefined;
  onChange: (v: EmergencyAnswer) => void;
  onNext: (selected: EmergencyAnswer) => void;
}

const OPTIONS: { value: EmergencyAnswer; label: string; description: string }[] = [
  {
    value: "funded",
    label: "Yes, I have at least one month covered",
    description: "Enough saved to cover rent, food, and essentials for a month",
  },
  {
    value: "partial",
    label: "I have some savings, but not a full month",
    description: "Something saved, but it wouldn't last long",
  },
  {
    value: "none",
    label: "No savings cushion yet",
    description: "Starting from zero or close to it",
  },
];

export default function StepEmergency({ value, onChange, onNext }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">
        Cushion
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 leading-snug">
        Do you have a financial cushion saved up?
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Think of this as money that would keep you afloat if something unexpected happened.
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
