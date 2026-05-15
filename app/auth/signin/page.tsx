import { signIn } from '@/lib/auth'
import { getTrending } from '@/lib/tmdb'

export default async function SignInPage() {
  let backdropUrl: string | null = null

  try {
    const data = await getTrending('movie', 'day')
    const first = data?.results?.[0]
    if (first?.backdrop_path) {
      backdropUrl = `https://image.tmdb.org/t/p/w1280${first.backdrop_path}`
    }
  } catch {
    // fallback: pure dark background
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#080808',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fixed background image */}
      {backdropUrl && (
        <>
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(8px)',
              transform: 'scale(1.1)',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              zIndex: 1,
            }}
          />
        </>
      )}

      {/* Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '384px',
          padding: '2rem',
          backgroundColor: 'rgba(8,8,8,0.85)',
          border: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '0.25rem',
          }}
        >
          <span
            style={{
              fontWeight: 800,
              letterSpacing: '0.3em',
              fontSize: '22px',
              color: '#666666',
            }}
          >
            STREAM
          </span>
          <span
            style={{
              fontWeight: 800,
              letterSpacing: '0.3em',
              fontSize: '22px',
              color: '#d4af37',
            }}
          >
            VF
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            textAlign: 'center',
            color: '#444444',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            margin: 0,
          }}
        >
          Accès membres
        </p>

        {/* Gold separator */}
        <div
          style={{
            borderTop: '1px solid rgba(212,175,55,0.1)',
            margin: '1.5rem 0',
          }}
        />

        {/* Google button */}
        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: '/' })
          }}
        >
          <button
            type="submit"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '2px',
              padding: '10px 16px',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Continuer avec Google
          </button>
        </form>

        {/* "ou" separator */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            margin: '1.25rem 0',
          }}
        >
          <div
            style={{
              flex: 1,
              borderTop: '1px solid rgba(212,175,55,0.1)',
            }}
          />
          <span
            style={{
              padding: '0 12px',
              color: '#444444',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              backgroundColor: 'rgba(8,8,8,0.85)',
            }}
          >
            ou
          </span>
          <div
            style={{
              flex: 1,
              borderTop: '1px solid rgba(212,175,55,0.1)',
            }}
          />
        </div>

        {/* Email form */}
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          action={async (fd: FormData) => {
            'use server'
            await signIn('nodemailer', { email: fd.get('email') as string, redirectTo: '/' })
          }}
        >
          <input
            name="email"
            type="email"
            placeholder="votre@email.com"
            style={{
              width: '100%',
              backgroundColor: '#111111',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: '2px',
              padding: '10px 12px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={undefined}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#d4af37',
              color: '#000000',
              border: 'none',
              borderRadius: '2px',
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            Lien magique par email
          </button>
        </form>

        {/* Legal note */}
        <p
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            color: '#333333',
            fontSize: '9px',
          }}
        >
          En continuant, vous acceptez nos conditions d&apos;utilisation.
        </p>
      </div>
    </div>
  )
}
