"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";

type Props = { slug: string };

export default function RecentRequestsBanner({ slug }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`dodome:requests:${slug}`);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setCount(arr.length);
      }
    } catch {}
    const onStorage = () => {
      try {
        const raw = localStorage.getItem(`dodome:requests:${slug}`);
        setCount(raw ? JSON.parse(raw).length : 0);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    // Also listen for custom event when a new request is added in same tab
    const onCustom = () => onStorage();
    window.addEventListener("dodome:requests-updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("dodome:requests-updated", onCustom);
    };
  }, [slug]);

  if (count === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-slate-700 dark:bg-card">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Déjà client ? <span className="font-semibold text-slate-900 dark:text-white">Suivez l'état de votre demande</span> avec le lien reçu.
          </p>
          <Link
            href={`/b/${slug}/suivi`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-card dark:text-slate-200"
          >
            Suivre ma demande <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-slate-700 dark:bg-card">
        <p className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Package className="size-3.5" />
          </span>
          <span>
            Vous avez <span className="font-semibold text-slate-900 dark:text-white">{count}</span> demande{count > 1 ? "s" : ""} en cours
          </span>
        </p>
        <Link
          href={`/b/${slug}/suivi`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          Voir le suivi <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
