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

    // Obtener scores del estudiante
    const scores = (await query(
      'SELECT score FROM quiz_assignments WHERE student_id = ? AND score IS NOT NULL',
      [user.id]
    )) as { score: number }[];

    const attemptsResult = (await query(
      'SELECT COUNT(*) as attemptsCount FROM quiz_assignments WHERE student_id = ?',
      [user.id]
    )) as { attemptsCount: number }[];

    const attemptsCount = attemptsResult[0]?.attemptsCount || 0;

    if (scores.length === 0) {
      return NextResponse.json({ average: null, attemptsCount });
    }

    const total = scores.reduce((sum, row) => sum + row.score, 0);
    const average = total / scores.length;

    return NextResponse.json({ average, attemptsCount });
  } catch (error: any) {
    console.error('❌ Error obteniendo promedio y conteo:', error.message);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
