import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Share2,
  Sparkles,
  Package,
} from "lucide-react";
import type { Metadata } from "next";

import { publicBusiness, catalog, publicCategories } from "@/lib/api";
import CatalogWithAvailability from "@/components/catalog/CatalogWithAvailability";
import StoreBusinessSlug from "@/components/catalog/StoreBusinessSlug";
import SelectionPanel from "@/components/catalog/SelectionPanel";
import CategoryTile from "@/components/catalog/CategoryTile";
import RecentRequestsBanner from "@/components/catalog/RecentRequestsBanner";
import ActiveRequestBanner from "@/components/catalog/ActiveRequestBanner";
import DraftBanner from "@/components/catalog/DraftBanner";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await publicBusiness.get(slug).catch(() => null);

  if (!business) {
    return {
      title: "Vitrine introuvable",
      description: "Cette vitrine n'est plus disponible.",
    };
  }

  return {
    title: `${business.nom} — Catalogue`,
    description: `Découvrez le catalogue de ${business.nom} et trouvez les articles adaptés à votre besoin.`,
    openGraph: {
      title: `${business.nom} — Catalogue`,
      description: `Découvrez les articles proposés par ${business.nom}.`,
      type: "website",
    },
  };
}

const categoryImages: Record<string, string> = {
  mobilier:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85",
  tables:
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85",
  chaises:
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=85",
  éclairage:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85",
  decoration:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
  décoration:
    "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=85",
  accessoires:
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85",
  événementiel:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85",
  tentes:
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=85",
};

function normalizeCategory(category: string) {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getCategoryImage(category: string) {
  const normalized = normalizeCategory(category);
  return (
    categoryImages[normalized] ||
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
  );
}

export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;

  const business = await publicBusiness.get(slug).catch(() => null);

  if (!business) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-lg text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            404
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Cette entreprise n&apos;est plus disponible.
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            La vitrine que vous recherchez n&apos;existe pas ou n&apos;est plus accessible.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Retour à l&apos;accueil
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  const [catalogItems, apiCategories] = await Promise.all([
    catalog.list(slug),
    publicCategories.list(slug).catch(() => []),
  ]);

  // Catégories réelles avec leur image dédiée (jamais d'image d'article)
  const apiCategoryMap = new Map(
    apiCategories.map((c) => [c.nom, c.image_url] as const)
  );

  // Noms des catégories : priorité aux vraies catégories backend, fallback items
  const categories =
    apiCategories.length > 0
      ? apiCategories.map((c) => c.nom)
      : ([...new Set(catalogItems.map((i) => i.category_nom).filter(Boolean))] as string[]);

  function getCategoryImageLocal(category: string) {
    const fromApi = apiCategoryMap.get(category);
    if (fromApi) return fromApi;
    const normalized = normalizeCategory(category);
    return (
      categoryImages[normalized] ||
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
    );
  }

  const displayName = business.public_name || business.nom;

  return (
      <>
        <StoreBusinessSlug slug={slug} />
        <main className="min-h-screen bg-background">
          <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
              <Link href="/" className="font-mono text-lg font-bold tracking-tight">
                {displayName}<span className="text-primary">.</span>
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  href={`/b/${slug}/suivi`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  <Package className="size-4" />
                  <span className="hidden sm:inline">Suivre ma demande</span>
                  <span className="sm:hidden">Suivi</span>
                </Link>
                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted">
                  <Share2 className="size-4" />
                  <span className="hidden sm:inline">Partager</span>
                </button>
              </div>
            </div>
          </header>

          <section className="relative overflow-hidden border-b border-border">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--primary)/0.12),transparent_35%)]" />
            <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:px-8 lg:pb-24 lg:pt-24">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-2 rounded-full bg-primary" />
                Catalogue public
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.055em] sm:text-6xl lg:text-8xl">
                {displayName}
              </h1>
              <div className="mt-8 flex flex-wrap gap-3">
                {business.adresse && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
                    <MapPin className="size-4 text-primary" />
                    {business.adresse}
                  </span>
                )}
                {business.telephone && (
                  <a href={`tel:${business.telephone}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:border-primary">
                    <Phone className="size-4 text-primary" />
                    Contacter
                  </a>
                )}
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="max-w-sm rounded-3xl border border-border bg-card/80 p-6 shadow-xl">
                <Sparkles className="size-6 text-primary" />
                <p className="mt-5 text-2xl font-semibold leading-8">
                  Trouvez ce qu&apos;il vous faut pour votre prestation.
                </p>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Explorez les articles disponibles et découvrez ceux qui peuvent parfaitement accompagner votre projet.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RecentRequestsBanner slug={slug} />
        <ActiveRequestBanner slug={slug} />
        <DraftBanner slug={slug} />

        {categories.length > 0 && (
          <section id="categories" className="border-b border-border bg-muted/30">
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Explorer</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                    Trouvez ce dont vous avez besoin.
                  </h2>
                </div>
                <a href="#catalogue" className="hidden items-center gap-2 text-sm font-semibold sm:inline-flex">
                  Voir tous les articles
                  <ArrowRight className="size-4 text-primary" />
                </a>
              </div>

              <div className="mt-10 -mx-5 overflow-x-auto px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-max gap-5">
                  {categories.map((category) => (
                    <CategoryTile
                      key={category}
                      category={category}
                      imageSrc={getCategoryImageLocal(category)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="catalogue" className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Le catalogue</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  Découvrez nos articles.
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                  Choisissez les articles qui correspondent à votre projet, puis envoyez simplement votre demande.
                </p>
              </div>
            </div>

            <CatalogWithAvailability
              slug={slug}
              initialItems={catalogItems}
              categories={categories}
            />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="rounded-[2rem] bg-foreground p-8 text-background sm:p-12 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Une question ?</p>
                <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  Vous avez trouvé ce qu&apos;il vous faut ?
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-background/65">
                  Consultez les articles, composez votre sélection et envoyez votre demande. Notre équipe pourra ensuite vous accompagner pour votre prestation.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {business.telephone && (
                  <a href={`tel:${business.telephone}`} className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 font-semibold text-foreground">
                    <Phone className="size-4" />
                    Appeler
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="inline-flex items-center gap-2 rounded-full border border-background/20 px-5 py-3 font-semibold">
                    <Mail className="size-4" />
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <Link href="/" className="font-mono font-bold text-foreground">
              {displayName}<span className="text-primary">.</span>
            </Link>
            <div className="flex flex-wrap gap-5">
              {business.adresse && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" />
                  {business.adresse}
                </span>
              )}
              {business.telephone && (
                <a href={`tel:${business.telephone}`} className="inline-flex items-center gap-2 transition hover:text-foreground">
                  <Phone className="size-4" />
                  {business.telephone}
                </a>
              )}
            </div>
          </div>
        </footer>
      </main>
      <SelectionPanel />
    </>
  );
}