import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// DELETE /api/auth/students/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const studentId = Number(params.id);

  if (isNaN(studentId)) {
    return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
  }

  try {
    const [result]: any = await db.query('DELETE FROM users WHERE id = ? AND role = "student"', [studentId]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Estudiante no encontrado o ya eliminado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT /api/auth/students/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const studentId = Number(params.id);

  if (isNaN(studentId)) {
    return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
  }

  const body = await req.json();
  const { fullName, email, institution, department, birthDate } = body;

  try {
    const [result]: any = await db.query(
      `
      UPDATE users
      SET 
        full_name = ?, 
        email = ?, 
        institution = ?, 
        department = ?, 
        birth_date = ?
      WHERE id = ? AND role = "student"
    `,
      [fullName, email, institution, department, birthDate, studentId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Estudiante no encontrado o sin cambios' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Estudiante actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
