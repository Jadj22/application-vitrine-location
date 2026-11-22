"use client";

import { cn } from "@/lib/utils";
import { KpiCard } from "./KpiCard";
import { DashboardTopBar } from "./_DashboardTopBar";
import { OperationalHeader } from "./_OperationalHeader";
import { Heart, Clock, MapPin, Users, Calendar } from "lucide-react";

type KpiItem = {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: "active" | "warning" | "inactive";
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
};

export function HomeScreen() {
  const kpis: KpiItem[] = [
    {
      title: "Devis en attente",
      value: 4,
      subtitle: "Cette semaine",
      status: "warning",
      action: {
        label: "Voir les devis",
        onClick: () => window.dispatchEvent(new Event("view-quotations")),
        variant: "outline",
      },
    },
    {
      title: "Location active",
      value: 12,
      subtitle: "En cours",
      status: "active",
    },
    {
      title: "Équipe mobilisée",
      value: 3,
      subtitle: "Techniciens",
      action: {
        label: "Voir l'équipe",
        onClick: () => window.dispatchEvent(new Event("view-team")),
        variant: "outline",
      },
    },
    {
      title: "TCA mensuel",
      value: 2450000,
      subtitle: "FCFA",
      status: "active",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <DashboardTopBar
        hasNotifications
        onThemeToggle={() => window.dispatchEvent(new Event("theme-toggle"))}
        onMenuOpen={() => window.dispatchEvent(new Event("menu-open"))}
        onLogout={() => window.dispatchEvent(new Event("logout"))}
      />

      <section className="py-6">
        <OperationalHeader
          title="Vues rapides"
          subtitle="Tableau de bord principal"
          showActions
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {kpis.map((kpi, index) => (
            <KpiCard
              key={index}
              title={kpi.title}
              value={kpi.value}
              subtitle={kpi.subtitle}
              status={kpi.status}
              action={kpi.action}
            />
          ))}
        }
</section>
  );
}
HomeScreen.displayName = 'HomeScreen'