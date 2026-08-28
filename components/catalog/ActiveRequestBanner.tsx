"use client";

import Link from "next/link";
import { useRequest } from "@/lib/request-context";
import { AlertCircle, CheckCircle, Clock, X } from "lucide-react";
import { useState } from "react";

export default function ActiveRequestBanner({ slug }: { slug: string }) {
  const { hasActiveRequest, activeRequest } = useRequest();
  const [dismissed, setDismissed] = useState(false);

  if (!hasActiveRequest || !activeRequest || dismissed) return null;

  const tracking = (activeRequest.trackingCode || activeRequest.access_token || activeRequest.id || "").slice(0, 8);
  const statut = activeRequest.statut_display || activeRequest.statut;

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="mt-6 rounded-2xl border border-amber-300 bg-white p-4 shadow-sm dark:border-amber-800 dark:bg-amber-950/40">
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
            <AlertCircle className="size-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-amber-100">Vous avez déjà une demande en cours</p>
            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-amber-200">
              Demande <span className="font-mono font-medium">#{tracking}</span> • {statut} • {activeRequest.item_nom || "Article"} •{" "}
              {activeRequest.date_debut && activeRequest.date_fin ? `${activeRequest.date_debut} → ${activeRequest.date_fin}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/b/${slug}/booking-requests/${activeRequest.trackingCode || activeRequest.access_token}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
              >
                <CheckCircle className="size-4" /> Voir ma demande
              </Link>
              <Link
                href={`/b/${slug}/booking-requests/new`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900"
              >
                Continuer
              </Link>
              <Link
                href={`/b/${slug}/suivi`}
                className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-amber-200"
              >
                <Clock className="size-4" /> Retrouver ma demande
              </Link>
            </div>
          </div>
          <button onClick={() => setDismissed(true)} className="shrink-0 text-slate-400 hover:text-slate-600 dark:text-amber-300">
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-amber-300/60">
          Vous voulez faire une autre demande ? Vous pouvez créer une nouvelle demande, elle sera traitée séparément.
        </p>
      </div>
    </div>
  );
}
