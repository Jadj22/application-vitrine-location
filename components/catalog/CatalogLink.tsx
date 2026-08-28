"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export default function CatalogLink({ slug }: { slug?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Si slug non fourni, l'extraire de l'URL courante /b/<slug>/...
  const effectiveSlug = slug ?? pathname?.split("/b/")[1]?.split("/")[0];

  if (!effectiveSlug) return null;

  return (
    <Link
      href={`/b/${effectiveSlug}`}
      onClick={() => setIsLoading(true)}
      aria-disabled={isLoading}
      className={`
        group inline-flex shrink-0 items-center justify-center gap-1.5
        rounded-full
        bg-primary
        px-4 py-2.5
        text-xs font-bold
        text-primary-foreground
        shadow-lg shadow-primary/15
        transition-all duration-300
        sm:px-5 sm:py-3 sm:text-sm
        ${
          isLoading
            ? "pointer-events-none cursor-wait opacity-90"
            : "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20"
        }
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-3.5 animate-spin sm:size-4" />

          <span>
            <span className="hidden sm:inline">
              Ouverture du catalogue...
            </span>

            <span className="sm:hidden">
              Chargement...
            </span>
          </span>
        </>
      ) : (
        <>
          <span className="hidden sm:inline">
            Découvrir le catalogue
          </span>

          <span className="sm:hidden">
            Catalogue
          </span>

          <ArrowRight
            className="
              size-3.5
              transition-transform duration-300
              group-hover:translate-x-0.5
              sm:size-4
            "
          />
        </>
      )}
    </Link>
  );
}