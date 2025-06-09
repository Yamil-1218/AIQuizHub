import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePasswords } from '@/utils/hash';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]) as any[];
    const user = rows[0];

    if (!user || !(await comparePasswords(password, user.password))) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    const tokenPayload = {
      id: user.id,
      role: user.role,
      email: user.email,
      fullName: user.full_name,
      institution: user.institution,
      department: user.department
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    const response = new NextResponse(
      JSON.stringify({ user: tokenPayload }), // solo mandamos el user, ya que el token está en la cookie
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    response.cookies.set('auth_session', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
    

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
