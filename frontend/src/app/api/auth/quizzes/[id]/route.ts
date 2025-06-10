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

    // Verificar que el quiz pertenece al instructor
    const [quiz]: any = await query(
      'SELECT instructor_id, status FROM quizzes WHERE id = ?',
      [params.id]
    );

    if (!quiz || quiz.instructor_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Opcional: solo permitir publicar si está en borrador
    if (quiz.status === 'published') {
      return NextResponse.json({ error: 'Cuestionario ya está publicado' }, { status: 400 });
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

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const quizId = params.id;

  try {
    const [quiz]: any = await query(
      'SELECT id, instructor_id, title, description, topic, type, status, created_at as createdAt FROM quizzes WHERE id = ?',
      [quizId]
    );

    if (!quiz) {
      return NextResponse.json({ error: 'Cuestionario no encontrado' }, { status: 404 });
    }

    const questions: any = await query(
      'SELECT id, question_text, question_type, options, correct_answer FROM questions WHERE quiz_id = ?',
      [quizId]
    );

    return NextResponse.json({
      ...quiz,
      questions: questions.map((q: any) => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : null
      }))
    });
  } catch (err) {
    console.error('Error obteniendo cuestionario:', err);
    return NextResponse.json({ error: 'Error obteniendo cuestionario' }, { status: 500 });
  }
}
