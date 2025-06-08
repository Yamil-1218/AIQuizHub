// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false, error: 'No autenticado' }, { status: 401 })
    }

    const decoded = await verifyToken(token)

    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
        fullName: decoded.fullName,
        ...(decoded.institution && { institution: decoded.institution }),
        ...(decoded.department && { department: decoded.department }),
      },
    })
  } catch {
    return NextResponse.json({ authenticated: false, error: 'Token inválido' }, { status: 401 })
  }
}
