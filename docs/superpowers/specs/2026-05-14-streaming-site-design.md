# StreamVF — Site de Streaming Full-Stack
**Date :** 2026-05-14  
**Stack :** Next.js 15 · TypeScript · TailwindCSS · shadcn/ui · TMDB API · VidSrc · Prisma · Neon · NextAuth

---

## 1. Objectif

Construire un site de streaming de films et séries en français, inspiré de fs03.lol (French Stream). Les données viennent de TMDB API, le streaming via VidSrc embed (aucun hébergement vidéo). L'expérience anonyme est 100% fonctionnelle ; un compte optionnel permet de persister la watchlist et de laisser des commentaires.

---

## 2. Architecture

### Principe de rendu

| Type | Quoi |
|------|------|
| Server Components | Pages de contenu (homepage, grilles, détails, genre) |
| Client Components | Player VidSrc, filtres interactifs, recherche, watchlist button, sélecteur saison/épisode |
| API Routes | `/api/comments` et `/api/watchlist` (accès Prisma/Neon) |
| Cache Next.js | `revalidate: 86400` (24h) sur tous les fetch TMDB |

La clé TMDB n'est jamais exposée côté client — tous les appels TMDB se font dans des Server Components ou Server Actions.

### Stack technique

```
Frontend    : Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui
Data        : TMDB API v3 (fr-FR)
Streaming   : VidSrc embed (vidsrc.me / vidsrc.icu)
State       : Zustand (watchlist anonyme en localStorage)
DB          : Prisma + Neon PostgreSQL (commentaires, watchlist auth)
Auth        : NextAuth.js (Google + magic link email)
Deploy      : Vercel (frontend) + Neon (DB)
SEO         : next/metadata dynamique, og:image via backdrop TMDB
```

---

## 3. Pages

```
/                          Homepage — hero, tendances, populaires, séries, genres
/films                     Grille films paginée + filtres (genre, pays, année)
/films/[id]/[slug]         Détail film — synopsis, casting, player, similaires
/series                    Grille séries paginée + filtres + statut
/series/[id]/[slug]        Détail série — saisons, épisodes, player
/recherche                 Recherche live debounced 400ms (films + séries)
/genre/[slug]              Films/séries d'un genre TMDB
/watchlist                 Ma liste (localStorage si anonyme, DB si connecté)
/auth/signin               Connexion NextAuth (Google + email magic link)
```

---

## 4. Composants clés

### Layout
- `Navbar` — Logo, liens Films/Séries, icône recherche, icône watchlist, bouton compte
- `Footer` — Liens légaux, genres populaires, mention TMDB

### Media
- `MediaCard` — Poster (w342), titre, année, badge VF/VOSTFR, note ★, hover overlay
- `MediaGrid` — Grille responsive (2 cols mobile → 6 cols desktop)
- `MediaCarousel` — Scroll horizontal avec flèches, pour les sections homepage
- `HeroBanner` — Backdrop 1280px, titre, synopsis 2 lignes, CTA Regarder + Watchlist
- `VidSrcPlayer` — iframe lazy (chargé au clic), sélecteur 3 serveurs, aspect-video

### Filters
- `GenreFilter`, `CountryFilter`, `YearFilter` — URL search params, Server Component rerender

### UI Atoms
- `Badge` — VF / VOSTFR / HD (couleurs distinctes)
- `StarRating` — Note TMDB affichée en ★
- `WatchlistButton` — Zustand toggle + sync DB si connecté
- `EpisodeSelector` — Dropdown saison + liste épisodes cliquables

---

## 5. Data layer — lib/tmdb.ts

Fonctions server-only, toutes avec `{ next: { revalidate: 86400 } }` :

```typescript
getTrending(type: 'movie'|'tv', timeWindow: 'day'|'week')
getPopular(type: 'movie'|'tv', page: number)
getMovieDetail(id: number)          // + credits, videos, similar
getTVDetail(id: number)             // + credits, videos, similar
getTVSeason(id: number, season: number)
searchMulti(query: string, page: number)
discoverByGenre(type: 'movie'|'tv', genreId: number, filters: DiscoverFilters)
getNowPlaying()
getTopRated(type: 'movie'|'tv')
```

