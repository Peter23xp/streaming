import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AlertCircle, Check } from 'lucide-react'
import { signIn, emailSignInEnabled } from '@/lib/auth'
import { getTrending } from '@/lib/tmdb'

export const metadata: Metadata = {
  title: 'Connexion',
  robots: { index: false },
}

const ERRORS: Record<string, string> = {
  Configuration: 'La connexion est mal configurée côté serveur. Réessaie plus tard.',
  AccessDenied: 'Accès refusé.',
  OAuthAccountNotLinked: 'Cet email est déjà associé à une autre méthode de connexion.',
  Verification: 'Ce lien a expiré ou a déjà été utilisé.',
}

interface Props {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}

export default async function SignInPage({ searchParams }: Props) {
  const { error, callbackUrl } = await searchParams
  // Only allow same-site redirects after login.
  const redirectTo = callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//') ? callbackUrl : '/'

  const trending = await getTrending('movie', 'week').catch(() => null)
  const posters = (trending?.results ?? []).filter((m) => m.poster_path).slice(0, 18)

  return (
    <div className="relative -mx-4 -mt-6 -mb-16 flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 py-16 sm:-mx-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-20%] grid rotate-[-8deg] grid-cols-4 gap-3 opacity-35 sm:grid-cols-6"
      >
        {posters.map((m) => (
          <div key={m.id} className="relative aspect-[2/3] overflow-hidden rounded-xl">
            <Image
              src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,7,9,0.55)_0%,rgba(7,7,9,0.97)_70%)]"
      />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-surface/80 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <Link href="/" className="mx-auto flex w-fit items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-gold-light to-gold text-lg font-black text-black shadow-[0_8px_24px_-8px_rgba(212,175,55,0.8)]">
            S
          </span>
        </Link>

        <h1 className="mt-5 text-center text-2xl font-bold tracking-tight text-white">Bienvenue sur StreamVF</h1>
        <p className="mt-1.5 text-center text-sm text-muted">Connecte-toi pour retrouver ta liste partout.</p>

        {error && (
          <div role="alert" className="mt-6 flex gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
            {ERRORS[error] ?? 'La connexion a échoué. Réessaie.'}
          </div>
        )}

        <form
          className="mt-6"
          action={async () => {
            'use server'
            await signIn('google', { redirectTo })
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            Continuer avec Google
          </button>
        </form>

        {emailSignInEnabled && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-faint">
              <span className="h-px flex-1 bg-line" />
              ou
              <span className="h-px flex-1 bg-line" />
            </div>
            <form
              className="space-y-2.5"
              action={async (fd: FormData) => {
                'use server'
                await signIn('nodemailer', { email: fd.get('email') as string, redirectTo })
              }}
            >
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ton@email.com"
                className="field w-full rounded-full px-5 py-3 text-sm"
              />
              <button type="submit" className="btn-gold w-full justify-center py-3">
                Recevoir un lien de connexion
              </button>
            </form>
          </>
        )}

        <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-muted">
          {['Ta liste synchronisée sur tous tes appareils', 'Commente tes films et séries préférés'].map((b) => (
            <li key={b} className="flex items-center gap-2.5">
              <Check size={15} className="shrink-0 text-gold" />
              {b}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-xs text-faint">
          En continuant, tu acceptes nos conditions d&apos;utilisation.
        </p>
      </div>
    </div>
  )
}
