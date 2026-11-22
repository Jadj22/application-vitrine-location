"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Calendar, Heart, MapPin, Users } from "lucide-react";

type OperationalHeaderProps = {
  title: string;
  subtitle?: string;
  showActions?: boolean;
  onViewAll?: () => void;
};

export function OperationalHeader({
  title,
  subtitle,
  showActions = true,
  onViewAll,
}: OperationalHeaderProps) {
  return (
    <header className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-primary/5 transition-colors"
            >
              Voir tout
              <ChevronDown className="size-3 ml-1" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
OperationalHeader.displayName = 'OperationalHeader'