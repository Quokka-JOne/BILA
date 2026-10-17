import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Figtree, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'BILA — La esperanza de volver a encontrar',
    template: '%s · BILA',
  },
  description:
    'BILA conecta la identidad y la información esencial de las personas con los equipos de rescate para facilitar su identificación, localización y atención durante emergencias.',
  applicationName: 'BILA',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f3efeb',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${figtree.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only z-50 rounded-xl bg-navy px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
