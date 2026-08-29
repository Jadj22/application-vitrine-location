"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, Package, ArrowRight, Clock, ExternalLink, Trash2, Mail, Phone, ShieldCheck, Loader2 } from "lucide-react";
import { getVisitorId } from "@/lib/visitor";
import { bookingRequests } from "@/lib/api";

type StoredRequest = {
  id: string;
  token: string;
  itemName?: string;
  createdAt: string;
};

export default function SuiviPage() {
  const { slug } = useParams<{ slug: string }>();
  const [token, setToken] = useState("");
  const [recent, setRecent] = useState<StoredRequest[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [recoverResults, setRecoverResults] = useState<any[]>([]);
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [recoverError, setRecoverError] = useState("");
  const [backendRecent, setBackendRecent] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`dodome:requests:${slug}`);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
    // Vérifier le backend (source de vérité) pour les demandes liées au visitorId
    const vid = getVisitorId();
    if (vid && slug) {
      bookingRequests.myRequests(slug, vid).then((res) => {
        if (res?.results) setBackendRecent(res.results);
        else if (Array.isArray(res)) setBackendRecent(res);
      }).catch(() => {});
    }
  }, [slug]);

  const clearRecent = () => {
    localStorage.removeItem(`dodome:requests:${slug}`);
    setRecent([]);
    window.dispatchEvent(new Event("dodome:requests-updated"));
  };

  useEffect(() => {
    const onUpdate = () => {
      try {
        const raw = localStorage.getItem(`dodome:requests:${slug}`);
        setRecent(raw ? JSON.parse(raw) : []);
      } catch {}
      const vid = getVisitorId();
      if (vid && slug) {
        bookingRequests.myRequests(slug, vid).then((res) => {
          if (res?.results) setBackendRecent(res.results);
          else if (Array.isArray(res)) setBackendRecent(res);
        }).catch(() => {});
      }
    };
    window.addEventListener("dodome:requests-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("dodome:requests-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [slug]);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverError("");
    setRecoverResults([]);
    if (!email.trim() && !phone.trim()) {
      setRecoverError("Entrez votre e-mail ou téléphone");
      return;
    }
    setRecoverLoading(true);
    try {
      const res = await bookingRequests.recover(slug as string, {
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        visitor_id: getVisitorId() || undefined,
      });
      const results = (res as any).results || [];
      if (results.length === 0) {
        setRecoverError("Aucune demande trouvée pour ces informations. Vérifiez l'orthographe.");
      } else {
        setRecoverResults(results);
      }
    } catch (err: any) {
      setRecoverError(err.message || "Aucune demande trouvée");
    } finally {
      setRecoverLoading(false);
    }
  };

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    const t = token.trim();
    if (!t) return;
    // Support full URL pasted
    const match = t.match(/([a-f0-9]{32,}|[A-Za-z0-9\-_]{20,})/);
    const clean = match ? match[1] : t;
    // Also handle full URL like /b/slug/booking-requests/token
    if (t.includes("/booking-requests/")) {
      const parts = t.split("/booking-requests/");
      const tok = parts[1]?.split(/[?#]/)[0]?.split("/")[0];
      if (tok) {
        window.location.href = `/b/${slug}/booking-requests/${tok}`;
        return;
      }
    }
    window.location.href = `/b/${slug}/booking-requests/${clean}`;
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Link href={`/b/${slug}`} className="font-mono text-lg font-bold tracking-tight">
            {slug}<span className="text-primary">.</span>
          </Link>
          <Link href={`/b/${slug}`} className="text-sm text-muted-foreground hover:text-foreground">
            Retour catalogue
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Suivi</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Suivre ma demande</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Entrez le lien ou le code reçu après votre demande. Vous le retrouvez dans le SMS, l'e-mail ou la page de confirmation.
        </p>

        <form onSubmit={handleGo} className="mt-8 rounded-2xl border border-border bg-card p-5">
          <label htmlFor="token" className="text-sm font-medium">
            Lien ou code de suivi
          </label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Ex: https://.../booking-requests/abc123 ou abc123"
                className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Voir <ArrowRight className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Le code est insensible à la casse, vous pouvez coller l'URL complète.</p>
        </form>

        {recent.length > 0 ? (
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Clock className="size-4" /> Vos demandes récentes sur cet appareil
              </h2>
              <button onClick={clearRecent} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <Trash2 className="size-3" /> Effacer
              </button>
            </div>
            <div className="mt-3 grid gap-3">
              {recent.map((r) => (
                <Link
                  key={r.id}
                  href={`/b/${slug}/booking-requests/${r.token}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:bg-muted/30"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{r.itemName || `Demande ${r.id.slice(0, 8)}`}</p>
                    <p className="text-xs text-muted-foreground">N° {r.id.slice(0, 8)} • {new Date(r.createdAt).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <span className="ml-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Suivre <ExternalLink className="size-3" />
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Stocké uniquement sur cet appareil. Conservez vos liens reçus par e-mail/SMS.</p>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <Package className="mx-auto size-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm font-medium">Aucune demande récente sur cet appareil</p>
            <p className="mt-1 text-xs text-muted-foreground">Après une demande, elle apparaîtra ici automatiquement.</p>
            <Link href={`/b/${slug}#catalogue`} className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Voir le catalogue
            </Link>
          </div>
        )}

        {/* Retrouver ma demande — récupération via email/téléphone (change d'appareil) */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4 text-primary" /> Vous avez oublié votre code ?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Retrouvez vos demandes avec votre e-mail ou téléphone (vérification côté serveur).</p>
          <form onSubmit={handleRecover} className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <Mail className="size-3.5" /> E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votremail@domain.com"
                className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <Phone className="size-3.5" /> Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+228 90 12 34 56"
                className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={recoverLoading || (!email.trim() && !phone.trim())}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {recoverLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                Retrouver mes demandes
              </button>
              {recoverError && <p className="mt-2 text-sm text-destructive">{recoverError}</p>}
            </div>
          </form>
          {recoverResults.length > 0 && (
            <div className="mt-4 grid gap-2">
              <p className="text-sm font-medium">Résultats ({recoverResults.length}) :</p>
              {recoverResults.map((r) => (
                <Link
                  key={r.id}
                  href={`/b/${slug}/booking-requests/${r.trackingCode}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3 hover:bg-muted"
                >
                  <div>
                    <p className="font-medium">{r.item_nom} • {r.statut_display || r.statut}</p>
                    <p className="text-xs text-muted-foreground">N° {String(r.trackingCode).slice(0, 8)} • {new Date(r.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">Voir →</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mes demandes — source backend via visitorId (changement d'appareil possible après vérification) */}
        {backendRecent.length > 0 && (
          <div className="mt-10">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Package className="size-4" /> Mes demandes (serveur)
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Associées à ce navigateur (visitorId). Après vérification e-mail/téléphone, elles apparaissent ici même sur un autre appareil.</p>
            <div className="mt-3 grid gap-3">
              {backendRecent.map((r) => (
                <Link
                  key={r.id}
                  href={`/b/${slug}/booking-requests/${r.trackingCode}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50"
                >
                  <div>
                    <p className="font-medium">{r.item_nom} • {r.statut_display || r.statut}</p>
                    <p className="text-xs text-muted-foreground">N° {String(r.trackingCode).slice(0, 8)} • {new Date(r.created_at).toLocaleDateString("fr-FR")} • {r.statut}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">Suivre →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 rounded-xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
          <p className="font-medium text-foreground">Besoin d'aide ?</p>
          <p>Contactez directement le professionnel via les coordonnées en bas de page. Munissez-vous de votre numéro de demande (8 caractères).</p>
        </div>
      </div>
    </main>
  );
}
