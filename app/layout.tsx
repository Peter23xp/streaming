import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import PlatformBar from '@/components/layout/PlatformBar'
import Footer from '@/components/layout/Footer'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const viewport: Viewport = {
  themeColor: '#070709',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://streaming.peterakilimali.site'),
  title: {
    default: 'StreamVF — Films et Séries en Streaming',
    template: '%s | StreamVF',
  },
  description: 'Regardez des milliers de films et séries en VF et VOSTFR gratuitement.',
  keywords: ['streaming', 'films VF', 'séries VOSTFR', 'streaming gratuit', 'films en français'],
  openGraph: {
    siteName: 'StreamVF',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://streaming.peterakilimali.site',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@streamvf',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://streaming.peterakilimali.site',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="" />
      </head>
      <body className="min-h-screen font-sans">
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-bg/75 backdrop-blur-xl backdrop-saturate-150">
          <Navbar />
          <Suspense>
            <PlatformBar />
          </Suspense>
        </header>
        <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
