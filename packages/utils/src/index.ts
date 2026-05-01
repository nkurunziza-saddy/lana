import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_URL = "https://andi-editor.vercel.app";
export const DEV_URL = "http://localhost:5173";

export const getBaseUrl = () => {
  if (
    typeof process !== "undefined" &&
    (process.env.VERCEL === "1" || process.env.NODE_ENV === "production")
  ) {
    return SITE_URL;
  }
  return DEV_URL;
};
