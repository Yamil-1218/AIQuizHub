'use client'

import { FaChalkboardTeacher, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/index'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import toast from 'react-hot-toast'

export default function StudentNavbar() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = async () => {
    try {
      // Llamar al API de logout primero
      await fetch('/api/auth/logout', {
        method: 'POST'
      })
      
      // Limpiar frontend
      dispatch(logout())
      router.push('/login')
      toast.success('Sesión cerrada correctamente')
    } catch (error) {
      toast.error('Error al cerrar sesión')
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 fixed w-full z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard/student" className="text-2xl font-bold">
            Mi Aprendizaje
          </Link>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="hidden md:inline text-sm bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full">
                {user.fullName || 'Estudiante'}
              </span>
            )}

            <button
              onClick={() => router.push('/profile')}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
              title="Perfil"
            >
              <FaUser className="mr-2" />
              <span className="hidden sm:inline">Perfil</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
              title="Cerrar sesión"
            >
              <FaSignOutAlt className="mr-2" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}