"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { bookingRequests, catalog } from "@/lib/api";

export default function TrackingPage({
  params,
}: {
  params: Promise<{ slug: string; token: string }>;
}) {
  const { slug, token } = use(params);
  const [request, setRequest] = useState<{
    id: string;
    item_id: string;
    statut: string;
    created_at: string;
    updated_at: string;
    date_debut: string;
    date_fin: string;
    quantite: number;
    client_nom: string;
    client_email: string;
    client_telephone: string;
    message: string;
    lieu_nom: string;
    lieu_adresse: string;
    contact_nom: string;
    contact_telephone: string;
    notes_livraison: string;
    contre_proposition: {
      date_debut: string;
      date_fin: string;
      quantite: number;
      prix: number;
      message: string;
    } | null;
    motif_refus: string | null;
    reservation_creee_id: string | null;
  } | null>(null);
  const [item, setItem] = useState<{
    id: string;
    nom: string;
    photo_url: string;
    prix: number;
    unite: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const req = await bookingRequests.get(slug, token);
      if (!req) return;
      setRequest(req);
      const items = await catalog.list(slug);
      const found = items.find((i) => i.id === req.item_id);
      if (found) setItem(found);
    } catch (e) {
      console.error("Failed to fetch tracking data:", e);
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchData, 10_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement du suivi...</p>
      </main>
    );
  }

  if (error || !request) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24">
        <Link href={`/b/${slug}`} className="font-mono font-bold">dodome</Link>
        <h1 className="mt-20 text-4xl font-semibold">Lien de suivi introuvable</h1>
        <p className="mt-4 text-muted-foreground">
          Vérifiez le lien reçu par email ou contactez le professionnel.
        </p>
        <Link href={`/b/${slug}`} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
          Retour au catalogue
        </Link>
      </main>
    );
  }

  const hasCounterProposal =
    request.contre_proposition &&
    ["EN_ATTENTE", "ACCEPTEE"].includes(request.statut);

  return (
    <main className="mx-auto max-w-xl px-5 py-16">
      <Link href={`/b/${slug}`} className="font-mono font-bold">dodome</Link>

      <div className="mt-20">
        <p className="font-mono text-xs uppercase tracking-[.2em] text-primary">
          Demande {request.id}
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-.05em]">
          Suivez votre demande.
        </h1>

        {/* Résumé */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
          {item && (
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              {item.photo_url ? (
                <img src={item.photo_url} alt={item.nom} className="h-12 w-12 rounded-xl object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-xl">📦</div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Article</p>
                <p className="font-semibold">{item.nom}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
            <div>
              <p className="text-muted-foreground">Période</p>
              <p className="font-medium">
                {new Date(request.date_debut).toLocaleDateString("fr-FR")} →{" "}
                {new Date(request.date_fin).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Quantité</p>
              <p className="font-medium">{request.quantite}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border text-sm">
            <p className="text-muted-foreground">Statut</p>
            <p className="font-medium capitalize">{request.statut.replace(/_/g, " ").toLowerCase()}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-12 flex flex-col">
          {[
            {
              label: "Demande envoyée",
              detail: "Votre demande a bien été transmise au professionnel.",
              done: true,
              date: request.created_at,
            },
            {
              label: "En attente de réponse",
              detail: "Le professionnel examine votre demande.",
              done: request.statut !== "EN_ATTENTE",
              date: request.updated_at,
            },
            {
              label: "Réponse du professionnel",
              detail: request.contre_proposition
                ? "Le professionnel a fait une contre-proposition."
                : request.statut === "ACCEPTEE"
                ? "Le professionnel a accepté votre demande."
                : request.statut === "REFUSEE"
                ? "Le professionnel a refusé votre demande."
                : "En attente de réponse.",
              done: ["ACCEPTEE", "REFUSEE", "CONVERTIE"].includes(request.statut),
              date: request.updated_at,
            },
          ].map((event) => (
            <div
              key={event.label}
              className="flex gap-4 border-l border-border pb-8 pl-7 last:pb-0"
            >
              <span
                className={`-ml-[2.05rem] flex size-8 shrink-0 items-center justify-center rounded-full border ${
                  event.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background"
                }`}
              >
                <Check className="size-4" />
              </span>
              <div>
                <h2 className="font-semibold">{event.label}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {event.detail}
                </p>
                {event.date && (
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {new Date(event.date).toLocaleDateString("fr-FR")} à{" "}
                    {new Date(event.date).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contre-proposition */}
        {hasCounterProposal && request.contre_proposition && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
            <h3 className="font-semibold text-amber-900 dark:text-amber-200">
              Contre-proposition du professionnel
            </h3>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-amber-700 dark:text-amber-300">Période initiale</p>
                  <p className="text-muted-foreground line-through">
                    {new Date(request.date_debut).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(request.date_fin).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <p className="text-amber-700 dark:text-amber-300">Période proposée</p>
                  <p className="font-medium">
                    {new Date(request.contre_proposition.date_debut).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(request.contre_proposition.date_fin).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              {request.contre_proposition.quantite !== request.quantite && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-amber-700 dark:text-amber-300">Quantité initiale</p>
                    <p className="text-muted-foreground line-through">{request.quantite}</p>
                  </div>
                  <div>
                    <p className="text-amber-700 dark:text-amber-300">Quantité proposée</p>
                    <p className="font-medium">{request.contre_proposition.quantite}</p>
                  </div>
                </div>
              )}

              {request.contre_proposition.prix && (
                <div className="text-sm">
                  <p className="text-amber-700 dark:text-amber-300">Prix proposé</p>
                  <p className="font-medium">
                    {request.contre_proposition.prix.toLocaleString("fr-FR")} F CFA/unité
                  </p>
                </div>
              )}

              {request.contre_proposition.message && (
                <div className="text-sm">
                  <p className="text-amber-700 dark:text-amber-300">Message</p>
                  <p>{request.contre_proposition.message}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Refusé */}
        {request.statut === "REFUSEE" && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-800 dark:bg-red-950/30">
            <p className="text-red-800 dark:text-red-200 font-semibold">
              Demande refusée
            </p>
            {request.motif_refus && (
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {request.motif_refus}
              </p>
            )}
          </div>
        )}

        {/* Acceptée — en attente de conversion */}
        {request.statut === "ACCEPTEE" && (
          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-center dark:border-blue-800 dark:bg-blue-950/30">
            <p className="font-semibold text-blue-900 dark:text-blue-200">Demande acceptée !</p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              Le professionnel a accepté votre demande. Votre réservation est en cours de confirmation.
            </p>
            <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">Vous serez notifié dès que la réservation sera confirmée.</p>
          </div>
        )}

        {/* Convertie — Réservation confirmée avec prochaines étapes */}
        {request.statut === "CONVERTIE" && (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/30">
            <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">🎉 Réservation confirmée !</p>
            <div className="mt-3 rounded-xl bg-white p-4 text-left shadow-sm dark:bg-emerald-950">
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                Réservation {request.reservation_creee_id ? `#${String(request.reservation_creee_id).slice(0, 8)}` : `#${request.id.slice(0, 8)}`} •{" "}
                <span className="font-normal">{item?.nom}</span>
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Période</p>
                  <p className="font-medium">
                    {new Date(request.date_debut).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(request.date_fin).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantité</p>
                  <p className="font-medium">{request.quantite}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {request.reservation_creee_id && (
                  <Link
                    href={`/b/${slug}/invoices/${request.reservation_creee_id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Voir ma réservation
                  </Link>
                )}
                <Link
                  href={`/b/${slug}/suivi`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-transparent dark:text-emerald-200"
                >
                  Suivre ma réservation
                </Link>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-white p-4 text-left dark:bg-emerald-950">
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Prochaines étapes</p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">✓</span> Réservation confirmée
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-5 rounded-full border border-muted-foreground/30" /> Préparation de votre commande
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-5 rounded-full border border-muted-foreground/30" /> Retrait / livraison
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-5 rounded-full border border-muted-foreground/30" /> Location en cours
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-5 rounded-full border border-muted-foreground/30" /> Retour des articles
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Le professionnel vous contactera pour organiser la suite. Conservez ce lien de suivi.</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href={`/b/${slug}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    </main>
  );
}