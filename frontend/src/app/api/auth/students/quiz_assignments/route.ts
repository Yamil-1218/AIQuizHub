import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/utils/jwt';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    const user = token ? await getUserFromToken(token) : null;

    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { quiz_id, answers, status, score } = await req.json();

    if (!quiz_id || typeof score !== 'number') {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    await query(
      'INSERT INTO quiz_assignments (quiz_id, student_id, score, completed) VALUES (?, ?, ?, ?)',
      [quiz_id, user.id, score, status]
    );

    return NextResponse.json({ message: 'Respuestas enviadas correctamente' }, { status: 200 });
  } catch (err: any) {
    console.error('❌ Error al guardar quiz_assignments:', err.message, err.stack);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
