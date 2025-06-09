import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query(`
  SELECT 
  id, 
  role, 
  full_name AS fullName, 
  email, 
  institution, 
  COALESCE(department, '') AS department, 
  birth_date AS birthDate,
  last_login AS lastLogin
FROM users
WHERE role = 'student'

`);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
