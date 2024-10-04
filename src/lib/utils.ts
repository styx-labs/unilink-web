import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkURL(url: string) {
  if (!url.startsWith("http://") || !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}
