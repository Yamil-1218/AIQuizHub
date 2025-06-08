'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import {
  resetJustLoggedOut,
} from '@/store/slices/authSlice'
import toast from 'react-hot-toast'

export default function AuthRedirector() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()

  const { user, initialized, justLoggedOut } = useSelector(
    (state: RootState) => state.auth
  )

  useAuth()

  useEffect(() => {
    if (!initialized) return

    const isProtectedRoute =
      pathname?.startsWith('/dashboard') || pathname?.startsWith('/profile')

    if (!user) {
      if (isProtectedRoute) {
        if (!justLoggedOut) {
          toast.error('Por favor inicia sesión') // Evita mostrarlo si recién cerró sesión
        }
        router.push('/login')
      }
      return
    }

    // resetea el flag luego del redireccionamiento
    if (justLoggedOut) {
      dispatch(resetJustLoggedOut())
    }

    if (pathname === '/login') {
      router.push(`/dashboard/${user.role}`)
    }

    if (pathname?.startsWith('/dashboard')) {
      const currentRole = pathname.split('/')[2]
      if (user.role !== currentRole) {
        router.push(`/dashboard/${user.role}`)
      }
    }
  }, [pathname, router, user, initialized, justLoggedOut, dispatch])

  return null
}
