import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatProductPrice(price: number | string | null | undefined): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (typeof num === "number" && !isNaN(num) && num > 0) {
    return `Rp ${Math.round(num).toLocaleString("id-ID")}`;
  }
  return "Info via Admin";
}
