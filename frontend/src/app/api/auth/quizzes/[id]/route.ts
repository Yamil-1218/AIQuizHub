import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/utils/jwt';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    const user = token ? await getUserFromToken(token) : null;

    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const [quiz]: any = await query(
      'SELECT instructor_id FROM quizzes WHERE id = ?',
      [id]
    );

    if (!quiz || quiz.instructor_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await req.json(); //obtener datos del frontend

    const { title, description, topic, type, questions, status } = body;

    // Actualiza el cuestionario
    await query(
      'UPDATE quizzes SET title = ?, description = ?, topic = ?, type = ?, status = ? WHERE id = ?',
      [title, description, topic, type, status, id]
    );

    // Elimina preguntas anteriores (opcional si editas in-place)
    await query('DELETE FROM questions WHERE quiz_id = ?', [id]);

    // Inserta nuevas preguntas
    for (const q of questions) {
      await query(
        'INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
        [
          id,
          q.question_text,
          q.question_type,
          q.options ? JSON.stringify(q.options) : null,
          q.correct_answer,
        ]
      );
    }

    return NextResponse.json({ message: 'Cuestionario actualizado correctamente' }, { status: 200 });

  } catch (err) {
    console.error('Error actualizando cuestionario:', err);
    return NextResponse.json({ error: 'Error actualizando cuestionario' }, { status: 500 });
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

    const questionsWithParsedOptions = questions.map((q: any) => {
      let parsedOptions = null;
      if (q.options) {
        if (typeof q.options === 'string') {
          try {
            parsedOptions = JSON.parse(q.options);
          } catch (e) {
            console.error(`Error parsing options for question ID ${q.id}:`, q.options);
            parsedOptions = null;
          }
        } else if (Array.isArray(q.options)) {
          parsedOptions = q.options; // Ya es array, no hacer nada
        } else {
          parsedOptions = null;
        }
      }
      return {
        ...q,
        options: parsedOptions,
      };
    });

    return NextResponse.json({
      ...quiz,
      questions: questionsWithParsedOptions,
    });
  } catch (err) {
    console.error('Error obteniendo cuestionario:', err);
    return NextResponse.json({ error: 'Error obteniendo cuestionario' }, { status: 500 });
  }
}