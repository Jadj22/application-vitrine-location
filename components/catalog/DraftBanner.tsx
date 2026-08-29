"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FilePenLine, X } from "lucide-react";
import { loadDraft, clearDraft } from "@/lib/draft";

type Draft = {
  items?: { length: number };
  dates?: { from?: string; to?: string };
  updatedAt?: string;
};

export default function DraftBanner({ slug }: { slug: string }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const d = loadDraft(slug);
    if (d && (d.items?.length > 0 || d.dates?.from)) setDraft(d);
    const onUpdate = () => {
      const nd = loadDraft(slug);
      if (nd && (nd.items?.length > 0 || nd.dates?.from)) setDraft(nd);
      else setDraft(null);
    };
    window.addEventListener("dodome:draft-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("dodome:draft-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [slug]);

  if (!draft || dismissed) return null;

  const itemCount = draft.items?.length || 0;
  const dates = draft.dates?.from && draft.dates?.to ? `${draft.dates.from} → ${draft.dates.to}` : draft.dates?.from || "dates non définies";

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="mt-6 rounded-2xl border border-blue-300 bg-white p-4 shadow-sm dark:border-blue-800 dark:bg-blue-950/40">
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
            <FilePenLine className="size-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-blue-100">Brouillon retrouvé</p>
            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-blue-200">
              {itemCount} article{itemCount > 1 ? "s" : ""} • {dates} • Dernière modif {draft.updatedAt ? new Date(draft.updatedAt).toLocaleString("fr-FR") : "Date inconnue"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/b/${slug}/booking-requests/new`}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Reprendre
              </Link>
              <button
                onClick={() => {
                  clearDraft(slug);
                  setDraft(null);
                  setDismissed(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900"
              >
                Recommencer
              </button>
            </div>
          </div>
          <button onClick={() => setDismissed(true)} className="shrink-0 text-slate-400 hover:text-slate-600 dark:text-blue-300">
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
