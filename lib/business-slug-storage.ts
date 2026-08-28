"use client";

export const BUSINESS_SLUG_KEY = "dodome_last_business_slug";

export function getStoredBusinessSlug(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(BUSINESS_SLUG_KEY);
  } catch {
    return null;
  }
}

export function setStoredBusinessSlug(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BUSINESS_SLUG_KEY, slug);
  } catch {
    // ignore
  }
}

export function clearStoredBusinessSlug(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(BUSINESS_SLUG_KEY);
  } catch {
    // ignore
  }
}