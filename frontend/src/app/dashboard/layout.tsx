'use client'

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { selectCurrentUser, selectAuthInitialized } from '@/store/slices/authSlice'
import LoadingOverlay from '../../../components/LoadingOverlay'
import StudentNavbar from '../../../components/dashboard/StudentNavbar'
import InstructorNavbar from '../../../components/dashboard/InstructorNavbar'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useSelector(selectCurrentUser)
  const initialized = useSelector(selectAuthInitialized)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/login')
    }
  }, [initialized, user, router])

  if (!initialized) {
    return <LoadingOverlay />
  }

  if (!user) {
    // Aquí puede no mostrar nada porque estamos redirigiendo, o mostrar un loading
    return null
  }

  return (
    <div className={inter.className}>
      {pathname.includes('/student') ? <StudentNavbar /> : <InstructorNavbar />}
      <main className="pt-20 px-4 min-h-screen">{children}</main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
