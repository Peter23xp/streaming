# StreamVF — Redesign Premium "Luxe Noir & Or"

## Contexte

StreamVF est un site de streaming français (Next.js 16, Tailwind v4, TMDB API v3). Le design actuel est fonctionnel mais générique. L'objectif est un redesign premium avec une identité visuelle forte : **Luxe Noir & Or** — noir profond, accents dorés, typographie majuscule espacée, filtrage par plateforme de streaming.

Approche retenue : **redesign CSS pur** — toute la logique existante est conservée, seuls les styles et les composants visuels changent.

---

## Système de design

### Tokens CSS (`app/globals.css` — bloc `@theme`)

```css
@theme {
  --color-bg: #080808;
  --color-surface: #0f0f0f;
  --color-border: rgba(212,175,55,0.12);
  --color-gold: #d4af37;
  --color-gold-dim: rgba(212,175,55,0.4);
  --color-gold-hover: rgba(212,175,55,0.5);
  --color-text: #cccccc;
  --color-muted: #555555;
  --font-sans: 'Inter', sans-serif;
}
```

### Règles visuelles

- `border-radius: 2–3px` partout (jamais de coins ronds)
- Typographie : uppercase + `letter-spacing` sur tous les titres, labels, pills, boutons
- Aucune ombre sauf hover doré (`box-shadow: 0 0 20px rgba(212,175,55,0.15)`)
- Séparateurs de section : filet vertical doré `2px` avant le titre

---

## Couleurs plateformes (`lib/platforms.ts`)

Constante réutilisée par `PlatformBar` et `MediaCard` :

```ts
export const PLATFORMS = {
  netflix:  { label: 'NETFLIX',   color: '#e50914', tmdbId: 8   },
  prime:    { label: 'PRIME',     color: '#00a8e1', tmdbId: 119 },
  disney:   { label: 'DISNEY+',   color: '#1183cf', tmdbId: 337 },
  apple:    { label: 'APPLE TV+', color: '#555555', tmdbId: 350 },
  max:      { label: 'MAX',       color: '#002be7', tmdbId: 1899},
  canal:    { label: 'CANAL+',    color: '#004b23', tmdbId: 190 },
} as const

export type PlatformKey = keyof typeof PLATFORMS
```

---

## Composants modifiés / créés

### `lib/platforms.ts` — nouveau fichier
Constante PLATFORMS (voir ci-dessus).

### `app/globals.css` — modifié
Remplacer le bloc `@theme` existant par les nouveaux tokens. Ajouter styles globaux : `body { background: var(--color-bg); color: var(--color-text); }`.

### `components/layout/Navbar.tsx` — modifié
- Fond `#080808` + `backdrop-filter: blur(8px)`, bordure basse `1px solid rgba(212,175,55,0.15)`
- Logo `STREAMVF` : `color: #d4af37`, `letter-spacing: 0.2em`, `font-weight: 800`
- Liens FILMS / SÉRIES : `color: #666`, uppercase, `letter-spacing: 0.1em`
- Lien actif : `color: #d4af37`
- Icône recherche + badge watchlist : `color: #d4af37`
- Mobile : hamburger → drawer plein écran `#080808`, liens centrés

### `components/layout/PlatformBar.tsx` — nouveau composant
- Client Component (`'use client'`)
- Fond `rgba(8,8,8,0.95)` + `backdrop-filter: blur(8px)`, bordure basse `1px solid rgba(212,175,55,0.08)`
- Sticky (positionnée par le layout sous la navbar)
- Pills : `TOUT` + une par entrée dans PLATFORMS
- Pill active : `background: #d4af37`, `color: #000`, `font-weight: 700`
- Pill inactive : `border: 1px solid rgba(212,175,55,0.2)`, `color: #666`, hover `color: #999`
- `border-radius: 2px`, `letter-spacing: 0.05em`, `font-size: 11px`, `padding: 3px 12px`
- Lecture/écriture via `useSearchParams` + `useRouter` — met à jour `?platform=<key>`
- Mobile : `overflow-x: auto`, scroll horizontal natif

### `app/layout.tsx` — modifié
Ajouter `<PlatformBar />` juste sous `<Navbar />`, les deux sticky (Navbar `top: 0`, PlatformBar `top: <hauteur navbar>`).

### `components/media/MediaCard.tsx` — modifié
Props : ajouter `platform?: PlatformKey`

