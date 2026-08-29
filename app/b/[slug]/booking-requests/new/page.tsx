"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { ArrowRight, MapPin, User, Mail, Phone, MessageSquare, Package, Calendar as CalendarIcon, Loader2, X, Minus, Plus, Trash2, Share2, Send, AlertCircle, CheckCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { catalog, bookingRequests, publicBusiness } from "@/lib/api";
import type { PublicItem, BookingRequestResult } from "@/lib/api";
import { useSelection } from "@/lib/selection-context";
import { toast } from "sonner";
import { ensureVisitorId } from "@/lib/visitor";
import { saveDraft, loadDraft, clearDraft, ensureDraftId } from "@/lib/draft";
import { useRequest } from "@/lib/request-context";
import { getIdempotencyKey } from "@/lib/requestMemory";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const { slug } = useParams<{ slug: string }>();
  const itemId = searchParams.get("item") || "";
  const { selectedItems, removeItem, updateQuantity, clearSelection, getItemQuantity, isItemSelected, totalItems } = useSelection();

  const [items, setItems] = useState<PublicItem[]>([]);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<BookingRequestResult[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [businessInfo, setBusinessInfo] = useState<{ email?: string; telephone?: string; nom?: string } | null>(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, string> | null>(null);
  const { hasActiveRequest, activeRequest, refresh: refreshRequest } = useRequest();
  const [showActiveBanner, setShowActiveBanner] = useState(true);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const visitorId = typeof window !== "undefined" ? ensureVisitorId() : "";
  const draftId = slug ? ensureDraftId(slug as string) : "";
  const hasShownDraftToast = useRef(false);

  // Draft: restauration au chargement (brouillon vs demande) — single source, idempotent
  useEffect(() => {
    if (!slug || draftLoaded) return;
    const draft = loadDraft(slug as string);
    if (draft) {
      if (draft.dates?.from) setDateDebut(draft.dates.from);
      if (draft.dates?.to) setDateFin(draft.dates.to);
      // Restaurer les champs texte s'ils existent dans le DOM après hydratation
      setTimeout(() => {
        const form = document.querySelector("form") as HTMLFormElement | null;
        if (!form) return;
        if (draft.customer?.name) (form.elements.namedItem("clientNom") as HTMLInputElement | null)!.value = draft.customer.name;
        if (draft.customer?.email) (form.elements.namedItem("clientEmail") as HTMLInputElement | null)!.value = draft.customer.email;
        if (draft.customer?.phone) (form.elements.namedItem("clientTelephone") as HTMLInputElement | null)!.value = draft.customer.phone;
        if (draft.lieu?.nom) (form.elements.namedItem("lieuNom") as HTMLInputElement | null)!.value = draft.lieu.nom;
        if (draft.lieu?.adresse) (form.elements.namedItem("lieuAdresse") as HTMLInputElement | null)!.value = draft.lieu.adresse;
        if (draft.lieu?.contactNom) (form.elements.namedItem("contactNom") as HTMLInputElement | null)!.value = draft.lieu.contactNom;
        if (draft.lieu?.contactTelephone) (form.elements.namedItem("contactTelephone") as HTMLInputElement | null)!.value = draft.lieu.contactTelephone;
        if (draft.lieu?.notes) (form.elements.namedItem("notesLivraison") as HTMLTextAreaElement | null)!.value = draft.lieu.notes;
        if (draft.message) (form.elements.namedItem("message") as HTMLTextAreaElement | null)!.value = draft.message;
      }, 100);
      if ((draft.dates?.from || draft.customer?.name) && !hasShownDraftToast.current) {
        hasShownDraftToast.current = true;
        toast.info("Brouillon retrouvé", { id: "draft-restored", description: "Nous avons restauré votre demande en cours." });
      }
    }
    setDraftLoaded(true);
    // Vérifier demande active côté backend (source de vérité)
    if (slug) refreshRequest(slug as string);
  }, [slug, draftLoaded, refreshRequest]);

  // Draft: sauvegarde auto à chaque changement (debounce 500ms) + beforeunload
  useEffect(() => {
    if (!slug || !draftLoaded) return;
    const timeout = setTimeout(() => {
      const form = document.querySelector("form") as HTMLFormElement | null;
      if (!form) return;
      const fd = new FormData(form);
      saveDraft(slug as string, {
        dates: { from: dateDebut, to: dateFin },
        customer: {
          name: String(fd.get("clientNom") || ""),
          email: String(fd.get("clientEmail") || ""),
          phone: String(fd.get("clientTelephone") || ""),
        },
        lieu: {
          nom: String(fd.get("lieuNom") || ""),
          adresse: String(fd.get("lieuAdresse") || ""),
          contactNom: String(fd.get("contactNom") || ""),
          contactTelephone: String(fd.get("contactTelephone") || ""),
          notes: String(fd.get("notesLivraison") || ""),
        },
        message: String(fd.get("message") || ""),
        items: items.map((it) => ({ id: it.id, nom: it.nom, quantity: getItemQuantity(it.id) })),
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [slug, dateDebut, dateFin, items, draftLoaded, getItemQuantity]);

  useEffect(() => {
    const onBeforeUnload = () => {
      if (!slug) return;
      const form = document.querySelector("form") as HTMLFormElement | null;
      if (!form) return;
      const fd = new FormData(form);
      saveDraft(slug as string, {
        dates: { from: dateDebut, to: dateFin },
        customer: {
          name: String(fd.get("clientNom") || ""),
          email: String(fd.get("clientEmail") || ""),
          phone: String(fd.get("clientTelephone") || ""),
        },
        lieu: {
          nom: String(fd.get("lieuNom") || ""),
          adresse: String(fd.get("lieuAdresse") || ""),
          contactNom: String(fd.get("contactNom") || ""),
          contactTelephone: String(fd.get("contactTelephone") || ""),
          notes: String(fd.get("notesLivraison") || ""),
        },
        message: String(fd.get("message") || ""),
        items: items.map((it) => ({ id: it.id, nom: it.nom, quantity: getItemQuantity(it.id) })),
      });
    };
    const onPopState = () => onBeforeUnload();
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("popstate", onPopState);
    };
  }, [slug, dateDebut, dateFin, items, getItemQuantity]);

  // Load selected items on mount
  useEffect(() => {
    if (slug) {
      catalog.list(slug).then((allItems) => {
        const selected = allItems.filter((i) => isItemSelected(i.id));
        if (selected.length > 0) {
          setItems(selected);
        } else if (itemId) {
          // Fallback to single item from URL param
          const single = allItems.find((i) => i.id === itemId);
          if (single) setItems([single]);
        }
      });
      // Load business info for sharing
      publicBusiness.get(slug).then(setBusinessInfo).catch(() => {});
    }
  }, [slug, itemId, isItemSelected]);

  async function submitAll(e: React.FormEvent) {
    e.preventDefault();
    console.log("[submitAll] Called, items.length:", items.length, "busy:", busy);
    if (items.length === 0) {
      console.warn("[submitAll] No items selected");
      return;
    }

    const form = e.currentTarget as HTMLFormElement;
    if (!form) {
      console.error("[submitAll] Form element not found");
      return;
    }

    setBusy(true);
    setErrors({});
    setCurrentIndex(0);
    setResults([]);

    const data = new FormData(form);
    console.log("[submitAll] FormData:", Object.fromEntries(data.entries()));

    const newErrors: Record<string, string> = {};
    if (!data.get("clientNom")) newErrors.clientNom = "Nom requis";
    if (!data.get("clientEmail")) newErrors.clientEmail = "Email requis";
    if (!data.get("dateDebut")) newErrors.dateDebut = "Date de début requise";
    if (!data.get("dateFin")) newErrors.dateFin = "Date de fin requise";

    if (Object.keys(newErrors).length > 0) {
      console.log("[submitAll] Validation errors:", newErrors);
      setErrors(newErrors);
      setBusy(false);
      toast.error("Veuillez corriger les champs indiqués", {
        id: "validation-error",
        description: Object.values(newErrors).join(", "),
      });
      return;
    }

    // Extract common form data
    const commonData = {
      client_nom: String(data.get("clientNom") || ""),
      client_email: String(data.get("clientEmail") || ""),
      client_telephone: String(data.get("clientTelephone") || ""),
      date_debut: String(data.get("dateDebut") || ""),
      date_fin: String(data.get("dateFin") || ""),
      message: String(data.get("message") || ""),
      lieu_nom: String(data.get("lieuNom") || ""),
      lieu_adresse: String(data.get("lieuAdresse") || ""),
      contact_nom: String(data.get("contactNom") || ""),
      contact_telephone: String(data.get("contactTelephone") || ""),
      notes_livraison: String(data.get("notesLivraison") || ""),
    };

    // Idempotence + mémoire : une même soumission ne crée jamais deux demandes
    const visitor = ensureVisitorId();
    const currentDraftId = draftId || ensureDraftId(slug as string);
    const createdResults: BookingRequestResult[] = [];
    let hasError = false;
    let hadNetworkError = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const qty = getItemQuantity(item.id);
      setCurrentIndex(i);
      const idempotencyKey = getIdempotencyKey(slug as string, item.id, currentDraftId);

      try {
        const res = await bookingRequests.create(
          slug as string,
          {
            item_id: item.id,
            quantite: qty,
            ...commonData,
          },
          { visitorId: visitor, idempotencyKey }
        );
        createdResults.push(res);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'envoi";
        const isNetworkError =
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("NetworkError") ||
          errorMessage.includes("NetworkUnavailable") ||
          errorMessage.includes("Serveur injoignable") ||
          (typeof navigator !== "undefined" && !navigator.onLine);

        if (isNetworkError) {
          hadNetworkError = true;
          toast.error("Envoi interrompu — vérification en cours", {
            id: "network-pending",
            description: "Vos informations ont été conservées. Nous vérifions si la demande est enregistrée...",
            duration: Infinity,
          });
          try {
            const check = await bookingRequests.activeRequest(slug as string, visitor);
            if (check.hasActiveRequest && check.request) {
              toast.success("Demande retrouvée côté serveur", {
                id: "network-pending",
                description: `Demande ${String(check.request.trackingCode || check.request.access_token || "").slice(0, 8)} déjà enregistrée`,
              });
            } else {
              toast.error("Vérification terminée", {
                id: "network-pending",
                description: "Aucune demande retrouvée, vous pouvez réessayer.",
              });
            }
          } catch {
            toast.error("Vérification échouée", {
              id: "network-pending",
              description: "Veuillez réessayer ou vérifier votre suivi.",
            });
          }
          setErrors({
            submit: "Connexion interrompue. Vos informations ont été conservées. Vérification en cours...",
          });
          hasError = true;
          break;
        }

        // Parse API error for user-friendly message
        let userMessage = `Erreur pour "${item.nom}"`;
        if (errorMessage.includes("Quantité demandée") && errorMessage.includes("disponible")) {
          const match = errorMessage.match(/Quantité demandée \((\d+)\) > disponible \((\d+)\)/);
          if (match) {
            userMessage = `${item.nom} : seulement ${match[2]} disponible(s) pour cette période (vous avez demandé ${match[1]})`;
          } else {
            userMessage = `${item.nom} : quantité non disponible pour cette période`;
          }
        } else if (errorMessage.includes("400")) {
          userMessage = `${item.nom} : données invalides, vérifiez les champs`;
        } else if (errorMessage.includes("404")) {
          userMessage = `${item.nom} : article introuvable`;
        } else if (errorMessage.includes("500")) {
          userMessage = `${item.nom} : erreur serveur, réessayez plus tard`;
        } else {
          userMessage += ` : ${errorMessage}`;
        }
        setErrors({ submit: userMessage });
        toast.error(userMessage, {
          id: `booking-error-${item.id}`,
          description: "Veuillez modifier votre sélection ou vos dates",
        });
        hasError = true;
        break;
      }
    }

    setBusy(false);

    if (!hasError) {
      // Succès : nettoyer le brouillon (DRAFT -> PENDING)
      clearDraft(slug as string);
      // Store form data for sharing (use the `data` FormData created at start)
      const formDataObj: Record<string, string> = {};
      data.forEach((value, key) => {
        formDataObj[key] = String(value);
      });
      setSubmittedFormData(formDataObj);

      setResults(createdResults);
      setSent(true);
      clearSelection(); // Clear selection after successful submission
      // Persister pour le bouton "Suivre ma demande" (suivi local, sans compte)
      try {
        const existingRaw = localStorage.getItem(`dodome:requests:${slug}`);
        const existing = existingRaw ? (JSON.parse(existingRaw) as any[]) : [];
        const toStore = createdResults.map((r, i) => ({
          id: r.id,
          token: r.access_token,
          itemName: items[i]?.nom,
          createdAt: new Date().toISOString(),
        }));
        const merged = [...toStore, ...existing].filter(
          (v, idx, arr) => arr.findIndex((x) => x.id === v.id) === idx
        ).slice(0, 20);
        localStorage.setItem(`dodome:requests:${slug}`, JSON.stringify(merged));
        window.dispatchEvent(new Event("dodome:requests-updated"));
      } catch {}
      toast.success(`${createdResults.length} demande${createdResults.length > 1 ? "s" : ""} envoyée${createdResults.length > 1 ? "s" : ""}`, {
        id: "booking-success",
        description: "Vous pouvez maintenant partager les liens de suivi",
      });
      // Rafraîchir la mémoire active
      if (slug) refreshRequest(slug as string);
    } else if (hadNetworkError) {
      // Brouillon conservé, vérification déjà lancée via toast id "network-pending"
      if (slug) refreshRequest(slug as string);
    }
  }

  if (sent && results.length > 0) {
    const firstResult = results[0];
    const fd = submittedFormData || {};

    // Helper to format form data into readable text
    const formatFormData = () => {
      const lines = [
        `=== NOUVELLE DEMANDE DE LOCATION ===`,
        `Business: ${businessInfo?.nom || slug}`,
        `Date: ${new Date().toLocaleString("fr-FR")}`,
        ``,
        `--- ARTICLES (${results.length}) ---`,
      ];
      results.forEach((res, i) => {
        lines.push(`${i + 1}. N° ${res.id.slice(0, 8)} - Suivi: ${window.location.origin}/b/${slug}/booking-requests/${res.access_token}`);
      });
      lines.push(``, `--- INFORMATIONS CLIENT ---`);
      if (fd.clientNom) lines.push(`Nom: ${fd.clientNom}`);
      if (fd.clientEmail) lines.push(`Email: ${fd.clientEmail}`);
      if (fd.clientTelephone) lines.push(`Téléphone: ${fd.clientTelephone}`);
      if (fd.dateDebut && fd.dateFin) lines.push(`Période: ${fd.dateDebut} → ${fd.dateFin}`);
      if (fd.message) lines.push(`Message: ${fd.message}`);
      lines.push(``, `--- LIEU DE LIVRAISON ---`);
      if (fd.lieuNom) lines.push(`Lieu: ${fd.lieuNom}`);
      if (fd.lieuAdresse) lines.push(`Adresse: ${fd.lieuAdresse}`);
      if (fd.contactNom) lines.push(`Contact sur place: ${fd.contactNom}`);
      if (fd.contactTelephone) lines.push(`Téléphone contact: ${fd.contactTelephone}`);
      if (fd.notesLivraison) lines.push(`Notes livraison: ${fd.notesLivraison}`);
      lines.push(``, `--- PIÈCES JOINTES ---`);
      lines.push(`Liens de suivi:`);
      results.forEach((res, i) => {
        lines.push(`  ${i + 1}. ${window.location.origin}/b/${slug}/booking-requests/${res.access_token}`);
      });
      lines.push(``, `--- Envoyé via Dodome ---`);
      return lines.join("\n");
    };

    const fullMessage = formatFormData();

    // Build WhatsApp message
    const whatsappMessage = fullMessage;
    const whatsappUrl = businessInfo?.telephone
      ? `https://wa.me/${businessInfo.telephone.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    // Build Email
    const emailSubject = `Demande de location - ${businessInfo?.nom || slug}`;
    const emailBody = fullMessage;
    const mailtoUrl = businessInfo?.email
      ? `mailto:${businessInfo.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      : `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Log share action to backend
    const logShare = async (method: "whatsapp" | "email" | "copy") => {
      try {
        await fetch(`/api/b/${slug}/booking-requests/share-log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method,
            request_ids: results.map(r => r.id),
            form_data: fd,
            shared_at: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.warn("Share log failed:", e);
      }
    };

    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-5 px-5">
        <p className="font-mono text-xs uppercase tracking-[.2em] text-primary">Demande{results.length > 1 ? "s" : ""} envoyée{results.length > 1 ? "s" : ""}</p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Merci, {results.length} demande{results.length > 1 ? "s" : ""} bien envoyée{results.length > 1 ? "s" : ""}.
        </h1>
        <p className="leading-7 text-muted-foreground">
          Retrouvez l'évolution avec le{results.length > 1 ? "s" : ""} lien{results.length > 1 ? "s" : ""} de suivi ci-dessous.
        </p>
        <div className="flex flex-col gap-2">
          {results.map((res, i) => (
            <Link
              key={res.id}
              className="w-fit rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground"
              href={`/b/${slug}/booking-requests/${res.access_token}`}
            >
              {results.length > 1 ? `Demande ${i + 1} : ` : ""}Suivre (N° {res.id.slice(0, 8)})
            </Link>
          ))}
        </div>

        {/* Share options */}
        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Partager votre demande</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => logShare("whatsapp")}
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 font-semibold text-white transition hover:bg-green-600"
            >
              <MessageSquare className="size-4" />
              WhatsApp
            </a>
            <a
              href={mailtoUrl}
              onClick={() => logShare("email")}
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-600"
            >
              <Send className="size-4" />
              Email
            </a>
            <button
              onClick={async () => {
                const text = fullMessage;
                try {
                  await navigator.clipboard.writeText(text);
                  toast.success("Message complet copié !", {
                    description: "Vous pouvez le coller où vous voulez",
                  });
                  logShare("copy");
                } catch {
                  toast.error("Impossible de copier", {
                    description: "Essayez de sélectionner et copier manuellement",
                  });
                }
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-semibold transition hover:bg-muted"
            >
              <Share2 className="size-4" />
              Copier tout
            </button>
          </div>
        </div>

        <Link href={`/b/${slug}`} className="mt-4 text-sm underline">
          Retour au catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-16">
      <Link href={`/b/${slug}`} className="text-sm underline">Retour au catalogue</Link>

      <p className="mt-14 font-mono text-xs uppercase tracking-[.2em] text-primary">
        {items.length > 1 ? "Vos sélections" : "Une première étape simple"}
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-.05em]">
        {items.length > 1 ? "Vos articles sélectionnés" : "Parlons de votre projet."}
      </h1>

      {/* Mémoire : demande active détectée (source backend) */}
      {hasActiveRequest && activeRequest && showActiveBanner && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-white p-4 shadow-sm dark:border-amber-800 dark:bg-amber-950/40">
          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
              <AlertCircle className="size-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-amber-100">Vous avez déjà une demande en cours</p>
              <p className="mt-1 text-sm font-medium text-slate-700 dark:text-amber-200">
                Demande <span className="font-mono font-medium">{String(activeRequest.trackingCode || activeRequest.access_token || "").slice(0, 8)}</span> •{" "}
                {activeRequest.statut_display || activeRequest.statut} • {activeRequest.item_nom}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/b/${slug}/booking-requests/${activeRequest.trackingCode || activeRequest.access_token}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                >
                  <CheckCircle className="size-4" /> Voir le suivi
                </Link>
                <button
                  onClick={() => setShowActiveBanner(false)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
                >
                  Continuer quand même
                </button>
                <Link
                  href={`/b/${slug}/suivi`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-amber-200"
                >
                  Retrouver ma demande
                </Link>
              </div>
            </div>
            <button onClick={() => setShowActiveBanner(false)} className="shrink-0 text-slate-400 hover:text-slate-600 dark:text-amber-300">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Brouillon retrouvé */}
      {draftLoaded && !hasActiveRequest && (() => { const d = loadDraft(slug as string); return d && d.items.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-blue-300 bg-white p-4 shadow-sm dark:border-blue-800 dark:bg-blue-950/40">
          <p className="text-sm font-semibold text-slate-900 dark:text-blue-100">Brouillon retrouvé</p>
          <p className="mt-1 text-sm font-medium text-slate-700 dark:text-blue-200">
            Nous avons retrouvé votre demande en cours ({d.items.length} article{d.items.length>1?"s":""} • {d.dates.from && d.dates.to ? `${d.dates.from} → ${d.dates.to}` : "dates non définies"} • Dernière modif {new Date(d.updatedAt).toLocaleString("fr-FR")}).
          </p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => window.location.reload()} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Reprendre</button>
            <button onClick={() => { clearDraft(slug as string); window.location.reload(); }} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-200">Recommencer</button>
          </div>
        </div>
      ) : null; })()}

      {/* Selected items summary */}
      {items.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {items.length} article{items.length > 1 ? "s" : ""} sélectionné{items.length > 1 ? "s" : ""} ({totalItems} au total)
          </h2>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
            >
              <div className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                {item.photo_url ? (
                  <img src={item.photo_url} alt={item.nom} className="object-cover h-full w-full" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.nom}</p>
                <p className="text-sm text-muted-foreground">
                  Quantité : <span className="font-semibold text-foreground">{getItemQuantity(item.id)}</span> {item.unite}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 text-destructive transition hover:bg-destructive/20"
                aria-label={`Retirer ${item.nom}`}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center">
          <Package className="mx-auto size-12 text-muted-foreground/30" />
          <p className="mt-4 text-lg font-medium">Aucun article sélectionné</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Retournez au catalogue et ajoutez des articles à votre sélection.
          </p>
          <Link
            href={`/b/${slug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
          >
            <ArrowRight className="size-4" />
            Aller au catalogue
          </Link>
        </div>
      )}
      
      <form onSubmit={submitAll} className="mt-10 flex flex-col gap-5">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Vos informations</h2>
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                <User className="size-4 text-muted-foreground" /> Nom complet *
              </label>
              <input name="clientNom" required placeholder="Jean Dupont" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm" />
              {errors.clientNom && <p className="mt-1 text-xs text-destructive">{errors.clientNom}</p>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <Mail className="size-4 text-muted-foreground" /> Email *
                </label>
                <input name="clientEmail" type="email" required placeholder="votremail@domain.com" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm" />
                {errors.clientEmail && <p className="mt-1 text-xs text-destructive">{errors.clientEmail}</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <Phone className="size-4 text-muted-foreground" /> Téléphone
                </label>
                <input name="clientTelephone" type="tel" placeholder="+228 90 12 34 56" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Dates & quantité (appliquée à tous les articles)</h2>
          <div>
            <label htmlFor="booking-date-range" className="flex items-center gap-2 text-sm font-medium mb-1.5">
              <CalendarIcon className="size-4 text-muted-foreground" /> Période de location *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="booking-date-range"
                  variant="outline"
                  className={cn(
                    "h-auto w-full justify-start rounded-xl border-input bg-background px-4 py-3 text-left font-normal hover:bg-background",
                    !dateDebut && !dateFin && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
                  {dateDebut && dateFin ? (
                    <span>
                      {format(new Date(dateDebut + "T12:00:00"), "d MMM yyyy", { locale: fr })} –{" "}
                      {format(new Date(dateFin + "T12:00:00"), "d MMM yyyy", { locale: fr })}
                    </span>
                  ) : dateDebut ? (
                    <span>{format(new Date(dateDebut + "T12:00:00"), "d MMM yyyy", { locale: fr })} – …</span>
                  ) : (
                    <span>Sélectionnez vos dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: dateDebut ? new Date(dateDebut + "T12:00:00") : undefined,
                    to: dateFin ? new Date(dateFin + "T12:00:00") : undefined,
                  }}
                  onSelect={(range: DateRange | undefined) => {
                    const fromStr = range?.from ? format(range.from, "yyyy-MM-dd") : "";
                    const toStr = range?.to ? format(range.to, "yyyy-MM-dd") : "";
                    if (fromStr && !toStr) {
                      setDateDebut(fromStr);
                      setDateFin("");
                      return;
                    }
                    setDateDebut(fromStr);
                    setDateFin(toStr);
                  }}
                  disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                  numberOfMonths={2}
                  locale={fr}
                />
                <div className="flex items-center justify-between border-t border-border p-2">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { const t = format(new Date(), "yyyy-MM-dd"); setDateDebut(t); setDateFin(t); }}>Aujourd'hui</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { const d = new Date(); d.setDate(d.getDate()+1); const t=format(d,"yyyy-MM-dd"); setDateDebut(t); setDateFin(t);}}>Demain</Button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setDateDebut(""); setDateFin(""); }}>Effacer</Button>
                </div>
              </PopoverContent>
            </Popover>
            {/* Hidden inputs for FormData */}
            <input type="hidden" name="dateDebut" value={dateDebut} />
            <input type="hidden" name="dateFin" value={dateFin} />
            {(errors.dateDebut || errors.dateFin) && (
              <p className="mt-1 text-xs text-destructive">{errors.dateDebut || errors.dateFin}</p>
            )}
            {dateDebut && dateFin && new Date(dateFin) < new Date(dateDebut) && (
              <p className="mt-1 text-xs text-destructive">La date de fin doit être après la date de début.</p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            La quantité est définie individuellement pour chaque article dans votre sélection ci-dessus.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Lieu de livraison</h2>
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                <MapPin className="size-4 text-muted-foreground" /> Nom du lieu
              </label>
              <input name="lieuNom" placeholder="Salle des Fêtes, Centre culturel..." className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Adresse</label>
              <input name="lieuAdresse" placeholder="15 Rue de la Paix, 69001 Lyon" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Contact sur place</label>
                <input name="contactNom" placeholder="Nom du contact" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Téléphone contact</label>
                <input name="contactTelephone" type="tel" placeholder="+228 90 12 34 56" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Notes livraison</label>
              <textarea name="notesLivraison" rows={2} placeholder="Étage, ascenseur, horaires préférés..." className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm" />
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
            <MessageSquare className="size-4 text-muted-foreground" /> Message (optionnel)
          </label>
          <textarea name="message" rows={4} placeholder="Décrivez votre projet, vos contraintes, vos préférences..." className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm" />
        </div>

        {errors.submit && (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{errors.submit}</p>
        )}

        <button disabled={busy || items.length === 0} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition disabled:opacity-60 disabled:cursor-not-allowed" title={items.length === 0 ? "Sélectionnez au moins un article" : ""}>
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Envoi ({currentIndex + 1}/{items.length})...</span>
            </>
          ) : items.length > 1 ? (
            <>
              Envoyer mes {items.length} demandes
              <ArrowRight className="size-4" />
            </>
          ) : (
            <>
              Envoyer ma demande
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
        <p className="text-xs text-muted-foreground text-center">
          Votre demande sera transmise au professionnel. Vous recevrez une réponse sous 24h.
        </p>
      </form>
    </main>
  );
}