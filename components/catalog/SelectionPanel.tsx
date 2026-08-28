"use client";

import { useEffect, useRef, useState } from "react";
import { X, Minus, Plus, Trash2, ArrowRight, Package, Calendar } from "lucide-react";
import { useSelection } from "@/lib/selection-context";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Price } from "@/components/ui/price";

export default function SelectionPanel() {
  const { selectedItems, removeItem, updateQuantity, clearSelection, isOpen, setIsOpen, totalItems } = useSelection();
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle exit animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsExiting(false);
    } else if (isMounted) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Trap focus when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus trap
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
        if (e.key === "Tab" && panelRef.current) {
          const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      // Focus first focusable element
      setTimeout(() => {
        const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 50);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, setIsOpen]);

  if (!isMounted) return null;

  const handleContinue = () => {
    if (slug) {
      router.push(`/b/${slug}/booking-requests/new`);
    }
    setIsOpen(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-out"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-background shadow-2xl flex flex-col"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <Package className="size-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Votre sélection</h2>
              <p className="text-sm text-muted-foreground">{totalItems} article(s)</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors duration-200"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pr-4">
          {selectedItems.map(({ item, quantity }) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition-all duration-200 hover:shadow-md"
            >
              <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                {item.photo_url ? (
                  <img src={item.photo_url} alt={item.nom} className="object-cover h-full w-full" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.nom}</p>
                <p className="text-sm text-muted-foreground">{item.category_nom}</p>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Price amount={item.prix} unit={item.unite} size="sm" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  disabled={quantity <= 1}
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background transition-colors duration-150 disabled:opacity-50 hover:bg-muted active:scale-95"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background transition-colors duration-150 hover:bg-muted active:scale-95"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="size-4" />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-2 inline-flex size-8 items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 text-destructive transition-colors duration-150 hover:bg-destructive/20 active:scale-95"
                  aria-label="Retirer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-3 sticky bottom-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total articles</span>
            <span className="font-semibold">{totalItems}</span>
          </div>
          <button
            onClick={handleContinue}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] shadow-lg shadow-primary/25"
          >
            Continuer vers la demande
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => {
              clearSelection();
              setIsOpen(false);
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 font-medium text-sm transition-colors duration-200 hover:bg-muted active:scale-[0.98]"
          >
            Vider la sélection
          </button>
        </div>
      </div>
    </>
  );
}