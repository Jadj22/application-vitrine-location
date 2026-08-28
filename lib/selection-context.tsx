"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { PublicItem } from "@/lib/api";

const SELECTION_STORAGE_KEY = "dodome_selection";
const getPerSlugKey = (slug?: string | null) => {
  if (!slug || typeof window === "undefined") return SELECTION_STORAGE_KEY;
  try {
    // Priorité au slug courant, fallback global pour migration
    return `dodome_selection:${slug}`;
  } catch {
    return SELECTION_STORAGE_KEY;
  }
};

interface SelectionItem {
  item: PublicItem;
  quantity: number;
}

interface SelectionContextType {
  selectedItems: SelectionItem[];
  addItem: (item: PublicItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearSelection: () => void;
  isItemSelected: (itemId: string) => boolean;
  getItemQuantity: (itemId: string) => number;
  totalItems: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectionContext = createContext<SelectionContextType | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<SelectionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  // Détecter le slug courant (pour scoper la sélection par business)
  useEffect(() => {
    const detectSlug = () => {
      // Priorité 1: URL /b/[slug]
      const match = window.location.pathname.match(/\/b\/([^/]+)/);
      if (match?.[1]) return match[1];
      // Priorité 2: dernier slug stocké
      try {
        return localStorage.getItem("dodome_last_business_slug");
      } catch {
        return null;
      }
    };
    setCurrentSlug(detectSlug());
    const onNav = () => setCurrentSlug(detectSlug());
    window.addEventListener("popstate", onNav);
    // Écoute les changements de slug via storage ou navigation
    const onStorage = () => setCurrentSlug(detectSlug());
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("popstate", onNav);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Load from localStorage on mount (per-slug avec fallback global pour migration)
  useEffect(() => {
    try {
      const perSlugKey = currentSlug ? getPerSlugKey(currentSlug) : SELECTION_STORAGE_KEY;
      let stored = localStorage.getItem(perSlugKey);
      // Migration: si per-slug vide mais global existe, migrer
      if (!stored && currentSlug) {
        const legacy = localStorage.getItem(SELECTION_STORAGE_KEY);
        if (legacy) {
          stored = legacy;
          // Copier vers per-slug pour les prochaines fois (sans effacer global pour compatibilité)
          try {
            localStorage.setItem(perSlugKey, legacy);
          } catch {}
        }
      }
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filtrer les items qui n'ont pas de business cohérent si possible (on garde tout pour l'instant, le catalogue filtrera)
          setSelectedItems(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, [currentSlug]);

  // Save to localStorage on changes (per-slug + legacy global pour compat)
  useEffect(() => {
    if (hydrated) {
      try {
        const perSlugKey = currentSlug ? getPerSlugKey(currentSlug) : SELECTION_STORAGE_KEY;
        localStorage.setItem(perSlugKey, JSON.stringify(selectedItems));
        // Garder aussi la clé globale à jour pour les anciennes pages qui la lisent
        localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(selectedItems));
      } catch {
        // Ignore write errors
      }
    }
  }, [selectedItems, hydrated, currentSlug]);

  const addItem = useCallback((item: PublicItem) => {
    setSelectedItems((prev) => {
      const existing = prev.find((si) => si.item.id === item.id);
      if (existing) {
        return prev.map((si) =>
          si.item.id === item.id ? { ...si, quantity: si.quantity + 1 } : si
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setSelectedItems((prev) => prev.filter((si) => si.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setSelectedItems((prev) =>
      prev.map((si) => (si.item.id === itemId ? { ...si, quantity } : si))
    );
  }, [removeItem]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setIsOpen(false);
  }, []);

  const isItemSelected = useCallback((itemId: string) => {
    return selectedItems.some((si) => si.item.id === itemId);
  }, [selectedItems]);

  const getItemQuantity = useCallback((itemId: string) => {
    const found = selectedItems.find((si) => si.item.id === itemId);
    return found?.quantity ?? 0;
  }, [selectedItems]);

  const totalItems = selectedItems.reduce((sum, si) => sum + si.quantity, 0);

  return (
    <SelectionContext.Provider
      value={{
        selectedItems,
        addItem,
        removeItem,
        updateQuantity,
        clearSelection,
        isItemSelected,
        getItemQuantity,
        totalItems,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}