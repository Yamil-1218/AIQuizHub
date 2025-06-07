'use client'

import { FaChalkboardTeacher, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function InstructorNavbar() {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/')
  }

  return (
    <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 fixed w-full z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard/instructor" className="text-2xl font-bold">
            Panel del Instructor
          </Link>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/profile')}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
            >
              <FaUser className="mr-2" />
              <span>Perfil</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
            >
              <FaSignOutAlt className="mr-2" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}