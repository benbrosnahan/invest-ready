import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** The answers live in this tab's sessionStorage only, so closing the tab clears them. */
export const ANSWERS_KEY = "invest-ready-answers";

// When storage is blocked (some private modes), a copy in memory still carries the answers from the quiz to the
// result, because that move is a client-side navigation. Only a reload of the result is lost.
const memory = new Map<string, string>();

export const storage = {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key) ?? memory.get(key) ?? null;
    } catch {
      return memory.get(key) ?? null;
    }
  },
  set(key: string, value: string): void {
    memory.set(key, value);
    try {
      sessionStorage.setItem(key, value);
    } catch {}
  },
};
