'use client'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import StudentNavbar from '../../../components/dashboard/StudentNavbar'
import InstructorNavbar from '../../../components/dashboard/InstructorNavbar'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className={inter.className}>
      {pathname?.includes('/student') && <StudentNavbar />}
      {pathname?.includes('/instructor') && <InstructorNavbar />}
      <main className="pt-20 px-4 min-h-screen">
        {children}
      </main>
    </div>
  )
}