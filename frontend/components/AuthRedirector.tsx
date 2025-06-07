'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setUser } from '@/store/slices/authSlice'
import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

export default function AuthRedirector() {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        const token = Cookies.get('token')
        const isAuthPage = pathname === '/login' || pathname === '/register'

        // Si no hay token y está en ruta protegida
        if (!token && pathname?.startsWith('/dashboard')) {
            router.push('/login')
            toast.error('Por favor inicia sesión')
            return
        }

        // Si hay token, procesarlo
        if (token) {
            try {
                const decoded = jwt.decode(token) as {
                    id: string
                    role: 'student' | 'instructor'
                    email: string
                    fullName?: string
                    institution?: string
                    department?: string
                }

                if (!decoded?.id || !decoded.role) {
                    throw new Error('Token inválido')
                }

                // Si no hay usuario en Redux pero sí token válido
                if (!user) {
                    dispatch(setUser({
                        id: decoded.id,
                        role: decoded.role,
                        email: decoded.email,
                        fullName: decoded.fullName,
                        ...(decoded.role === 'student' && { institution: decoded.institution }),
                        ...(decoded.role === 'instructor' && { department: decoded.department })
                    }))
                }

                // Redirigir desde auth pages si ya está autenticado
                if (isAuthPage) {
                    router.push(`/dashboard/${decoded.role}`)
                    return
                }

                // Verificar coincidencia de rol en dashboard
                if (pathname?.startsWith('/dashboard')) {
                    const currentRole = pathname.split('/')[2]
                    if (decoded.role !== currentRole) {
                        router.push(`/dashboard/${decoded.role}`)
                    }
                }

            } catch (error) {
                console.error('Error de autenticación:', error)
                Cookies.remove('token')
                if (pathname?.startsWith('/dashboard')) {
                    router.push('/login')
                    toast.error('Sesión inválida, por favor inicia sesión nuevamente')
                }
            }
        }
    }, [pathname, router, dispatch, user])

    return null
}