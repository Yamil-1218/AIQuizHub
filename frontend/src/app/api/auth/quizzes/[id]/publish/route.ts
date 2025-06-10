// /api/auth/quizzes/[id]/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/utils/jwt';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    const user = token ? await getUserFromToken(token) : null;

    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { title, description } = body;

    const [quiz]: any = await query(
      'SELECT instructor_id, status FROM quizzes WHERE id = ?',
      [params.id]
    );

    if (!quiz || quiz.instructor_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if (quiz.status === 'published') {
      return NextResponse.json({ error: 'Ya publicado' }, { status: 400 });
    }

    // Solo actualiza si se pasaron datos
    if (title || description) {
      await query(
        'UPDATE quizzes SET title = ?, description = ?, status = ? WHERE id = ?',
        [title || quiz.title, description || quiz.description, 'published', params.id]
      );
    } else {
      await query('UPDATE quizzes SET status = ? WHERE id = ?', ['published', params.id]);
    }

    return NextResponse.json({ message: 'Publicado con éxito' }, { status: 200 });
  } catch (err) {
    console.error('Error publicando cuestionario:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
