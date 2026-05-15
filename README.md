# StreamVF

Plateforme de streaming VF/VOSTFR construite avec Next.js 16, React 19 et Tailwind CSS 4. Permet de rechercher, regarder et gérer une liste de films et séries via des lecteurs embarqués multisources.

## Fonctionnalités

- **Catalogue complet** — Films et séries via l'API TMDB, par genre, popularité ou recherche
- **Lecteur multisource** — Bascule VF / VOSTFR + 3 sources par langue avec fallback automatique
- **Watchlist** — Sauvegarde des films et séries à regarder (compte requis)
- **Commentaires** — Système de commentaires par utilisateur
- **Auth** — Connexion Google OAuth ou e-mail magique (NextAuth v5)
- **SEO** — Sitemap dynamique et robots.txt générés automatiquement

## Stack

| Couche | Techno |
|--------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Auth | NextAuth v5 + Prisma adapter |
| BDD | PostgreSQL via Prisma ORM |
| Données | API TMDB |
| State | Zustand |
| Déploiement | Vercel |

## Démarrage local

```bash
# 1. Installer les dépendances
npm install

# 2. Copier et remplir les variables d'environnement
cp .env.example .env.local

# 3. Générer le client Prisma et migrer la base
npx prisma migrate dev

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

```env
# TMDB
TMDB_API_KEY=
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# E-mail (pour magic link)
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587

# Base de données PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

## Structure

```
app/           Routes Next.js (App Router)
components/    Composants React réutilisables
lib/           Clients API (TMDB, Prisma, NextAuth, vidsrc)
store/         Stores Zustand
prisma/        Schéma et migrations
public/        Assets statiques
```

## Déploiement Vercel

1. Importer le repo sur [vercel.com](https://vercel.com)
2. Ajouter toutes les variables d'environnement dans les settings du projet
3. Connecter une base PostgreSQL (Supabase, Neon ou Vercel Postgres)
4. Déployer — Vercel détecte Next.js automatiquement

## Licence

MIT
