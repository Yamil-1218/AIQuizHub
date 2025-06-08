'use client'

import { Provider } from 'react-redux'
import { store } from '@/store'
import { Toaster } from 'react-hot-toast'
import AuthRedirector from '../../components/AuthRedirector'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRedirector />
      <Toaster position="top-right" />
      {children}
    </Provider>
  )
}
