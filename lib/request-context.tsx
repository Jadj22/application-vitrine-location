"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ensureVisitorId, getVisitorId } from "./visitor";
import { loadDraft, DraftData } from "./draft";
import { checkActiveRequest } from "./requestMemory";

type ActiveRequest = {
  id: string;
  trackingCode: string;
  statut: string;
  statut_display: string;
  item_nom: string;
  date_debut: string;
  date_fin: string;
  created_at: string;
  expires_at: string;
  [key: string]: any;
} | null;

type RequestContextType = {
  visitorId: string | null;
  activeRequest: ActiveRequest;
  hasActiveRequest: boolean;
  draft: DraftData | null;
  refresh: (slug: string) => Promise<void>;
  clearActive: () => void;
};

const RequestContext = createContext<RequestContextType>({
  visitorId: null,
  activeRequest: null,
  hasActiveRequest: false,
  draft: null,
  refresh: async () => {},
  clearActive: () => {},
});

export function RequestProvider({ children, slug }: { children: React.ReactNode; slug?: string }) {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] = useState<ActiveRequest>(null);
  const [draft, setDraft] = useState<DraftData | null>(null);

  const refresh = useCallback(
    async (targetSlug: string) => {
      const s = targetSlug || slug;
      if (!s) return;
      const vid = ensureVisitorId();
      setVisitorId(vid);
      setDraft(loadDraft(s));
      try {
        const res = await checkActiveRequest(s, vid);
        setActiveRequest(res.request as ActiveRequest);
      } catch {
        setActiveRequest(null);
      }
    },
    [slug]
  );

  useEffect(() => {
    if (slug) refresh(slug);
    else {
      setVisitorId(getVisitorId());
    }
  }, [slug, refresh]);

  // Listen for draft updates
  useEffect(() => {
    const onUpdate = () => {
      if (slug) setDraft(loadDraft(slug));
    };
    window.addEventListener("dodome:draft-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("dodome:draft-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [slug]);

  const clearActive = () => setActiveRequest(null);

  return (
    <RequestContext.Provider
      value={{
        visitorId,
        activeRequest,
        hasActiveRequest: !!activeRequest,
        draft,
        refresh,
        clearActive,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequest() {
  return useContext(RequestContext);
}
