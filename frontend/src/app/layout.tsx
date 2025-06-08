import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './client-layout'
import DynamicNavbar from '../../components/DynamicNavbar'
import Footer from '../../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIQuizHub',
  description: 'Plataforma de cuestionarios con IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50`}>
        <ClientLayout>
          <DynamicNavbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  )
}
