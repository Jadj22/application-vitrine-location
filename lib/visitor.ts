"use client";

const VISITOR_KEY = "dodome_visitor_id";
const VISITOR_COOKIE = "visitorId";

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getVisitorId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(VISITOR_KEY) || getCookie(VISITOR_COOKIE);
}

export function ensureVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_KEY) || getCookie(VISITOR_COOKIE);
  if (!id) {
    try {
      id = crypto.randomUUID();
    } catch {
      id = `vis_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }
    localStorage.setItem(VISITOR_KEY, id);
    setCookie(VISITOR_COOKIE, id);
  } else {
    // Sync both storages
    if (!localStorage.getItem(VISITOR_KEY)) localStorage.setItem(VISITOR_KEY, id);
    if (!getCookie(VISITOR_COOKIE)) setCookie(VISITOR_COOKIE, id);
  }
  return id;
}

export function clearVisitorId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(VISITOR_KEY);
  document.cookie = `${VISITOR_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
