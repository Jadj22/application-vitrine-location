"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MapPin, Heart } from "lucide-react";

type KpiCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  status?: "active" | "warning" | "inactive";
  icon?: React.ReactNode;
};

export function KpiCard({
  title,
  value,
  subtitle,
  action,
  status,
  icon: Icon,
}: KpiCardProps) {
  const statusClass =
    status === "active"
      ? "bg-primary/10 text-primary"
      : status === "warning"
        ? "bg-warning/10 text-warning"
        : "bg-muted/20 text-muted-foreground";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow",
        "group"
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {Icon && <Icon className="size-5 text-primary mt-1 flex-shrink-0" />}
            <div>
              <p className="text-sm font-medium truncate">{title}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="ml-auto flex-shrink-0">
            <span className="text-3xl font-bold">{typeof value === "number" ? value.toLocaleString("fr-FR") : value}</span>
            <p className="text-sm text-muted-foreground mt-1">{title}</p>
          </div>
        </div>
      </div>

      {action && (
        <div className="p-3 border-t border-border/50" style={{ borderRadius: "0 0 rounded-xl rounded-xl" }}>
          <button
            onClick={action.onClick}
            className={cn(
              "w-full justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90",
              action.variant === "outline" && "border-border bg-transparent text-primary hover:bg-primary/10",
              action.variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {action.label}
          </button>
        </div>
      )}

      {status && (
        <div className="p-2 text-xs {statusClass} rounded-lg mt-2">
          {status}
        </div>
      )}
    </div>
  );
}
KpiCard.displayName = 'KpiCard'