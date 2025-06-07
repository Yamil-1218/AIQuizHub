import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePasswords } from '@/utils/hash';
import { generateToken } from '@/utils/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]) as any[];
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const match = await comparePasswords(password, user.password);
    if (!match) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const token = generateToken({ id: user.id, role: user.role });

    const response = NextResponse.json({
      token,
      role: user.role,
      fullName: user.full_name,
      ...(user.role === 'student' && {
        institution: user.institution
      }),
      ...(user.role === 'instructor' && {
        department: user.department
      })
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
