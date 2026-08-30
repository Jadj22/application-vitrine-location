"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Calendar as CalendarIcon, Loader2, Package, Search, Plus, Check, Sparkles } from "lucide-react";
import { catalog, publicSearch } from "@/lib/api";
import type { PublicItem, CatalogAvailability, SearchIntentMetadata } from "@/lib/api";
import SmartSearchBar from "@/components/catalog/SmartSearchBar";
import { useSelection } from "@/lib/selection-context";
import { Price } from "@/components/ui/price";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { saveDraft, loadDraft } from "@/lib/draft";

// Validation stricte YYYY-MM-DD — évite Invalid Date côté client
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function isValidDateString(s: unknown): s is string {
  if (typeof s !== "string" || !DATE_RE.test(s)) return false;
  const d = new Date(s + "T12:00:00");
  if (Number.isNaN(d.getTime())) return false;
  // Re-format pour rejeter 2026-02-30 -> 2026-03-02
  try {
    return format(d, "yyyy-MM-dd") === s;
  } catch {
    return false;
  }
}
function parseDateSafe(s: string): Date | null {
  if (!isValidDateString(s)) return null;
  const d = new Date(s + "T12:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}
function parseDateSafeMidnight(s: string): Date | null {
  if (!isValidDateString(s)) return null;
  const d = new Date(s + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

type Props = {
  slug: string;
  initialItems: PublicItem[];
  categories: string[];
};

export default function CatalogWithAvailability({ slug, initialItems, categories }: Props) {
  const [items, setItems] = useState<CatalogAvailability[]>(() =>
    initialItems.map((i) => ({ ...i, total_stock: 0, disponible: 0, peut_reserver: false, reserves_pendant_periode: 0, booking_requests_pendantes: 0, en_entretien: 0, en_stock_physique: 0 }))
  );
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [smartMetadata, setSmartMetadata] = useState<SearchIntentMetadata | null>(null);
  const [smartReasonsMap, setSmartReasonsMap] = useState<Record<string, string[]>>({});
  const [isSmartSearching, setIsSmartSearching] = useState(false);
  const { addItem, isItemSelected, getItemQuantity, updateQuantity, totalItems, setIsOpen } = useSelection();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Init depuis URL ?category=xxx (partageable) et écoute des tuiles catégories
  useEffect(() => {
    const fromUrl = searchParams.get("category");
    if (fromUrl && categories.includes(fromUrl) && fromUrl !== activeCategory) {
      setActiveCategory(fromUrl);
    }
  }, [searchParams, categories]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail && categories.includes(detail)) {
        setActiveCategory(detail);
      }
    };
    window.addEventListener("select-category", handler as EventListener);
    return () => window.removeEventListener("select-category", handler as EventListener);
  }, [categories]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const current = url.searchParams.get("category");
    if (activeCategory) {
      if (current !== activeCategory) {
        url.searchParams.set("category", activeCategory);
        window.history.replaceState({}, "", url.toString());
      }
    } else if (current) {
      url.searchParams.delete("category");
      window.history.replaceState({}, "", url.toString());
    }
  }, [activeCategory]);

  // Draft: restaurer dates au chargement et sauvegarder à chaque changement (retour arrière, reload)
  useEffect(() => {
    const draft = loadDraft(slug);
    if (draft?.dates?.from && !dateDebut && isValidDateString(draft.dates.from)) setDateDebut(draft.dates.from);
    if (draft?.dates?.to && !dateFin && isValidDateString(draft.dates.to)) setDateFin(draft.dates.to);
  }, [slug]);

  useEffect(() => {
    if (!dateDebut && !dateFin) return;
    if (dateDebut && !isValidDateString(dateDebut)) return;
    if (dateFin && !isValidDateString(dateFin)) return;
    saveDraft(slug, { dates: { from: dateDebut, to: dateFin } });
  }, [slug, dateDebut, dateFin]);

  const fetchAvailability = useCallback(async () => {
    // Cas vide / partiel : reset sans erreur
    if (!dateDebut || !dateFin) {
      setItems(initialItems.map((i) => ({ ...i, total_stock: 0, disponible: 0, peut_reserver: false, reserves_pendant_periode: 0, booking_requests_pendantes: 0, en_entretien: 0, en_stock_physique: 0 })));
      setAvailabilityError(null);
      return;
    }
    // Validation stricte avant construction Date / appel API
    if (!isValidDateString(dateDebut) || !isValidDateString(dateFin)) {
      setAvailabilityError("Dates invalides");
      setItems(initialItems.map((i) => ({ ...i, total_stock: 0, disponible: 0, peut_reserver: false, reserves_pendant_periode: 0, booking_requests_pendantes: 0, en_entretien: 0, en_stock_physique: 0 })));
      return;
    }
    const start = parseDateSafe(dateDebut)!;
    const end = parseDateSafe(dateFin)!;
    if (end.getTime() < start.getTime()) {
      setAvailabilityError("La date de fin doit être après la date de début.");
      setItems(initialItems.map((i) => ({ ...i, total_stock: 0, disponible: 0, peut_reserver: false, reserves_pendant_periode: 0, booking_requests_pendantes: 0, en_entretien: 0, en_stock_physique: 0 })));
      return;
    }

    setLoading(true);
    setAvailabilityError(null);
    try {
      const data = await catalog.availability(slug, dateDebut, dateFin);
      setItems(data);
    } catch (e) {
      console.error("[availability] fetch failed", e);
      setAvailabilityError(e instanceof Error ? e.message : "Erreur de disponibilité");
      // Garde les données précédentes + erreur visible (pas de reset silencieux vers initialItems)
      // Si aucune donnée précédente, items garde l'état initial (zéros)
    }
    setLoading(false);
  }, [slug, dateDebut, dateFin, initialItems]);

  useEffect(() => {
    if (dateDebut && dateFin) {
      fetchAvailability();
    }
  }, [dateDebut, dateFin, fetchAvailability]);

  // Smart Search backend fetch avec debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSmartMetadata(null);
      setSmartReasonsMap({});
      return;
    }

    const timer = setTimeout(async () => {
      setIsSmartSearching(true);
      try {
        const res = await publicSearch.search(slug, searchQuery, {
          dateDebut: dateDebut || undefined,
          dateFin: dateFin || undefined,
          category: activeCategory || undefined,
        });

        if (res) {
          setSmartMetadata(res.metadata || null);
          const reasonsMap: Record<string, string[]> = {};
          res.results.forEach((r) => {
            if (r.match_reasons && r.match_reasons.length > 0) {
              reasonsMap[r.id] = r.match_reasons;
            }
          });
          setSmartReasonsMap(reasonsMap);

          if (res.results && res.results.length > 0) {
            const returnedIds = new Set(res.results.map((r) => r.id));
            const smartList: CatalogAvailability[] = res.results.map((r) => ({
              ...r,
              total_stock: r.total_stock ?? 0,
              disponible: r.disponible ?? (r.peut_reserver ? 1 : 0),
              peut_reserver: r.peut_reserver ?? (r.statut === "ACTIF"),
              reserves_pendant_periode: r.reserves_pendant_periode ?? 0,
              booking_requests_pendantes: r.booking_requests_pendantes ?? 0,
              en_entretien: r.en_entretien ?? 0,
              en_stock_physique: r.total_stock ?? 0,
            }));

            setItems((prev) => {
              const remaining = prev.filter((i) => !returnedIds.has(i.id));
              return [...smartList, ...remaining];
            });
          }
        }
      } catch (err) {
        console.error("Smart search error:", err);
      } finally {
        setIsSmartSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, slug, dateDebut, dateFin, activeCategory]);

  const filteredItems = items.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hasDirectMatch = `${item.nom} ${item.public_description} ${item.category_nom ?? ""}`.toLowerCase().includes(q);
      const hasSmartMatch = Boolean(smartReasonsMap[item.id]);
      if (!hasDirectMatch && !hasSmartMatch) {
        return false;
      }
    }
    if (activeCategory && item.category_nom !== activeCategory) {
      return false;
    }
    return true;
  });

  // Pagination intelligente : côté client, reset auto sur filtres + transition fluide
  const PAGE_SIZE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const startIndex = filteredItems.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredItems.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, dateDebut, dateFin, items.length]);

  const goToPage = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    if (next === currentPage || isTransitioning) return;
    setIsTransitioning(true);
    window.setTimeout(() => {
      setCurrentPage(next);
      setIsTransitioning(false);
      document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 3) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const handleAddToSelection = (item: PublicItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
  };

  const handleQuantityChange = (itemId: string, delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQty = getItemQuantity(itemId);
    updateQuantity(itemId, currentQty + delta);
  };

  return (
    <>
      {/* Selection indicator */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-xl hover:bg-primary/90 transition"
          >
            <Package className="size-5" />
            <span>Sélection ({totalItems})</span>
          </button>
        </div>
      )}

  {/* Date picker */}
  <div className="rounded-2xl border border-border bg-card p-5">
    {/* Header */}
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <CalendarIcon className="size-5 text-primary" />
      </div>

      <div>
        <p className="font-semibold">Vérifier la disponibilité</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Choisissez votre période de location
        </p>
      </div>
    </div>

    {/* Dates — Popover Calendar range */}
    <div className="mt-5">
      <label htmlFor="date-range" className="mb-1.5 block text-sm font-medium">
        Période de location
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-range"
            variant="outline"
            className={cn(
              "h-auto w-full justify-start rounded-xl border-input bg-background px-4 py-3 text-left font-normal hover:bg-background",
              !dateDebut && !dateFin && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
            {(() => {
              const start = parseDateSafe(dateDebut);
              const end = parseDateSafe(dateFin);
              if (start && end) {
                return (
                  <span>
                    {format(start, "d MMM yyyy", { locale: fr })} –{" "}
                    {format(end, "d MMM yyyy", { locale: fr })}
                  </span>
                );
              }
              if (start) {
                return <span>{format(start, "d MMM yyyy", { locale: fr })} – …</span>;
              }
              return <span>Sélectionnez vos dates</span>;
            })()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: parseDateSafe(dateDebut) ?? undefined,
              to: parseDateSafe(dateFin) ?? undefined,
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
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  const today = format(new Date(), "yyyy-MM-dd");
                  setDateDebut(today);
                  setDateFin(today);
                }}
              >
                Aujourd'hui
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const t = format(tomorrow, "yyyy-MM-dd");
                  setDateDebut(t);
                  setDateFin(t);
                }}
              >
                Demain
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                setDateDebut("");
                setDateFin("");
              }}
            >
              Effacer
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {(() => {
        if (!isValidDateString(dateDebut) || !isValidDateString(dateFin)) return null;
        const start = parseDateSafe(dateDebut)!;
        const end = parseDateSafe(dateFin)!;
        if (end.getTime() < start.getTime()) {
          return <p className="mt-2 text-sm text-destructive">La date de fin doit être après la date de début.</p>;
        }
        return null;
      })()}
      {!dateDebut && !dateFin && (
        <p className="mt-1.5 text-xs text-muted-foreground">Sélectionnez d'abord la période pour vérifier la disponibilité</p>
      )}
    </div>

    {/* Résumé de la période */}
    {isValidDateString(dateDebut) && isValidDateString(dateFin) && (() => {
      const start = parseDateSafeMidnight(dateDebut);
      const end = parseDateSafeMidnight(dateFin);
      if (!start || !end || end.getTime() < start.getTime()) return null;
      return (
        <div className="mt-4 rounded-xl bg-muted/50 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Période :</span>{" "}
              <span className="font-medium">
                {start.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {" → "}
              <span className="font-medium">
                {end.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            {(() => {
              const duration =
                Math.round(
                  (end.getTime() - start.getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1;
              if (!Number.isFinite(duration) || duration < 1) return null;
              return (
                <span className="rounded-full bg-background px-3 py-1 text-xs font-medium">
                  {duration} jour{duration > 1 ? "s" : ""}
                </span>
              );
            })()}
        </div>
      </div>
    );
  })()}

    {/* Disponibilité */}
    {dateDebut && dateFin && (
      <div className="mt-3 flex items-center gap-2 text-sm">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin text-primary" />
            <span className="text-muted-foreground">
              Vérification de la disponibilité...
            </span>
          </>
        ) : availabilityError ? (
          <>
            <span className="size-2 shrink-0 rounded-full bg-red-500" />
            <span className="text-destructive text-sm">
              Erreur: {availabilityError} — vérifiez la console réseau. Les badges &quot;Indisponible&quot; peuvent être faux.
            </span>
          </>
        ) : (
          <>
            <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">
              <strong className="font-semibold text-foreground">
                {filteredItems.filter((i) => i.peut_reserver).length}
              </strong>{" "}
              article
              {filteredItems.filter((i) => i.peut_reserver).length !== 1
                ? "s"
                : ""}{" "}
              disponible
              {filteredItems.filter((i) => i.peut_reserver).length !== 1
                ? "s"
                : ""}{" "}
              sur {filteredItems.length}
            </span>
          </>
        )}
      </div>
    )}
  </div>

      {/* Smart Search Bar */}
      <div className="w-full mt-6">
        <SmartSearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          metadata={smartMetadata}
          loading={isSmartSearching}
          onClear={() => {
            setSearchQuery("");
            setSmartMetadata(null);
            setSmartReasonsMap({});
          }}
        />
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition ${
              activeCategory === null
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-background hover:border-primary hover:bg-card"
            }`}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background hover:border-primary hover:bg-card"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Résumé pagination intelligente */}
      {filteredItems.length > 0 && (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de <span className="font-medium text-foreground">{startIndex}</span> à{" "}
            <span className="font-medium text-foreground">{endIndex}</span> sur{" "}
            <span className="font-medium text-foreground">{filteredItems.length}</span> article{filteredItems.length > 1 ? "s" : ""}
            {activeCategory || searchQuery ? " (filtrés)" : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            Page {currentPage} sur {totalPages} • {PAGE_SIZE} par page
          </p>
        </div>
      )}

      {/* Product grid — transition fluide avec apparition stagger des cards */}
      <div
        key={currentPage}
        aria-busy={isTransitioning}
        className={`mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300 ease-out will-change-transform ${
          isTransitioning
            ? "opacity-0 translate-y-3 scale-[0.98] blur-[1px]"
            : "opacity-100 translate-y-0 scale-100 blur-0"
        }`}
      >
        {paginatedItems.map((item, idx) => {
          const selected = isItemSelected(item.id);
          const qty = getItemQuantity(item.id);
          const canReserve = dateDebut && dateFin && item.peut_reserver;

          return (
            <div
              key={item.id}
              style={{ animationDelay: `${idx * 35}ms`, animationFillMode: "both" } as React.CSSProperties}
              className="group overflow-hidden rounded-[1.75rem] border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <Link
                href={`/b/${slug}/items/${item.id}`}
                className="block"
                onClick={(e) => {
                  if (selected) e.preventDefault();
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {item.photo_url ? (
                    <Image
                      src={item.photo_url}
                      alt={item.nom}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-muted-foreground/30">📦</div>
                  )}

                  {/* Availability badge */}
                  {dateDebut && dateFin ? (
                    item.peut_reserver ? (
                      <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        {item.disponible} disponible{item.disponible > 1 ? "s" : ""}
                      </div>
                    ) : (
                      <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        Indisponible
                      </div>
                    )
                  ) : (
                    <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur">
                      {item.statut === "ACTIF" ? "Disponible" : "Indisponible"}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    {item.category_nom ?? "Sans catégorie"}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{item.nom}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {item.public_description}
                  </p>

                  {/* Smart Search Match Reasons */}
                  {smartReasonsMap[item.id] && smartReasonsMap[item.id].length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {smartReasonsMap[item.id].slice(0, 2).map((reason, rIdx) => (
                        <span
                          key={rIdx}
                          className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                        >
                          <Sparkles className="size-2.5" />
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <Price amount={item.prix} unit={item.unite} />
                    </div>

                    {/* Availability detail */}
                    {dateDebut && dateFin && item.total_stock > 0 && (
                      <div className="text-xs text-muted-foreground text-right">
                        <span className="text-emerald-600 font-medium">{item.disponible}</span> / {item.total_stock}
                      </div>
                    )}

                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Selection controls */}
              {dateDebut && dateFin && (
                <div className="border-t border-border p-4 bg-background/50">
                  {selected ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleQuantityChange(item.id, -1, e)}
                        disabled={qty <= 1}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium transition disabled:opacity-50 hover:bg-muted"
                      >
                        <span className="text-xl">−</span>
                      </button>
                      <span className="w-10 text-center font-semibold">{qty}</span>
                      <button
                        onClick={(e) => handleQuantityChange(item.id, 1, e)}
                        disabled={item.disponible && qty >= item.disponible ? true : false}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium transition disabled:opacity-50 hover:bg-muted"
                      >
                        <span className="text-xl">+</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Find the item in selectedItems and remove it
                          // This is handled by the context's removeItem
                        }}
                        className="ml-auto inline-flex size-9 items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 text-destructive transition hover:bg-destructive/20"
                        title="Retirer de la sélection"
                      >
                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleAddToSelection(item, e)}
                      disabled={!canReserve}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
                    >
                      <Plus className="size-4" />
                      <span>Ajouter à la sélection</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination intelligente */}
      {totalPages > 1 && filteredItems.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} article{filteredItems.length > 1 ? "s" : ""} • {totalPages} pages
          </p>
          <nav className="flex items-center gap-1" aria-label="Pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium transition hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Page précédente"
            >
              <ArrowRight className="size-4 rotate-180" />
            </button>
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p as number)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                    currentPage === p
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-background hover:bg-muted"
                  }`}
                  aria-label={`Page ${p}`}
                  aria-current={currentPage === p ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium transition hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Page suivante"
            >
              <ArrowRight className="size-4" />
            </button>
          </nav>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <Package className="mx-auto size-12 text-muted-foreground/30" />
          <p className="mt-4 text-lg font-medium">Aucun article trouvé</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery || activeCategory
              ? "Essayez de modifier vos filtres."
              : "Revenez bientôt pour découvrir le catalogue."}
          </p>
        </div>
      )}
    </>
  );
}