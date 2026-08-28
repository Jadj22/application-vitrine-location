import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Heart,
  MessageCircle,
  Package,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";

const categories = [
    {
      name: "Tables",
      image:
        "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "Chaises",
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "Décoration",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "Éclairage",
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
    },
  ];

const complementaryItems = [
  {
    name: "Table ronde",
    category: "Mobilier",
    icon: "▱",
  },
  {
    name: "Chaise événementielle",
    category: "Mobilier",
    icon: "▥",
  },
  {
    name: "Nappe élégante",
    category: "Art de table",
    icon: "◇",
  },
];

const steps = [
  {
    number: "01",
    title: "Trouvez ce qu'il vous faut",
    text: "Parcourez notre catalogue depuis votre téléphone et découvrez les articles disponibles.",
  },
  {
    number: "02",
    title: "Explorez les possibilités",
    text: "Un article vous plaît ? Découvrez aussi les éléments qui peuvent l'accompagner.",
  },
  {
    number: "03",
    title: "Composez votre prestation",
    text: "Choisissez les articles selon vos besoins, votre décoration et votre budget.",
  },
  {
    number: "04",
    title: "Envoyez votre demande",
    text: "Indiquez vos dates et vos informations. Notre équipe reçoit votre demande et vous répond.",
  },
];

const faqs = [
  {
    question: "Dois-je installer une application ?",
    answer:
      "Non. Vous pouvez consulter notre catalogue directement depuis votre navigateur, sur votre téléphone, tablette ou ordinateur.",
  },
  {
    question: "Comment trouver les articles qui vont ensemble ?",
    answer:
      "Lorsque vous consultez un article, nous pouvons vous présenter d'autres articles qui peuvent accompagner votre choix pour votre prestation ou votre décoration.",
  },
  {
    question: "Puis-je choisir plusieurs articles ?",
    answer:
      "Oui. L'objectif est justement de vous permettre de découvrir plusieurs articles et de composer votre demande selon vos besoins.",
  },
  {
    question: "La demande signifie-t-elle que ma réservation est confirmée ?",
    answer:
      "Non. L'envoi d'une demande permet à notre équipe de la recevoir et de vérifier les informations avant de vous confirmer la réservation selon nos disponibilités et notre processus.",
  },
];

function HeroCatalogPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -left-10 top-16 hidden size-32 rounded-full bg-primary/10 blur-3xl md:block" />
      <div className="absolute -right-10 bottom-10 size-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative rounded-[2.5rem] border border-border/70 bg-card p-3 shadow-[0_30px_100px_-30px_rgba(0,0,0,0.35)]">
        <div className="overflow-hidden rounded-[2rem] bg-background">
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Notre catalogue
              </p>
              <p className="mt-1 text-lg font-bold">Mobilier & décoration</p>
            </div>

            <button
              type="button"
              className="rounded-full border border-border p-2"
              aria-label="Rechercher"
            >
              <Search className="size-4" />
            </button>
          </div>

          <div className="flex gap-2 overflow-hidden px-5 py-4">
            {["Tout", "Tables", "Chaises", "Décoration"].map((item, index) => (
              <span
                key={item}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 pt-0">
            <div className="group overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex h-40 items-center justify-center bg-muted">
                <span className="text-7xl transition-transform group-hover:scale-110">
                  ▱
                </span>
              </div>

              <div className="p-4">
                <p className="text-xs text-muted-foreground">Mobilier</p>
                <p className="mt-1 font-bold">Table ronde</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Voir l'article</span>
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </div>

            <div className="group overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex h-40 items-center justify-center bg-muted">
                <span className="text-7xl transition-transform group-hover:scale-110">
                  ▥
                </span>
              </div>

              <div className="p-4">
                <p className="text-xs text-muted-foreground">Mobilier</p>
                <p className="mt-1 font-bold">Chaise événementielle</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Voir l'article</span>
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="m-4 rounded-2xl bg-foreground p-4 text-background">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-background/10 p-2">
                <Sparkles className="size-5" />
              </div>

              <div>
                <p className="font-bold">Vous aimez cette table ?</p>
                <p className="mt-1 text-xs leading-5 text-background/65">
                  Découvrez aussi les articles qui peuvent l'accompagner.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-background/10 px-3 py-1.5 text-xs">
                Nappe
              </span>
              <span className="rounded-full bg-background/10 px-3 py-1.5 text-xs">
                Chaises
              </span>
              <span className="rounded-full bg-background/10 px-3 py-1.5 text-xs">
                Accessoires
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-7 -left-4 hidden max-w-[230px] rounded-2xl border border-border bg-background p-4 shadow-xl md:block">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <Check className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-sm font-bold">Votre sélection</p>
            <p className="text-xs text-muted-foreground">
              Trouvez ce qui va ensemble
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

{/* HERO */}
<section className="relative isolate overflow-hidden border-b border-border bg-background">
  {/* Background atmosphere */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -right-40 -top-40 size-[600px] rounded-full bg-primary/10 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-primary/5 blur-3xl" />
  </div>

  <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-12 sm:pt-16 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-28 lg:pt-20">

    {/* LEFT — MESSAGE */}
    <div className="relative z-10">

      {/* Eyebrow */}
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold shadow-sm backdrop-blur">
        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="size-3.5 text-primary" />
        </span>

        Découvrez. Composez. Demandez.
      </div>

      {/* Heading */}
      <h1 className="max-w-3xl text-balance text-5xl font-black tracking-[-0.07em] sm:text-6xl lg:text-[4.6rem] lg:leading-[0.98] xl:text-[5.2rem]">
        Trouvez ce qu&apos;il vous faut.
        <span className="mt-2 block text-primary">
          Et découvrez ce qui va avec.
        </span>
      </h1>

      {/* Description */}
      <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
        Parcourez nos articles depuis votre téléphone, choisissez ce qui
        correspond à votre prestation et découvrez facilement les éléments
        qui peuvent compléter votre décoration.
      </p>

      {/* CTA */}
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href="#catalogue"
          className="
            group inline-flex items-center justify-center gap-2
            rounded-full bg-primary px-7 py-4
            font-bold text-primary-foreground
            shadow-xl shadow-primary/20
            transition-all duration-300
            hover:-translate-y-1
            hover:shadow-2xl hover:shadow-primary/25
          "
        >
          Explorer le catalogue
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="#possibilites"
          className="
            inline-flex items-center justify-center gap-2
            rounded-full border border-border
            bg-background px-7 py-4
            font-bold
            transition-all duration-300
            hover:border-primary
            hover:bg-muted
          "
        >
          Voir comment choisir
        </Link>
      </div>

      {/* Small reassurance */}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <Check className="size-4 text-primary" />
          Depuis votre téléphone
        </span>

        <span className="inline-flex items-center gap-2">
          <Check className="size-4 text-primary" />
          Articles &amp; associations
        </span>

        <span className="inline-flex items-center gap-2">
          <Check className="size-4 text-primary" />
          Demande en quelques étapes
        </span>
      </div>
    </div>

    {/* RIGHT — VISUAL EXPERIENCE */}
    <div className="relative min-h-[500px] lg:min-h-[600px]">

      {/* Decorative glow */}
      <div className="absolute left-1/2 top-1/2 -z-10 size-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      {/* Main catalog image */}
      <div className="absolute left-0 top-8 w-[72%] overflow-hidden rounded-[2rem] border border-border bg-background shadow-2xl shadow-black/10 sm:w-[68%] lg:left-2 lg:top-4">

        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=90"
            alt="Table préparée pour une réception"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur-md">
              Article sélectionné
            </span>

            <h2 className="mt-3 text-2xl font-black tracking-tight">
              Tables
            </h2>

            <p className="mt-1 text-sm text-white/75">
              Le point de départ de votre prestation
            </p>
          </div>
        </div>
      </div>

      {/* Floating recommendation card */}
      <div
        className="
          absolute right-0 top-0 z-20
          w-[58%] overflow-hidden
          rounded-[1.5rem]
          border border-border
          bg-background/95
          p-3
          shadow-2xl
          backdrop-blur
          sm:w-[48%]
          lg:right-2 lg:w-[46%]
        "
      >
        <div className="relative aspect-[1.15/1] overflow-hidden rounded-xl">
          <img
            src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85"
            alt="Chaises pouvant accompagner une table"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute bottom-3 left-3 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
              Peut accompagner
            </p>
            <p className="mt-1 font-bold">
              Chaises
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 pb-1 pt-3">
          <span className="text-xs font-semibold">
            À associer
          </span>

          <ArrowRight className="size-4 text-primary" />
        </div>
      </div>

      {/* Floating decoration card */}
      <div
        className="
          absolute bottom-3 right-0 z-20
          w-[58%]
          overflow-hidden
          rounded-[1.5rem]
          border border-border
          bg-background/95
          p-3
          shadow-2xl
          backdrop-blur
          sm:w-[48%]
          lg:right-1 lg:w-[46%]
        "
      >
        <div className="relative aspect-[1.15/1] overflow-hidden rounded-xl">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85"
            alt="Décoration pouvant compléter une prestation"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute bottom-3 left-3 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
              Pour aller plus loin
            </p>

            <p className="mt-1 font-bold">
              Décoration
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 pb-1 pt-3">
          <span className="text-xs font-semibold">
            Explorer
          </span>

          <ArrowRight className="size-4 text-primary" />
        </div>
      </div>

      {/* Selection indicator */}
      <div
        className="
          absolute bottom-0 left-[8%] z-30
          flex items-center gap-3
          rounded-2xl border border-border
          bg-background/95
          px-4 py-3
          shadow-xl
          backdrop-blur
          sm:left-[12%]
        "
      >
        <div className="flex -space-x-2">
          <span className="size-7 rounded-full border-2 border-background bg-muted" />
          <span className="size-7 rounded-full border-2 border-background bg-primary/20" />
          <span className="size-7 rounded-full border-2 border-background bg-primary/40" />
        </div>

        <div>
          <p className="text-xs font-bold">
            Composez votre sélection
          </p>

          <p className="text-[11px] text-muted-foreground">
            Selon votre besoin
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

{/* INTRO — PLUS QU'UN CATALOGUE */}
<section className="relative overflow-hidden border-y border-border bg-background">
  <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">

    {/* Header */}
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Plus qu&apos;un catalogue
        </p>

        <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          Ne cherchez pas seulement
          <br />
          <span className="text-muted-foreground">
            un article.
          </span>
        </h2>
      </div>

      <div className="lg:pb-1">
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Découvrez aussi les articles qui peuvent accompagner votre choix
          et composez votre prestation selon vos envies, votre décoration
          et votre budget.
        </p>
      </div>
    </div>

    {/* EXPERIENCE */}
    <div className="mt-16 overflow-hidden rounded-[2.5rem] border border-border bg-muted/40">

      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border bg-background/80 px-6 py-5 backdrop-blur sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Imaginez votre prestation
          </p>

          <p className="mt-1 font-semibold">
            Trouvez une pièce. Découvrez ce qui l&apos;accompagne.
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium sm:flex">
          <span className="size-1.5 rounded-full bg-primary" />
          Sélection personnalisée
        </div>
      </div>

      {/* Visual composition */}
      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">

        {/* Main item */}
        <div className="relative min-h-[460px] overflow-hidden bg-background p-5 sm:p-8">
          <div className="relative h-full min-h-[400px] overflow-hidden rounded-[2rem]">

            <img
              src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1600&q=90"
              alt="Table préparée pour une réception"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                Votre point de départ
              </span>

              <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Une table
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
                Vous avez trouvé ce dont vous aviez besoin ?
                Regardez maintenant ce qui peut compléter votre mise en place.
              </p>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-col justify-between bg-muted/50 p-6 sm:p-8 lg:p-10">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Peut aller avec
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
              Composez votre ensemble.
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Une sélection peut naturellement vous conduire vers d&apos;autres
              articles utiles pour votre prestation.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3">

            {/* Chairs */}
            <Link
              href="/b/atelier-lumiere#catalogue"
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=85"
                  alt="Chaises"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <p className="text-sm font-bold">
                  Chaises
                </p>
                <span className="mt-1 inline-flex items-center text-xs text-muted-foreground">
                  Découvrir
                  <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Decoration */}
            <Link
              href="/b/atelier-lumiere#catalogue"
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85"
                  alt="Décoration de réception"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <p className="text-sm font-bold">
                  Décoration
                </p>
                <span className="mt-1 inline-flex items-center text-xs text-muted-foreground">
                  Découvrir
                  <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Table linen */}
            <Link
              href="/b/atelier-lumiere#catalogue"
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=800&q=85"
                  alt="Nappe et table dressée"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <p className="text-sm font-bold">
                  Nappes
                </p>
                <span className="mt-1 inline-flex items-center text-xs text-muted-foreground">
                  Découvrir
                  <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Lighting */}
            <Link
              href="/b/atelier-lumiere#catalogue"
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=85"
                  alt="Éclairage décoratif"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <p className="text-sm font-bold">
                  Éclairage
                </p>
                <span className="mt-1 inline-flex items-center text-xs text-muted-foreground">
                  Découvrir
                  <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

          </div>

          {/* Bottom message */}
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="size-4 text-primary" />
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-foreground">
                Votre choix, votre budget.
              </span>{" "}
              Explorez les possibilités et construisez votre sélection.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* CATALOGUE */}
      <section
        id="catalogue"
        className="relative overflow-hidden border-y border-border bg-muted/40"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          {/* Header */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Le catalogue
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Tout ce qu&apos;il vous faut,
                <br />
                <span className="text-muted-foreground">au même endroit.</span>
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Explorez les différentes familles d&apos;articles et composez
                votre prestation selon vos envies, votre décoration et votre
                budget.
              </p>
            </div>

            <Link
              href="/b/atelier-lumiere"
              className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-bold transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              Voir tout le catalogue
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Categories */}
          <div className="mt-14">
            <div
              className="
            flex gap-5 overflow-x-auto pb-6
            snap-x snap-mandatory
            scrollbar-none
            lg:grid lg:grid-cols-4
            lg:overflow-visible
            "
            >
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href="/b/atelier-lumiere#catalogue"
                  className="
                group relative
                min-w-[78vw]
                snap-start
                overflow-hidden
                rounded-[2rem]
                border border-border
                bg-background
                shadow-sm
                transition-all duration-500
                hover:-translate-y-1
                hover:shadow-2xl
                sm:min-w-[45vw]
                lg:min-w-0
                "
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                    "
                    />

                    {/* Overlay */}
                    <div
                      className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/75
                    via-black/10
                    to-transparent
                    "
                    />

                    {/* Category label */}
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                        Catégorie
                      </p>

                      <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                        {category.name}
                      </h3>

                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                        Explorer
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile scroll indicator */}
            <div className="mt-2 flex items-center justify-center gap-2 lg:hidden">
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
            </div>
          </div>

          {/* Cross-selling message */}
          <div className="mt-14 rounded-[2rem] border border-border bg-background p-6 shadow-sm sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="size-5 text-primary" />
              </div>

              <div>
                <h3 className="font-bold">
                  Vous avez déjà trouvé votre pièce principale ?
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Découvrez également les articles qui peuvent
                  l&apos;accompagner pour créer une prestation cohérente.
                </p>
              </div>
            </div>

            <Link
              href="/b/atelier-lumiere"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold lg:mt-0"
            >
              Explorer les associations
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* COMPLEMENTARY ITEMS */}
      <section
        id="possibilites"
        className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32"
      >
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="size-6 text-primary" />
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Trouvez les bonnes associations
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Un article peut en faire découvrir plusieurs autres.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Notre catalogue ne s'arrête pas à l'article que vous recherchez.
              Il vous permet également d'explorer les possibilités qui
              l'accompagnent.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Pour une table : chaises, nappes et accessoires.",
                "Pour une décoration : mobilier et éléments complémentaires.",
                "Pour votre prestation : les articles adaptés à votre besoin.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2.5rem] border border-border bg-card p-5 shadow-2xl">
            <div className="rounded-[2rem] bg-muted p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Vous regardez
                  </p>
                  <h3 className="mt-2 text-2xl font-black">Une table ronde</h3>
                </div>

                <Heart className="size-5 text-muted-foreground" />
              </div>

              <div className="mt-8 flex h-52 items-center justify-center rounded-[1.5rem] bg-background">
                <span className="text-[9rem] leading-none">▱</span>
              </div>

              <div className="mt-6 rounded-2xl bg-background p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-primary/10 p-2">
                    <Sparkles className="size-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-bold">
                      Vous préparez votre mise en place ?
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Voici quelques articles qui pourraient compléter votre
                      sélection.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {complementaryItems.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 rounded-xl border border-border p-3"
                    >
                      <div className="flex size-12 items-center justify-center rounded-lg bg-muted text-2xl">
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.category}
                        </p>
                      </div>

                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Une expérience simple
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Tout commence avec une idée.
              <span className="block text-background/50">
                Le catalogue vous aide à la concrétiser.
              </span>
            </h2>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-background/10 bg-background/10 md:grid-cols-3">
            <div className="bg-foreground p-8">
              <Search className="size-7 text-primary" />
              <h3 className="mt-12 text-2xl font-bold">Cherchez</h3>
              <p className="mt-3 leading-7 text-background/60">
                Trouvez l'article qui correspond à ce que vous recherchez.
              </p>
            </div>

            <div className="bg-foreground p-8">
              <Package className="size-7 text-primary" />
              <h3 className="mt-12 text-2xl font-bold">Découvrez</h3>
              <p className="mt-3 leading-7 text-background/60">
                Explorez les autres articles qui peuvent compléter votre
                sélection.
              </p>
            </div>

            <div className="bg-foreground p-8">
              <MessageCircle className="size-7 text-primary" />
              <h3 className="mt-12 text-2xl font-bold">Demandez</h3>
              <p className="mt-3 leading-7 text-background/60">
                Envoyez votre demande. Notre équipe la reçoit directement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="fonctionnement"
        className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Comment ça marche ?
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
            De la découverte à votre demande.
          </h2>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.number}
              className="group rounded-[2rem] border border-border p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-sm font-black text-primary">
                {step.number}
              </span>

              <h3 className="mt-16 text-xl font-bold">{step.title}</h3>

              <p className="mt-3 leading-7 text-muted-foreground">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* MOBILE / SHARING */}
      <section className="border-y border-border bg-muted/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-32">
          <div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-background shadow-sm">
              <Share2 className="size-6 text-primary" />
            </div>

            <h2 className="mt-8 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Découvrez notre catalogue depuis n'importe où.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Un lien partagé sur WhatsApp, un QR Code, une recherche Google ou
              simplement votre téléphone : accédez aux articles sans avoir
              besoin d'installer une application.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-5">
                <MessageCircle className="size-5 text-primary" />
                <p className="mt-4 font-bold">WhatsApp</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recevez et partagez facilement le lien du catalogue.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5">
                <Search className="size-5 text-primary" />
                <p className="mt-4 font-bold">Depuis Google</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Découvrez les articles depuis votre navigateur.
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-full max-w-sm rounded-[2.5rem] border border-border bg-background p-3 shadow-2xl">
              <div className="rounded-[2rem] bg-muted p-5">
                <div className="mx-auto h-1.5 w-20 rounded-full bg-border" />

                <div className="mt-8 rounded-2xl bg-background p-6 text-center">
                  <div className="mx-auto flex size-24 items-center justify-center rounded-2xl border-4 border-foreground p-3">
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <span
                          key={i}
                          className={`size-2 ${
                            [0, 2, 5, 7, 8, 10, 13, 15].includes(i)
                              ? "bg-foreground"
                              : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-6 font-bold">Scannez pour découvrir</p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Le catalogue s'ouvre directement dans votre navigateur.
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-background p-4">
                  <Clock3 className="size-5 text-primary" />
                  <p className="text-sm font-medium">
                    Consultez les articles quand vous le souhaitez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL MESSAGE */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="overflow-hidden rounded-[2.5rem] bg-primary p-8 text-primary-foreground sm:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-70">
                Votre prochaine prestation commence ici
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Cherchez. Découvrez. Composez. Demandez.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 opacity-80">
                Explorez nos articles, trouvez ceux qui correspondent à votre
                besoin et envoyez-nous simplement votre demande.
              </p>
            </div>

            <Link
              href="/b/atelier-lumiere"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-4 font-bold text-foreground transition hover:-translate-y-0.5"
            >
              Explorer le catalogue
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border">
        <div className="mx-auto max-w-4xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Questions fréquentes
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Vous voulez en savoir plus ?
            </h2>
          </div>

          <div className="mt-12 divide-y divide-border rounded-[2rem] border border-border">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold">
                  <span>{faq.question}</span>
                  <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>

                <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <Link href="/" className="text-2xl font-black tracking-[-0.07em]">
                Dodome
              </Link>

              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Découvrez nos articles, composez votre sélection et envoyez
                votre demande simplement depuis votre téléphone.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-muted-foreground">
              <a href="#catalogue" className="hover:text-foreground">
                Catalogue
              </a>
              <a href="#possibilites" className="hover:text-foreground">
                Possibilités
              </a>
              <a href="#fonctionnement" className="hover:text-foreground">
                Comment ça marche
              </a>
              <a href="#faq" className="hover:text-foreground">
                FAQ
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} Dodome. Tous droits réservés.
            </span>

            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-foreground">
                Confidentialité
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
