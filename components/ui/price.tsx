import { cn } from "@/lib/utils";

export const priceColorClass = "text-price";
export const priceRingClass = "ring-price";
export const priceBgClass = "bg-price";

/**
 * Couleur prix réutilisable - vert `oklch(0.55 0.15 145)` défini dans `app/globals.css` via `--price`.
 * Utiliser `text-price`, `bg-price`, `border-price` ou importer `priceColorClass`.
 * Composant <Price> pour afficher `item.prix` de façon cohérente.
 */
type PriceProps = {
  amount: number;
  unit?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
};

export function Price({ amount, unit, size = "default", className }: PriceProps) {
  const sizeClass =
    size === "lg"
      ? "text-3xl font-bold"
      : size === "sm"
        ? "text-sm font-semibold"
        : "font-semibold";

  const unitClass =
    size === "lg"
      ? "text-base font-normal text-muted-foreground"
      : "text-sm font-normal text-muted-foreground";

  return (
    <span className={cn("text-price", sizeClass, className)}>
      {amount.toLocaleString("fr-FR")} F CFA
      {unit ? <span className={unitClass}>/{unit}</span> : null}
    </span>
  );
}
