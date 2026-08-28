import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { catalog } from "@/lib/api";
import { Price } from "@/components/ui/price";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const items = await catalog.list(slug);
  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-24">
        <h1 className="text-4xl font-semibold">Article introuvable</h1>
      </main>
    );
  }

  const features = Object.entries(item.characteristics || {})
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => ({
      key: k,
      value: String(v),
    }));

  const isAvailable = item.statut === "ACTIF" && item.is_published;

  return (
    <main>
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link
            href={`/b/${slug}`}
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Retour au catalogue
          </Link>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
          >
            <Share2 className="size-4" />
            Partager
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:py-20">
        {/* Image */}
        <div className="space-y-3">
          {item.photo_url ? (
            <img
              src={item.photo_url}
              alt={item.nom}
              className="aspect-square w-full rounded-3xl object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-muted text-6xl text-muted-foreground/30">
              📦
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="flex flex-col justify-center gap-6">
          {/* Title */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-primary">
              {item.category_nom ?? "Sans catégorie"}
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
              {item.nom}
            </h1>

            {item.reference && (
              <p className="mt-2 text-sm text-muted-foreground">
                Réf : {item.reference}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <Price amount={item.prix} unit={item.unite} size="lg" />

            <p className="mt-1 text-sm text-muted-foreground">
              Prix pour la durée indiquée
            </p>
          </div>

          {/* Description */}
          {(item.public_description?.trim() || item.description?.trim()) && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h3>

              <p className="text-base leading-7 text-foreground break-words whitespace-pre-line">
                {item.public_description?.trim() || item.description}
              </p>
            </div>
          )}

          {/* Characteristics */}
          {features.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Caractéristiques
              </h2>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {features.map((feat) => (
                  <div
                    key={feat.key}
                    className="min-w-0 rounded-xl border border-border bg-muted/50 px-4 py-2.5"
                  >
                    <p className="text-xs text-muted-foreground capitalize">
                      {feat.key
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </p>

                    <p className="break-words font-medium">
                      {feat.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Availability */}
          <div className="flex items-center gap-3 text-sm">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium ${
                isAvailable
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  isAvailable
                    ? "bg-emerald-500"
                    : "bg-muted-foreground/30"
                }`}
              />

              {isAvailable ? "Disponible" : "Indisponible"}
            </span>
          </div>

          {/* Booking */}
          <div className="border-t border-border pt-6">
            <Link
              href={`/b/${slug}/booking-requests/new?item=${item.id}`}
              className="inline-flex rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Faire une demande
            </Link>

            <p className="mt-3 text-xs text-muted-foreground">
              Envoi de la demande au professionnel · Confirmation sous 24h
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}