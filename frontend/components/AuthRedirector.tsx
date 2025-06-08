'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { setUser, logout } from '@/store/slices/authSlice'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

export default function AuthRedirector() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Si ya hay usuario, no hace falta volver a verificar
    if (user) return

    const checkAuth = async () => {
      const token = Cookies.get('auth_token')

      if (!token) {
        if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/profile')) {
          router.push('/login')
          toast.error('Por favor inicia sesión')
        }
        dispatch(logout())
        return
      }

      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()

        if (!res.ok) throw new Error(data.error)

        dispatch(setUser(data.user))

        if (pathname === '/login') {
          router.push(`/dashboard/${data.user.role}`)
        }

        if (pathname?.startsWith('/dashboard')) {
          const currentRole = pathname.split('/')[2]
          if (data.user.role !== currentRole) {
            router.push(`/dashboard/${data.user.role}`)
          }
        }

      } catch (err) {
        Cookies.remove('auth_token')
        dispatch(logout())
        if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/profile')) {
          router.push('/login')
          toast.error('Sesión expirada, por favor inicia sesión nuevamente')
        }
      }
    }

    checkAuth()
  }, [pathname, router, dispatch, user])

  return null
}
