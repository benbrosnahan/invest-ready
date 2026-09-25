"use client";

import { useState, useRef, useEffect } from "react";

interface InfoTooltipProps {
  content: string;
  fee?: string;
  provider?: string;
}

export default function InfoTooltip({ content, fee, provider }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group w-9 h-9 -m-2.5 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        aria-label="Learn more"
      >
        <span className="w-4 h-4 rounded-full bg-slate-200 group-hover:bg-slate-300 text-slate-600 text-[10px] font-bold flex items-center justify-center transition-colors">
          i
        </span>
      </button>
      {open && (
        <div className="absolute z-20 bottom-6 -left-2 w-64 max-w-[calc(100vw-7rem)] bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed">
          <p>{content}</p>
          {(fee || provider) && (
            <p className="mt-1.5 text-slate-400">
              {fee && <span>Fee: {fee}</span>}
              {fee && provider && <span className="mx-1">·</span>}
              {provider && <span>{provider}</span>}
            </p>
          )}
          <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
