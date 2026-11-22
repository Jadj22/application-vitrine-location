"use client";

import { getVisitorId } from "./visitor";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://application-gestion-backend.onrender.com/api";

type ActiveResponse = {
  hasActiveRequest: boolean;
  request: {
    id: string;
    trackingCode: string;
    statut: string;
    statut_display: string;
    item_nom: string;
    date_debut: string;
    date_fin: string;
    created_at: string;
    expires_at: string;
    // full detail
    [key: string]: any;
  } | null;
};

export async function checkActiveRequest(slug: string, visitorId?: string): Promise<ActiveResponse> {
  const vid = visitorId || getVisitorId();
  if (!vid) return { hasActiveRequest: false, request: null };
  const url = `${API_BASE}/public/b/${slug}/active-request/?visitor_id=${encodeURIComponent(vid)}`;
  try {
    const res = await fetch(url, { headers: vid ? { "X-Visitor-Id": vid } : {} });
    if (!res.ok) return { hasActiveRequest: false, request: null };
    return (await res.json()) as ActiveResponse;
  } catch {
    return { hasActiveRequest: false, request: null };
  }
}

export async function fetchMyRequests(slug: string, visitorId?: string) {
  const vid = visitorId || getVisitorId();
  if (!vid) return [];
  const url = `${API_BASE}/public/b/${slug}/customer-requests/?visitor_id=${encodeURIComponent(vid)}`;
  try {
    const res = await fetch(url, { headers: { "X-Visitor-Id": vid } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []) as any[];
  } catch {
    return [];
  }
}

export async function recoverRequest(
  slug: string,
  data: { email?: string; phone?: string; visitor_id?: string }
) {
  const url = `${API_BASE}/public/b/${slug}/recover/`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Aucune demande trouvée");
  }
  const json = await res.json();
  return json.results as any[];
}

export function getIdempotencyKey(slug: string, itemId: string, draftId: string) {
  return `idem_${slug}_${itemId}_${draftId}`.slice(0, 80);
}
