import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeFinalSFromFirstAndSecondWord(str: string): string {
  const words = str.split(" ");

  if (words[0]?.endsWith("s")) {
    words[0] = words[0].slice(0, -1);
  }

  if (words[1]?.endsWith("s")) {
    words[1] = words[1].slice(0, -1);
  }

  return words.join(" ");
}