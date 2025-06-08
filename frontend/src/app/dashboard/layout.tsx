'use client'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import StudentNavbar from '../../../components/dashboard/StudentNavbar'
import InstructorNavbar from '../../../components/dashboard/InstructorNavbar'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import LoadingOverlay from '../../../components/LoadingOverlay'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, initialized } = useSelector((state: RootState) => state.auth)

  if (!initialized) {
    return <LoadingOverlay />
  }

  return (
    <div className={inter.className}>
      {pathname?.includes('/student') ? <StudentNavbar /> : <InstructorNavbar />}
      <main className="pt-20 px-4 min-h-screen">
        {children}
      </main>
    </div>
  )
}