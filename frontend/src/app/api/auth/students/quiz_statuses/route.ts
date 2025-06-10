import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    const user = token ? await getUserFromToken(token) : null;

    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Castear a array para que TS no se queje
    const quizzes = (await query('SELECT * FROM quizzes ORDER BY created_at DESC')) as any[];

    const assignments = (await query(
      'SELECT quiz_id FROM quiz_assignments WHERE student_id = ?',
      [user.id]
    )) as { quiz_id: number }[];

    const completedQuizIds = new Set(assignments.map(a => a.quiz_id));

    const quizzesWithStatus = quizzes.map((quiz) => ({
      ...quiz,
      status: completedQuizIds.has(quiz.id) ? 'Completado' : 'Disponible',
    }));

    return NextResponse.json(quizzesWithStatus);
  } catch (error: any) {
    console.error('❌ Error obteniendo estados de quizzes:', error.message);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
