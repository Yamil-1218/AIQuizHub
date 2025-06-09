// src/app/api/auth/quizzes/created/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/utils/jwt';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    const user = token ? await getUserFromToken(token) : null;

    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const quizzes: any = await query(
      'SELECT id, title, created_at, status FROM quizzes WHERE instructor_id = ? ORDER BY created_at DESC',
      [user.id]
    );

    return NextResponse.json(quizzes, { status: 200 });
  } catch (err) {
    console.error('Error obteniendo cuestionarios:', err);
    return NextResponse.json(
      { error: 'Error obteniendo cuestionarios' },
      { status: 500 }
    );
  }
}