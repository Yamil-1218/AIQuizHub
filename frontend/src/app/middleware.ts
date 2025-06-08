import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/utils/jwt'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/register', '/']
  const isPublic = publicPaths.some(path => pathname.startsWith(path))

  // Si es ruta pública y no hay token, continuar
  if (isPublic && !token) {
    return NextResponse.next()
  }

  try {
    // Verificar token para rutas protegidas
    if (token) {
      const decoded = await verifyToken(token)
      
      // Redirigir según el rol si está en página pública
      if (isPublic) {
        const redirectPath = decoded.role === 'student' 
          ? '/dashboard/student' 
          : '/dashboard/instructor'
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }

      // Verificar acceso según rol
      if (pathname.startsWith('/dashboard/student') && decoded.role !== 'student') {
        return NextResponse.redirect(new URL('/dashboard/instructor', request.url))
      }

      if (pathname.startsWith('/dashboard/instructor') && decoded.role !== 'instructor') {
        return NextResponse.redirect(new URL('/dashboard/student', request.url))
      }
    } else {
      // No hay token pero es ruta protegida
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error) {
    // Token inválido o expirado
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth_token')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}