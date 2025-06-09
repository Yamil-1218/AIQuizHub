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
    const [quiz]: any = await query('SELECT * FROM quizzes WHERE id = ?', [quizId]);

    if (!quiz) {
      return NextResponse.json({ error: 'Cuestionario no encontrado' }, { status: 404 });
    }

    const [questions]: any = await query('SELECT * FROM questions WHERE quiz_id = ?', [quizId]);

    const parsedQuestions = questions.map((q: any) => {
      let parsedOptions = null;

      if (q.options) {
        try {
          parsedOptions = JSON.parse(q.options);
        } catch (err) {
          console.warn(`Opciones malformadas en pregunta con ID ${q.id}:`, q.options);
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
      questions: parsedQuestions,
    });
  } catch (err) {
    console.error('Error obteniendo cuestionario:', err);
    return NextResponse.json({ error: 'Error obteniendo cuestionario' }, { status: 500 });
  }
}

