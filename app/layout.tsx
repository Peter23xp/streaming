import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import PlatformBar from '@/components/layout/PlatformBar'
import Footer from '@/components/layout/Footer'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'StreamVF — Films et Séries en Streaming',
    template: '%s | StreamVF',
  },
  description: 'Regardez des milliers de films et séries en VF et VOSTFR gratuitement.',
  openGraph: {
    siteName: 'StreamVF',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        className={inter.className}
        style={{ backgroundColor: '#080808', color: '#cccccc', minHeight: '100vh' }}
      >
        <Navbar />
        <Suspense>
          <PlatformBar />
        </Suspense>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
