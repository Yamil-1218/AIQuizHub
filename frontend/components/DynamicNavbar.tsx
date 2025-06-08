'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import Navbar from './Navbar'
import InstructorNavbar from './dashboard/InstructorNavbar'
import StudentNavbar from './dashboard/StudentNavbar'

export default function DynamicNavbar() {
  const user = useSelector((state: RootState) => state.auth.user)

  if (!user) return <Navbar /> // Sin login muestra Navbar general

  if (user.role === 'instructor') return <InstructorNavbar />
  if (user.role === 'student') return <StudentNavbar />

  return <Navbar /> // fallback por si acaso
}
