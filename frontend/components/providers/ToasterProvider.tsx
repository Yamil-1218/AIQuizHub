'use client'

import { Toaster } from 'react-hot-toast'

export const ToasterProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#1e1b4b',
          color: '#fff',
          border: '1px solid #7e22ce',
        },
        success: {
          style: {
            background: '#10b981',
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        },
      }}
    />
  )
}