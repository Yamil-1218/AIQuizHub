import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/utils/hash';

export async function POST(req: Request) {
  const {
    email,
    password,
    role,
    fullName,
    birthDate,
    institution,
    department
  } = await req.json();

  if (!email || !password || !role || !fullName) {
    return NextResponse.json({ error: 'Campos obligatorios faltantes' }, { status: 400 });
  }

  // Validar campos según el rol
  if (role === 'student' && !institution) {
    return NextResponse.json({ error: 'Faltan datos de estudiante' }, { status: 400 });
  }

  if (role === 'instructor' && !department) {
    return NextResponse.json({ error: 'Faltan datos de instructor' }, { status: 400 });
  }

  const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]) as any[];
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Usuario ya existe' }, { status: 409 });
  }

  const hashed = await hashPassword(password);

  await db.query(
    `INSERT INTO users 
      (email, password, role, full_name, birth_date, institution, department)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      email,
      hashed,
      role,
      fullName,
      birthDate || null,
      institution || null,
      department || null
    ]
  );

  return NextResponse.json({ message: 'Usuario creado con éxito' });
}