Images : `w342` pour posters, `w1280` pour backdrops.  
Langue : `fr-FR` pour tous les appels.  
Badge VF : `original_language === 'fr'` → VF, sinon VOSTFR.

---

## 6. VidSrc — lib/vidsrc.ts

```typescript
// Film
getMovieEmbedUrl(tmdbId)  → https://vidsrc.me/embed/movie/{tmdbId}

// Série
getTVEmbedUrl(tmdbId, season, episode) → https://vidsrc.me/embed/tv/{tmdbId}/{s}/{e}

// Serveurs de fallback
Serveur 1 : vidsrc.me
Serveur 2 : vidsrc.icu
Serveur 3 : 2embed.org
```

L'iframe inclut `referrerPolicy="origin"`, `allowFullScreen`, `allow="autoplay; fullscreen"`. Chargement lazy : l'iframe n'est injecté dans le DOM qu'après le premier clic sur "Regarder".

---

## 7. Schéma Prisma

```prisma
model User {
  id        String      @id @default(cuid())
  email     String      @unique
  name      String?
  image     String?
  comments  Comment[]
  watchlist Watchlist[]
  createdAt DateTime    @default(now())
}

model Comment {
  id        String   @id @default(cuid())
  mediaId   Int
  mediaType String   // 'movie' | 'tv'
  content   String
  approved  Boolean  @default(false)
  userId    String
  author    User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

model Watchlist {
  id        String   @id @default(cuid())
  mediaId   Int
  mediaType String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  addedAt   DateTime @default(now())

  @@unique([userId, mediaId, mediaType])
}
```

---

## 8. State — Zustand

```typescript
// store/watchlistStore.ts
interface WatchlistItem { id: number; type: 'movie'|'tv'; title: string; poster: string }
interface WatchlistStore {
  items: WatchlistItem[]
  add(item): void
  remove(id, type): void
  has(id, type): boolean
}
// Persisté en localStorage via zustand/middleware persist
// Si l'utilisateur se connecte, sync localStorage → DB via POST /api/watchlist/sync
```

---

## 9. Variables d'environnement

```env
TMDB_API_KEY=
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL_SERVER=
DATABASE_URL=
```

---

## 10. Design system

| Token | Valeur |
|-------|--------|
| Fond | `#0f0f0f` |
| Surface card | `#1a1a1a` |
| Accent rouge | `#e50914` |
| Accent jaune (notes) | `#f5c518` |
| Texte principal | `#ffffff` |
| Texte secondaire | `zinc-400` |
| Border | `zinc-800` |
| Police | Inter |
| Radius cards | `rounded-lg` |
| Transition | `duration-300 ease-in-out` |

---

## 11. SEO

- `generateMetadata()` sur chaque page de détail → titre, description, og:image (backdrop TMDB w1280)
- `sitemap.xml` dynamique via `app/sitemap.ts` (films + séries populaires)
- `robots.txt` via `app/robots.ts`
- Score Lighthouse Performance cible > 85

---

## 12. Responsive

- Mobile 390px+ : grille 2 colonnes, menu hamburger, player full-width
- Tablet 768px+ : grille 3-4 colonnes
- Desktop 1280px+ : grille 6 colonnes, layout split sur pages détail

---

## 13. Définition de "terminé"

- [ ] Homepage : hero + 3 carousels (tendances, populaires, séries) + grille genres
- [ ] `/films` : grille paginée + filtres genre/année fonctionnels
- [ ] `/series` : grille paginée + filtres + statut en cours/terminée
- [ ] `/films/[id]/[slug]` : player VidSrc lazy, casting, similaires, commentaires
- [ ] `/series/[id]/[slug]` : sélecteur saison/épisode, player, liste épisodes
- [ ] `/recherche` : recherche live debounce 400ms
- [ ] `/genre/[slug]` : grille filtrée par genre
- [ ] `/watchlist` : localStorage anonyme + DB si connecté
- [ ] Auth NextAuth : Google + magic link
- [ ] SEO : metadata dynamique, og:image, sitemap
- [ ] Responsive 390px+
- [ ] Lighthouse > 85