- Fond `#0f0f0f`, bordure `1px solid rgba(212,175,55,0.10)`, `border-radius: 2px`
- **Filet vertical gauche** : `position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: PLATFORMS[platform].color` (ou `#d4af37` si pas de platform)
- **Badge note** : `★ X.X` top-right du poster, fond `rgba(0,0,0,0.7)`, `color: #d4af37`, `font-size: 10px`
- **Badges VF/VOSTFR** : top-left, fond `rgba(0,0,0,0.85)`, texte `#d4af37`, `font-size: 9px`, `letter-spacing: 0.05em`
- **Hover** : bordure `rgba(212,175,55,0.5)`, `box-shadow: 0 0 20px rgba(212,175,55,0.12)`, overlay sombre `rgba(0,0,0,0.55)` avec bouton ▶ (cercle `border: 1.5px solid #d4af37`, `color: #d4af37`), `transform: scale(1.02)`, transition `200ms`
- **Sous le poster** : titre `color: #ccc`, uppercase, `font-size: 11px`, `letter-spacing: 0.05em` — année `color: #555`, `font-size: 10px`

### `app/page.tsx` — modifié
- Lire `searchParams.platform` (RSC)
- Si pas de platform : 4 carousels — TENDANCES / NOUVEAUTÉS FILMS / POPULAIRES SÉRIES / MIEUX NOTÉS
- Si platform active : 2 carousels — FILMS `<PLATFORM>` (TMDB discover movies `with_watch_providers`) + SÉRIES `<PLATFORM>` (TMDB discover TV `with_watch_providers`)
- `watch_region=FR` systématiquement
- Labels de section : filet doré `2px` + uppercase + `letter-spacing: 0.15em`
- Grille : `grid-cols-3 md:grid-cols-5 lg:grid-cols-7`, `overflow-x: auto` (pas de carousel JS)

### `lib/tmdb.ts` — modifié
Ajouter deux fonctions :
```ts
discoverMoviesByProvider(providerId: number): Promise<Movie[]>
discoverTVByProvider(providerId: number): Promise<TVShow[]>
```
Paramètres TMDB : `with_watch_providers=<id>&watch_region=FR&language=fr-FR`, cache 24h.

### `app/films/page.tsx` et `app/series/page.tsx` — modifiés
- Lire `searchParams.platform` en plus de `genre` et `year`
- Si platform active : utiliser `discoverMoviesByProvider` / `discoverTVByProvider`

### `components/filters/FiltersBar.tsx` — modifié
- Fond `#080808`, bordure `rgba(212,175,55,0.1)`, pills genre/année dans le même style que PlatformBar
- S'assurer que le searchParam `platform` est préservé lors des changements de genre/année

---

## Comportement du filtre plateforme

1. L'utilisateur clique sur une pill (ex: NETFLIX)
2. URL devient `?platform=netflix`
3. `PlatformBar` marque NETFLIX comme active (côté client)
4. Les pages (RSC) lisent `searchParams.platform`, appellent TMDB discover avec `with_watch_providers=8&watch_region=FR`
5. `MediaCard` reçoit `platform="netflix"` → filet rouge `#e50914`
6. Cliquer sur TOUT retire le param → retour aux carousels normaux

---

## Fichiers non touchés

- `lib/vidsrc.ts`, `lib/prisma.ts`, `lib/auth.ts` — logique inchangée
- `components/media/VidSrcPlayer.tsx`, `EpisodeSelector.tsx` — inchangés
- `app/api/**` — inchangés
- `app/films/[id]`, `app/series/[id]` — pages de détail : uniquement mise à jour des couleurs via les tokens CSS globaux (pas de refonte structurelle)
- `store/watchlistStore.ts` — inchangé
- `prisma/schema.prisma` — inchangé

---

## Tests à effectuer

- [ ] `npm run build` passe sans erreur
- [ ] Homepage affiche 4 carousels en mode TOUT
- [ ] Cliquer NETFLIX charge les carousels filtrés (films et séries Netflix FR)
- [ ] Filet de couleur correct sur chaque carte selon la plateforme
- [ ] Hover doré visible sur les cartes
- [ ] Navbar sticky + PlatformBar sticky — scrollent correctement ensemble
- [ ] Sur mobile : PlatformBar scrollable horizontalement
- [ ] Badges VF/VOSTFR toujours visibles
- [ ] Watchlist badge toujours fonctionnel
- [ ] Pages /films et /series : filtre platform + genre/année compatibles
