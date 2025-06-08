// src/hooks/useAuth.ts
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser, logout, setLoading, setError } from '@/store/slices/authSlice'

export function useAuth() {
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchUser() {
      dispatch(setLoading(true))
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          dispatch(logout())
          return
        }
        const data = await res.json()
        if (data.authenticated) {
          dispatch(setUser(data.user))
        } else {
          dispatch(logout())
        }
      } catch (error) {
        dispatch(setError('Error al cargar usuario'))
      }
    }
    fetchUser()
  }, [dispatch])
}
