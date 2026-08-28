import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { invoices } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Facture",
    robots: { index: false, follow: false },
  };
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ slug: string; reservationId: string }>;
}) {
  const { slug, reservationId } = await params;

  let invoice;
  try {
    invoice = await invoices.getPublic(slug, reservationId);
  } catch {
    invoice = null;
  }

  if (!invoice)
    return (
      <main className="mx-auto max-w-xl px-5 py-24">
        <h1 className="text-4xl font-semibold">Facture introuvable</h1>
        <p className="mt-4 text-muted-foreground">
          Cette facture n'existe pas ou n'est plus disponible.
        </p>
        <Link href={`/b/${slug}`} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft className="size-4" />
          Retour au catalogue
        </Link>
      </main>
    );

  const statutColors: Record<string, string> = {
    BROUILLON: "bg-muted text-muted-foreground",
    PROFORMA: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    ENVOYEE: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    PAYEE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    ANNULEE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <Link href={`/b/${slug}`} className="font-mono font-bold">dodome</Link>

      <div className="mt-16">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-primary">Facture</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">{invoice.numero}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Émise le {new Date(invoice.generee_le).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-medium ${statutColors[invoice.statut] || "bg-muted text-muted-foreground"}`}>
            {invoice.statut}
          </span>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Informations client</h2>
          <div className="grid gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Nom</p>
              <p className="font-medium">{invoice.client_nom}</p>
            </div>
            {invoice.client_email && (
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{invoice.client_email}</p>
              </div>
            )}
            {invoice.client_telephone && (
              <div>
                <p className="text-muted-foreground">Téléphone</p>
                <p className="font-medium">{invoice.client_telephone}</p>
              </div>
            )}
            {invoice.client_adresse && (
              <div>
                <p className="text-muted-foreground">Adresse</p>
                <p className="font-medium">{invoice.client_adresse}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Détail</h2>
          <div className="divide-y divide-border">
            {invoice.lignes.map((ligne, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0">
                <p className="font-medium">{ligne.description}</p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {ligne.quantite} × {ligne.prix_unitaire.toLocaleString("fr-FR")} F CFA
                  </span>
                  <span className="font-medium">{ligne.total.toLocaleString("fr-FR")} F CFA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{invoice.sous_total.toLocaleString("fr-FR")} F CFA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TVA ({invoice.tva_taux}%)</span>
              <span>{invoice.tva_montant.toLocaleString("fr-FR")} F CFA</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
              <span>Total TTC</span>
              <span>{invoice.total_ttc.toLocaleString("fr-FR")} F CFA</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 font-semibold transition hover:bg-muted">
            <FileText className="size-4" />
            Imprimer
          </button>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground">
          <p>Document généré automatiquement · {invoice.numero}</p>
          <p className="mt-1">Pour toute question, contactez le professionnel directement.</p>
        </div>
      </div>
    </main>
  );
}