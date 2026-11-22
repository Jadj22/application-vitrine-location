"use client";

import { cn } from "@/lib/utils";
import { Sun, Moon, Settings, LogOut } from "lucide-react";
import { useState } from "react";

type DashboardTopBarProps = {
  hasNotifications?: boolean;
  onThemeToggle?: () => void;
  onMenuOpen?: () => void;
  onLogout?: () => void;
};

export function DashboardTopBar({
  hasNotifications = true,
  onThemeToggle,
  onMenuOpen,
  onLogout,
}: DashboardTopBarProps) {
  const [isDark, setIsDark] = useState(false);

  return (
    <header className="rounded-2xl border border-border bg-card/80 backdrop-blur shadow-sm px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="size-5 text-primary"
              fill="currentColor"
            >
              <path d="M12 2l3 8h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h7l3-8z" />
            </svg>
          </div>

          <div>
            <h2 className="font-bold text-lg tracking-tight">Tableau de bord</h2>
            <p className="text-sm text-muted-foreground">Accueil · DODOME Location</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasNotifications && (
            <button
              aria-label="Notifications"
              className={cn(
                "relative rounded-full bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary"
              )}
            >
              Notifications
              <span className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                3
              </span>
            </button>
          )}

          <button
            aria-label="Settings"
            className="rounded-lg border border-border/50 px-3 py-2 text-sm text-foreground hover:bg-primary/5 transition-colors"
          >
            <Settings className="size-4 mr-1" />
            Paramètres
          </button>

          <div className="size-8 rounded-full bg-background hover:bg-primary/5 transition-colors overflow-hidden">
            {isDark ? (
              <Moon className="size-4 text-primary" />
            ) : (
              <Sun className="size-4 text-primary" />
            )}
            <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </div>

          <button
            aria-label="Logout"
            onClick={onLogout}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="size-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
DashboardTopBar.displayName = 'DashboardTopBar'