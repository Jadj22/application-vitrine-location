"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Plus, Check, Loader2, ArrowRight } from "lucide-react";
import { publicRecommendations } from "@/lib/api";
import type { ItemRecommendation } from "@/lib/api";
import { Price } from "@/components/ui/price";
import { useSelection } from "@/lib/selection-context";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  itemId: string;
};

export default function ItemRecommendations({ slug, itemId }: Props) {
  const [tab, setTab] = useState<"complementary" | "similar">("complementary");
  const [complementaryItems, setComplementaryItems] = useState<ItemRecommendation[]>([]);
  const [similarItems, setSimilarItems] = useState<ItemRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, isItemSelected, getItemQuantity, updateQuantity } = useSelection();

  useEffect(() => {
    let isMounted = true;
    async function loadRecs() {
      setLoading(true);
      try {
        const [compRes, simRes] = await Promise.all([
          publicRecommendations.get(slug, itemId, { type: "complementary", limit: 4 }).catch(() => null),
          publicRecommendations.get(slug, itemId, { type: "similar", limit: 4 }).catch(() => null),
        ]);

        if (isMounted) {
          if (compRes?.recommendations) {
            setComplementaryItems(compRes.recommendations);
          }
          if (simRes?.recommendations) {
            setSimilarItems(simRes.recommendations);
          }
        }
      } catch (err) {
        console.error("Failed to load item recommendations", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRecs();
    return () => {
      isMounted = false;
    };
  }, [slug, itemId]);

  const activeItems = tab === "complementary" ? complementaryItems : similarItems;

  if (!loading && complementaryItems.length === 0 && similarItems.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-border/70 pt-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-primary">
            <Sparkles className="size-3.5" />
            Recommandations
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {tab === "complementary" ? "Pour compléter votre événement" : "Articles similaires"}
          </h2>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded-full border border-border bg-muted/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setTab("complementary")}
            className={cn(
              "rounded-full px-4 py-1.5 font-medium transition",
              tab === "complementary"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Articles complémentaires
          </button>
          <button
            type="button"
            onClick={() => setTab("similar")}
            className={cn(
              "rounded-full px-4 py-1.5 font-medium transition",
              tab === "similar"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Similaires
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : activeItems.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Aucun article correspondant dans cette section.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activeItems.map((rec) => {
            const isSelected = isItemSelected(rec.id);
            const qty = getItemQuantity(rec.id);

            return (
              <div
                key={rec.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div>
                  <Link
                    href={`/b/${slug}/items/${rec.id}`}
                    className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted"
                  >
                    {rec.photo_url ? (
                      <img
                        src={rec.photo_url}
                        alt={rec.nom}
                        className="size-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-4xl text-muted-foreground/30">
                        📦
                      </div>
                    )}
                  </Link>

                  <div className="mt-3.5 space-y-1">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {rec.category_nom || "Catalogue"}
                    </p>
                    <Link
                      href={`/b/${slug}/items/${rec.id}`}
                      className="line-clamp-1 font-semibold text-foreground transition hover:text-primary"
                    >
                      {rec.nom}
                    </Link>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                  <Price amount={rec.prix} unit={rec.unite} size="sm" />

                  {isSelected ? (
                    <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                      <button
                        type="button"
                        onClick={() => updateQuantity(rec.id, qty - 1)}
                        className="size-5 rounded-full text-center hover:bg-primary/20"
                      >
                        -
                      </button>
                      <span>{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(rec.id, qty + 1)}
                        className="size-5 rounded-full text-center hover:bg-primary/20"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          id: rec.id,
                          nom: rec.nom,
                          prix: rec.prix,
                          unite: rec.unite,
                          category_nom: rec.category_nom,
                          photo_url: rec.photo_url,
                        })
                      }
                      className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90"
                      title="Ajouter à la sélection"
                      aria-label="Ajouter"
                    >
                      <Plus className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
