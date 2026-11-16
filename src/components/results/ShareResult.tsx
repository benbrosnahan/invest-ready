"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Card, buttonClass } from "@/components/shared/ui";
import { cn } from "@/lib/utils";

const noSubscribe = () => () => {};

// The phone's share sheet is offered only on touch screens, where it is the natural way to send a link. Elsewhere
// copying is clearer than a desktop share dialog.
const canShareSheet = () =>
  typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches;

type Status = "idle" | "copied" | "manual";

/** Copy or share this result's link. The link holds the answers and nothing else, and the card says so. */
export default function ShareResult({ url }: { url: string }) {
  const sheet = useSyncExternalStore(noSubscribe, canShareSheet, () => false);
  const [status, setStatus] = useState<Status>("idle");
  const field = useRef<HTMLInputElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      // Clipboard blocked: show the link, selected, so it can be copied by hand.
      setStatus("manual");
      requestAnimationFrame(() => field.current?.select());
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: "My Invest Ready answer", url });
    } catch {
      // Closing the share sheet is not an error worth showing.
    }
  };

  return (
    <Card aria-labelledby="share-heading">
      <h2 id="share-heading" className="font-display text-xl font-bold leading-tight text-slate-900">
        Share this answer
      </h2>
      <p className="mt-1.5 text-base leading-relaxed text-slate-700">
        Anyone with the link sees this same answer. It holds only the choices you picked here, nothing about you.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={copy} className={cn(buttonClass.secondary, "min-w-[10.5rem]")}>
          {status === "copied" ? <CheckIcon /> : <LinkIcon />}
          {status === "copied" ? "Link copied" : "Copy link"}
        </button>
        {sheet && (
          <button type="button" onClick={share} className={buttonClass.secondary}>
            <ShareIcon />
            Share
          </button>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {status === "copied" ? "Link copied" : ""}
      </p>
      {status === "manual" && (
        <div className="mt-4">
          <label htmlFor="share-link" className="text-sm font-semibold text-slate-900">
            Copy this link
          </label>
          <input
            ref={field}
            id="share-link"
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-1.5 min-h-[48px] w-full rounded-full border border-slate-500 bg-white px-4 text-base text-slate-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>
      )}
    </Card>
  );
}

const iconProps = {
  "aria-hidden": true,
  className: "h-[18px] w-[18px] flex-shrink-0",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function LinkIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
      <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg {...iconProps} strokeWidth={2.6}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 15V4" />
      <path d="M8 8l4-4 4 4" />
      <path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}
