"use client";

import { cn } from "@/lib/utils";
import { CategoryTile } from "./catalog/CategoryTile";
import { SmartSearchBar } from "./catalog/SmartSearchBar";
import { OperationalHeader } from "./_OperationalHeader";
import { Heart, MapPin, Calendar, Users, Search } from "lucide-react";

type Item = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  available: boolean;
};

export function ItemsScreen() {
  const items: Item[] = [
    {
      id: "1",
      name: "Table ronde extensible",
      category: "Mobilier",
      image:
        "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=800&q=85",
      price: 15000,
      available: true,
    },
    {
      id: "2",
      name: "Chaises en velours",
      category: "Mobilier",
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=85",
      price: 2500,
      available: true,
    },
    {
      id: "3",
      name: "Nappe en lin",
      category: "Art de table",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85",
      price: 800,
      available: true,
    },
    {
      id: "4",
      name: "Projecteur LED",
      category: "Éclairage",
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=85",
      price: 3000,
      available: false,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="rounded-2xl border border-border bg-card/80 backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="size-4 text-primary" />
            <span className="font-semibold tracking-tight">Catalogue DODOME</span>
          </div>

          <div className="flex items-center gap-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              className="flex-1 rounded-xl border border-border/80 bg-card py-2 pl-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
            
          </div>
        </div>
      </nav>

      <section className="py-6">
        <OperationalHeader
          title="Catalogue complet"
          subtitle="Découvrez tous les articles disponibles"
          showActions
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <CategoryTile
              key={item.id}
              category={item.category}
              imageSrc={item.image}
            />
          ))}
        </div>
</section>
</main>
  );
}
ItemsScreen.displayName = 'ItemsScreen'