import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const quizzes: any[] = await query(`
      SELECT topic, type, status, created_at
      FROM quizzes
      WHERE status = 'published'
      ORDER BY created_at DESC
    `);

    return NextResponse.json(quizzes, { status: 200 });
  } catch (err) {
    console.error('Error al obtener cuestionarios disponibles:', err);
    return NextResponse.json(
      { error: 'Error al obtener cuestionarios disponibles' },
      { status: 500 }
    );
  }
}
