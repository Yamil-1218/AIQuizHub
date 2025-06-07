import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIQuizHub',
  description: 'Plataforma de cuestionarios con IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Este layout se aplica solo fuera de /dashboard */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
