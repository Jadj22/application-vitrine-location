"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Heart, MessageCircle, Package, Search, Share2, Sparkles } from "lucide-react";
import CatalogLink from "@/components/catalog/CatalogLink";
import { getStoredBusinessSlug } from "@/lib/business-slug-storage";

export default function Navbar() {
  const storedSlug = getStoredBusinessSlug();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-5 lg:h-20 lg:px-8">

        {/* LOGO */}
        <Link
          href="/"
          className="group shrink-0"
          aria-label="Dodome - Accueil"
        >
          <span className="text-xl font-black tracking-[-0.06em] sm:text-2xl">
            Dodome
            <span className="text-primary transition-colors group-hover:text-primary/70">
              .
            </span>
          </span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav
          className="hidden items-center gap-7 text-[13px] font-semibold text-muted-foreground lg:flex"
          aria-label="Navigation principale"
        >
          <a href="#catalogue" className="hover:text-foreground transition-colors">
            Catalogue
          </a>
          <a href="#possibilites" className="hover:text-foreground transition-colors">
            Possibilités
          </a>
          <a href="#fonctionnement" className="hover:text-foreground transition-colors">
            Comment ça marche
          </a>
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>

        {/* CATALOGUE */}
        <CatalogLink slug={storedSlug ?? undefined} />

      </div>
    </header>
  );
}