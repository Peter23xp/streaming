import { signIn } from '@/lib/auth'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f0f' }}>
      <div className="p-8 rounded-xl w-full max-w-sm space-y-4 border border-zinc-800" style={{ backgroundColor: '#1a1a1a' }}>
        <h1 className="text-2xl font-bold text-center text-white">Connexion</h1>
        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: '/' })
          }}
        >
          <button
            type="submit"
            className="w-full bg-white text-black py-2.5 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Continuer avec Google
          </button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs text-zinc-500">
            <span className="px-2" style={{ backgroundColor: '#1a1a1a' }}>ou</span>
          </div>
        </div>
        <form
          className="space-y-2"
          action={async (fd: FormData) => {
            'use server'
            await signIn('nodemailer', { email: fd.get('email') as string, redirectTo: '/' })
          }}
        >
          <input
            name="email"
            type="email"
            placeholder="votre@email.com"
            className="w-full border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition"
            style={{ backgroundColor: '#2a2a2a' }}
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: '#e50914' }}
          >
            Lien magique par email
          </button>
        </form>
      </div>
    </div>
  )
}
