"use client";

import { getVisitorId, ensureVisitorId } from "./visitor";

export type DraftData = {
  draftId: string;
  visitorId: string;
  slug: string;
  items: Array<{ id: string; nom: string; quantity: number; prix?: number; photo_url?: string; category_nom?: string }>;
  dates: { from: string; to: string }; // YYYY-MM-DD
  customer: { name: string; email: string; phone: string };
  lieu: { nom: string; adresse: string; contactNom: string; contactTelephone: string; notes: string };
  message: string;
  currentStep: number;
  updatedAt: string;
};

const DRAFT_TTL_MS = 30 * 24 * 3600 * 1000; // 30 jours

function draftKey(slug: string, visitorId?: string) {
  const vid = visitorId || getVisitorId() || "anon";
  return `dodome:draft:${slug}:${vid}`;
}

function legacyKey(slug: string) {
  return `dodome:draft:${slug}`;
}

export function ensureDraftId(slug: string): string {
  const existing = loadDraft(slug);
  if (existing?.draftId) return existing.draftId;
  try {
    return crypto.randomUUID();
  } catch {
    return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

export function saveDraft(slug: string, data: Partial<DraftData>) {
  if (typeof window === "undefined") return;
  const visitorId = ensureVisitorId();
  const key = draftKey(slug, visitorId);
  const existing = loadDraft(slug);
  const draftId = data.draftId || existing?.draftId || ensureDraftId(slug);
  const draft: DraftData = {
    draftId,
    visitorId,
    slug,
    items: data.items ?? existing?.items ?? [],
    dates: data.dates ?? existing?.dates ?? { from: "", to: "" },
    customer: data.customer ?? existing?.customer ?? { name: "", email: "", phone: "" },
    lieu: data.lieu ?? existing?.lieu ?? { nom: "", adresse: "", contactNom: "", contactTelephone: "", notes: "" },
    message: data.message ?? existing?.message ?? "",
    currentStep: data.currentStep ?? existing?.currentStep ?? 1,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(key, JSON.stringify(draft));
    // Also keep legacy key for migration
    localStorage.setItem(legacyKey(slug), JSON.stringify(draft));
  } catch {}
  return draft;
}

export function loadDraft(slug: string): DraftData | null {
  if (typeof window === "undefined") return null;
  const visitorId = getVisitorId();
  const keys = [draftKey(slug, visitorId || undefined), legacyKey(slug)];
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as DraftData;
      // TTL check
      if (parsed.updatedAt) {
        const age = Date.now() - new Date(parsed.updatedAt).getTime();
        if (age > DRAFT_TTL_MS) {
          localStorage.removeItem(key);
          continue;
        }
      }
      return parsed;
    } catch {}
  }
  return null;
}

export function clearDraft(slug: string) {
  if (typeof window === "undefined") return;
  const visitorId = getVisitorId();
  try {
    localStorage.removeItem(draftKey(slug, visitorId || undefined));
    localStorage.removeItem(legacyKey(slug));
  } catch {}
}

export function hasDraft(slug: string): boolean {
  return !!loadDraft(slug);
}
