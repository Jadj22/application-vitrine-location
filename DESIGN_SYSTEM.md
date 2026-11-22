# 🎨 Design System — DODOME Location Platform (Vitrine Client)

> **Projet** : `location-platform-frontend`  
> **Type d'application** : Plateforme vitrine & réservation en ligne multi-tenant pour la location de matériel et événementiel.  
> **Technologies** : Next.js (App Router), Tailwind CSS v4, Radix UI / Shadcn, OKLCH Color Space, Lucide Icons.

---

## 1. 🌈 Fondations Visuelles & Palette de Couleurs (OKLCH)

Le design system repose sur l'espace colorimétrique moderne **OKLCH**, offrant une clarté optique uniforme, un contraste accessible et un rendu vibrant sur tous les types d'écrans.

### Couleurs Principales

| Token CSS | Espace OKLCH | Rendu / Usage |
|---|---|---|
| `--primary` | `oklch(0.45 0.12 158)` | **Vert Émeraude Profond** — Identité DODOME, boutons d'action principaux, états actifs, accents clés. |
| `--primary-foreground` | `oklch(0.98 0.01 105)` | **Blanc Ivoire Doux** — Texte et icônes sur fond primaire. |
| `--price` | `oklch(0.55 0.15 145)` | **Vert Teinte Dorée / Forêt** — Mise en valeur des prix (FCFA), tarification et montants totaux. |
| `--background` | `oklch(0.98 0.008 105)` | **Blanc Cassé Chaud** — Fond principal de l'application (chaleureux et doux pour les yeux). |
| `--foreground` | `oklch(0.19 0.02 160)` | **Anthracite Profond** — Couleur des titres et corps de texte principal. |
| `--card` | `oklch(1 0 0)` | **Blanc Pur** — Fond des cartes de produits, panneaux de sélection et fenêtres modales. |
| `--card-foreground` | `oklch(0.19 0.02 160)` | **Anthracite** — Texte et informations au sein des cartes. |
| `--muted` | `oklch(0.94 0.015 105)` | **Sable Clair** — Arrière-plans secondaires, badges neutres, conteneurs d'éléments inactifs. |
| `--muted-foreground` | `oklch(0.48 0.025 155)` | **Gris Vert Ardoise** — Descriptions secondaires, mentions légales, libellés d'aide. |
| `--border` | `oklch(0.87 0.02 150)` | **Gris Perle Doux** — Bordures des cartes, séparateurs et champs de saisie. |
| `--input` | `oklch(0.87 0.02 150)` | **Gris Clair** — Contours des inputs et sélecteurs de quantité. |

---

## 2. 🔤 Typographie & Hiérarchie des Textes

- **Police Principale** : Système sans-serif moderne, haute lisibilité (Arial / Inter / Geist Sans fallback).
- **Échelle Typographique** :

```text
H1 (Hero Banner)      : text-4xl à text-6xl | font-bold tracking-tight
H2 (Titres Sections)  : text-3xl à text-4xl | font-bold tracking-tight
H3 (Cartes / Modals)  : text-xl à text-2xl  | font-semibold
Body / Texte Courant  : text-sm à text-base | font-normal leading-relaxed
Badges / Réf / Prix   : text-xs à text-sm   | font-medium tracking-wide
```

---

## 3. 📐 Géométrie, Rayons de Courbure & Élévations

L'identité visuelle de DODOME Location privilégie des **courbures organiques et accueillantes** :

- **Rayons de courbure (Border Radius)** :
  - `rounded-[2rem]` (`32px`) : Tuiles de catégories grand format, bannières d'accueil, fenêtres de sélection.
  - `rounded-[1.5rem]` (`24px`) : Cartes d'articles, panneaux latéraux de devis, conteneurs principaux.
  - `rounded-xl` (`12px`) : Boutons d'action, champs de formulaire, images secondaires.
  - `rounded-full` (`9999px`) : Badges de statut, compteurs de sélection, puces de filtres rapides.

- **Ombres & Profondeur** :
  - `shadow-xs` / `shadow-sm` : Cartes au repos avec bordure `border-border`.
  - `shadow-lg` / `shadow-xl` : Panneau flottant de sélection de devis (*SelectionPanel*) et barres de recherche actives.

---

## 4. 🧩 Composants Clés du Design System

### 1. **Barre de Navigation (`Navbar.tsx`)**
- Header épuré avec effet de verre (*backdrop-blur*).
- Logo organisation / business dynamique.
- Indicateur interactif du panier de devis avec badge de décompte en temps réel.

### 2. **Tuiles de Catégories (`CategoryTile.tsx`)**
- Format portrait immersif (`aspect-[4/5]`) avec coins ultra-arrondis (`rounded-[2rem]`).
- Dégradé sombre subtil (`from-black/75 via-black/10 to-transparent`) garantissant une lisibilité parfaite des titres.
- Effet de zoom doux au survol (`group-hover:scale-105 transition duration-700`).

### 3. **Barre de Recherche Intelligente (`SmartSearchBar.tsx`)**
- Champ de recherche instantané multi-critères (nom d'équipement, mot-clé, date de disponibilité).
- Autocomplétion fluide et filtres rapides par catégorie.

### 4. **Panneau de Réservation & Devis (`SelectionPanel.tsx`)**
- Panneau rétractable ou fixe permettant de cumuler les équipements souhaités.
- Sélecteur de quantité unitaire avec recalcul automatique des estimations en FCFA.
- Sélecteur de calendrier (date de début et date de fin de location).
- Formulaire direct de demande de devis envoyé à l'organisation DODOME.

### 5. **Boutons & États Interactifs**
- **Hover** : Transition de légèreté (`opacity: .85` et `scale-[1.02]`).
- **Active** : Déplacement tactile subtil (`transform: translateY(1px)`).
- **Focus Accessibilité** : Anneau net et visible (`outline: 3px solid var(--primary)` avec décalage de 3px).

---

## 5. 📱 Règles de Conception Responsive & Ergonomie

- **Mobile First** : Toutes les grilles s'adaptent de 1 colonne (mobile `< 640px`) à 2 colonnes (`sm: 640px`), 3 colonnes (`lg: 1024px`) et 4 colonnes (`xl: 1280px`).
- **Accessibilité tactile** : Zones de tap minimales de 44x44px pour l'ajout au panier et le changement de quantité.
- **Scroll fluide** : Navigation ancrée instantanée (`html { scroll-behavior: smooth; }`).
