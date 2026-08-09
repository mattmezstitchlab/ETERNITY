# ETERNITY by Aime

> **OS administratif personnel universel, déguisé en app de capsules temporelles.**
> Une seule PWA : desktop = site marketing + dashboard, mobile = expérience app type TikTok.
> Premier univers lancé : **le mariage**.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-black) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-black) ![PWA](https://img.shields.io/badge/PWA-standalone-black)

---

## 🚀 Démarrage

```bash
npm install          # dépendances
npm run dev          # développement (http://localhost:3000)
npm run build        # build de production
npm start            # serveur de production (activer le service worker)
npm run gen-icons    # régénère les icônes PWA (scripts/gen-icons.mjs, zéro dépendance native)
```

Compte démo pré-chargé : **Sophie Marchand** — dossier « Mariage de Sophie & Lucas »
(15 juin 2027, 89 invités, QR **AIME-742-PLM**). Toutes les données sont locales
(persistées en `localStorage` + clips capturés en `IndexedDB`) et réinitialisables
depuis `/app/compte` → « Réinitialiser la démo ».

## 🏗️ Architecture

```
src/
├─ app/
│  ├─ layout.tsx              # Racine : font Inter self-hostée, provider store, SW
│  ├─ manifest.ts             # PWA manifest (theme #0A0A0A, portrait, standalone)
│  ├─ icon.svg                # Favicon infini or
│  ├─ offline/                # Fallback hors-connexion du service worker
│  ├─ (marketing)/            # Groupe desktop-first : header + footer (380px)
│  │  ├─ page.tsx             # /  Homepage — 8 univers, bouton + rainbow
│  │  ├─ mariage/             # /mariage — landing du use case #1 (live)
│  │  ├─ naissance|anniversaire|diplome|amitie|in-memoriam|chantier|odyssee/
│  │  ├─ registre/            # /registre — annuaire communautaire (recherche + filtres)
│  │  ├─ espace-compte/       # /espace-compte — dashboard universel
│  │  ├─ inscription/         # /inscription — onboarding (login / signup 3 étapes)
│  │  ├─ creation-capsule/    # /creation-capsule — parcours capsule 8 étapes
│  │  ├─ mini-site/           # /mini-site — vitrine publique de l'événement
│  │  ├─ profil-public/       # /profil-public — identité publique + QR
│  │  ├─ doctrine/            # /doctrine — philosophie + design system vivant
│  │  └─ tarifs/              # /tarifs — 3 plans + FAQ
│  └─ (app)/app/              # Groupe mobile-first : bottom tab bar (layout TikTok)
│     ├─ page.tsx             # /app — feed souvenirs
│     ├─ journal/             # /app/journal — timeline moments
│     ├─ capture/             # /app/capture — caméra 10 s (MediaRecorder + IndexedDB)
│     ├─ registre/            # /app/registre — annuaire mobile
│     ├─ compte/              # /app/compte — profil & réglages
│     ├─ messagerie/          # /app/messagerie — chat (réponses simulées, Realtime-ready)
│     ├─ capsule/[id]/        # /app/capsule/:id — vue capsule + scellement
│     ├─ create/              # /app/create — flow création étapes 1-4
│     └─ qr/[code]/           # /app/qr/:code — afficher/partager + scanner (jsQR)
├─ components/                # ui-kit, marketing, app, dashboard, capsule…
├─ lib/
│  ├─ types.ts                # Schéma = tables Supabase (users, folders, capsules, clips…)
│  ├─ data.ts                 # Seed du scénario Sophie & Lucas
│  ├─ store.tsx               # Store React (persistant) — swappable par Supabase
│  ├─ universes.tsx           # Config des 8 univers
│  └─ idb.ts                  # IndexedDB (blobs vidéo capturés)
└─ public/
   ├─ sw.js                   # Service worker (cache statique + fallback /offline)
   ├─ icons/                  # Icônes PWA générées (infini or)
   └─ images/                 # Visuels mariage, avatars, posters de clips
```

## 🎨 Design System (implémenté dans `src/app/globals.css` + `tailwind.config.ts`)

| Token | Valeur | Usage |
|---|---|---|
| Gold | `#C9A96E` | Primaire, CTA, accents |
| Background | `#0A0A0A` | Fond global |
| Card | `#141414` | Surfaces (radius 16px, aucune bordure) |
| Secondary | `#1E1E1E` | Surfaces enchâssées |
| Text | `#FFFFFF` / `#8E8E93` | Textes |
| Rainbow | conic 7 stops | Bouton « + » 64px (`.rainbow-ring`, rotation 6s) |

- **Typographie** : Inter variable 300–600, self-hostée (`src/fonts/`).
  Kicker = Medium 12px caps, `letter-spacing: 3px`, or.
- **Boutons** : pill `rounded-full`, gold fill ou outline.
- **QR** : fond blanc arrondi, format `AIME-XXX-XXX`.

## 🎯 Use case MVP — Mariage

Scénario jouable de bout en bout :

1. `/inscription` → Sophie crée son compte (QR personnel généré)
2. `/espace-compte` → dossier mariage : budget (versements), agenda J-365 → Jour J, tâches, prestataires
3. `/creation-capsule` → parcours capsule 8 étapes
4. `/app/qr/AIME-742-PLM` → partage du QR aux 89 invités (+ vrai scanner caméra jsQR)
5. `/app/capture` → chaque invité filme 10 s (MediaRecorder, arrêt auto)
6. `/app/capsule/cap_jourj` → clips collectés + **scellement irréversible horodaté**
7. `/mini-site` → le film vit pour toujours sur la vitrine publique

## 📱 PWA

`manifest.ts` : `name: ETERNITY by Aime`, `display: standalone`, `orientation: portrait`,
`theme/background: #0A0A0A`, icônes infini or (192/512/maskable/180) + raccourcis
« Capturer un instant » et « Scanner un QR ».
`public/sw.js` : precache (`/`, `/app`, `/offline`), cache-first assets `_next` & images,
network-first navigations avec fallback `/offline`. Enregistré uniquement en production.

## 🔌 Backend (prochaine étape — Supabase)

La couche `src/lib/store.tsx` expose exactement l'interface des tables Supabase
(`users`, `folders`, `capsules`, `clips`, `contacts`, `messages`, `budget_items`,
`agenda_events`, `tasks`). Le branchement consiste à remplacer les lectures/écritures
locales par des appels Supabase (Auth email + Google, Storage `clips`, Realtime
`messages`/`clips`) — voir `.env.example`.

Post-MVP roadmap : montage IA automatique, intégration Pennylane, scellement blockchain,
ouverture des 7 autres univers.

## 🔗 Source design

Figma : [Landing Page Wireframe (Community)](https://www.figma.com/design/q0Qj5lGdcW4YGlTFLgvc9o)

© 2026 ETERNITY by Aime — eternity.video
