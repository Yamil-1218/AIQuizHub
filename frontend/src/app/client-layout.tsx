'use client';

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { ToasterProvider } from '../../components/providers/ToasterProvider'
import { Provider } from 'react-redux'
import { store } from '../store'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Navbar />
      <main className="min-h-screen">
        {children}
        <ToasterProvider />
      </main>
      <Footer />
    </Provider>
  )
}
