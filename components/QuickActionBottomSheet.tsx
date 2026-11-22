"use client";

import { cn } from "@/lib/utils";
import { Calendar, Users, Heart, MapPin, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuickAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  description?: string;
};

export function QuickActionBottomSheet({
  isOpen,
  onClose,
  actions,
}: {
  isOpen: boolean;
  onClose: () => void;
  actions: QuickAction[];
}) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-lg",
        isOpen && "translate-y-0 transition-transform duration-300",
        !isOpen && "translate-y-full transition-transform duration-300"
      )}
    >
      <div className="max-w-2xl mx-auto">
        {isOpen && (
          <div className="p-4 space-y-3">
            {actions.map((action) => (
              <Button
                key={action.id}
                onClick={action.onClick}
                className="w-full justify-center rounded-xl px-4 py-3 text-sm font-medium transition-colors"
              >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            ))}
          </div>
        )}

        <div className="p-3 border-t border-border/20">
          <button
            onClick={onClose}
            className="w-full justify-center rounded-xl bg-secondary text-secondary-foreground py-2 text-sm transition-colors hover:bg-secondary/80"
            aria-label="Fermer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
QuickActionBottomSheet.displayName = 'QuickActionBottomSheet'