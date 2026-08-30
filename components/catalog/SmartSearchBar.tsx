"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, X, Loader2, Calendar, Users, MapPin, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SearchIntentMetadata } from "@/lib/api";

const EVENT_EMOJIS: Record<string, string> = {
  birthday: "🎂 Anniversaire",
  wedding: "💍 Mariage",
  baptism: "👶 Baptême",
  conference: "💼 Conférence",
  meeting: "🤝 Réunion",
  ceremony: "✨ Cérémonie",
  party: "🎉 Fête & Soirée",
  event: "🎈 Événement",
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  mother: "Maman / Mère",
  father: "Papa / Père",
  daughter: "Fille",
  son: "Fils",
  child: "Enfant",
  baby: "Bébé",
  wife: "Épouse",
  husband: "Époux",
  friend: "Ami(e)",
  colleague: "Collègue",
  client: "Client",
};

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  metadata?: SearchIntentMetadata | null;
  loading?: boolean;
  onClear: () => void;
};

export default function SmartSearchBar({
  query,
  onQueryChange,
  metadata,
  loading = false,
  onClear,
}: Props) {
  const [localInput, setLocalInput] = useState(query);

  useEffect(() => {
    setLocalInput(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQueryChange(localInput);
  };

  const handleClear = () => {
    setLocalInput("");
    onClear();
  };

  const hasEvent = metadata?.event && EVENT_EMOJIS[metadata.event];
  const hasTarget = metadata?.target?.relationship && RELATIONSHIP_LABELS[metadata.target.relationship];
  const hasAttendees = metadata?.attendees;
  const hasLocation = metadata?.location;
  const hasContextBadges = hasEvent || hasTarget || hasAttendees || hasLocation;

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center">
          <div className="absolute left-4.5 flex items-center pointer-events-none text-muted-foreground">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-primary" />
            ) : query.trim() ? (
              <Sparkles className="size-5 text-primary animate-pulse" />
            ) : (
              <Search className="size-5 text-muted-foreground" />
            )}
          </div>

          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
            placeholder="Que souhaitez-vous organiser ? (ex: Organiser un anniversaire pour ma mère...)"
            className="w-full rounded-2xl border border-border/80 bg-card py-4 pl-12 pr-28 text-base shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 sm:text-lg"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {localInput && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Effacer la recherche"
              >
                <X className="size-4" />
              </button>
            )}

            <button
              type="submit"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Rechercher
            </button>
          </div>
        </div>
      </form>

      {/* Badges de contexte intelligent détecté */}
      {query.trim() && hasContextBadges && (
        <div className="flex flex-wrap items-center gap-2 px-1 text-xs">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mr-1">
            Contexte détecté :
          </span>

          {hasEvent && (
            <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs font-medium border-primary/20 bg-primary/10 text-primary">
              {EVENT_EMOJIS[metadata.event!]}
            </Badge>
          )}

          {hasTarget && (
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-xs font-medium bg-card">
              <Heart className="size-3 text-rose-500" />
              Pour : {RELATIONSHIP_LABELS[metadata.target!.relationship!]}
              {metadata.target?.age ? ` (${metadata.target.age} ans)` : ""}
            </Badge>
          )}

          {hasAttendees && (
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-xs font-medium bg-card">
              <Users className="size-3 text-blue-500" />
              {metadata.attendees} participants
            </Badge>
          )}

          {hasLocation && (
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-xs font-medium bg-card">
              <MapPin className="size-3 text-emerald-500" />
              {metadata.location}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
