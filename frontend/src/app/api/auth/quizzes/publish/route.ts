// src/app/api/auth/quizzes/[id]/publish/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/utils/jwt';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { title, questions } = await req.json();

    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    const user = token ? await getUserFromToken(token) : null;

    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el cuestionario pertenece al instructor
    const [quiz]: any = await query(
      'SELECT * FROM quizzes WHERE id = ? AND instructor_id = ?',
      [id, user.id]
    );

    if (!quiz) {
      return NextResponse.json({ error: 'Cuestionario no encontrado' }, { status: 404 });
    }

    // Actualizar el cuestionario a publicado
    await query(
      'UPDATE quizzes SET title = ?, status = ? WHERE id = ?',
      [title, 'published', id]
    );

    // Actualizar preguntas (en un sistema real podrías querer hacer algo más sofisticado aquí)
    for (const q of questions) {
      await query(
        'UPDATE questions SET question_text = ?, options = ?, correct_answer = ?, explanation = ? WHERE id = ? AND quiz_id = ?',
        [q.question_text, q.options ? JSON.stringify(q.options) : null, q.correct_answer, q.explanation || '', q.id, id]
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error('Error publicando cuestionario:', err);
    return NextResponse.json({ error: 'Error publicando cuestionario' }, { status: 500 });
  }
}