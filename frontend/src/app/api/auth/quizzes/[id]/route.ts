// src/app/api/auth/quizzes/[id]/publish/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/utils/jwt';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    const user = token ? await getUserFromToken(token) : null;

    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el quiz pertenece al instructor
    const [quiz]: any = await query(
      'SELECT instructor_id FROM quizzes WHERE id = ?',
      [params.id]
    );

    if (!quiz || quiz.instructor_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Actualizar estado a publicado
    await query(
      'UPDATE quizzes SET status = ? WHERE id = ?',
      ['published', params.id]
    );

    return NextResponse.json(
      { message: 'Cuestionario publicado con éxito' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error publicando cuestionario:', err);
    return NextResponse.json(
      { error: 'Error publicando cuestionario' },
      { status: 500 }
    );
  }
}