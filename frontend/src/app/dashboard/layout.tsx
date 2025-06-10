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
import { Toaster } from 'react-hot-toast'

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
    return null
  }

  return (
    <div className={inter.className}>
      {pathname.includes('/student') ? <StudentNavbar /> : <InstructorNavbar />}
      <main className="pt-20 px-4 min-h-screen">{children}</main>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  )
}
