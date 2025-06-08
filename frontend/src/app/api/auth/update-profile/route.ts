import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const { fullName, email, institution, department } = await req.json();

        // Actualizar en la base de datos
        await db.query(
            'UPDATE users SET full_name = ?, email = ?, institution = ?, department = ? WHERE id = ?',
            [fullName, email, institution, department, decoded.id]
        );

        // Devolver usuario actualizado
        const [updatedRows] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]) as any[];
        const updatedUser = updatedRows[0];

        return NextResponse.json({
            id: updatedUser.id,
            role: updatedUser.role,
            email: updatedUser.email,
            fullName: updatedUser.full_name,
            institution: updatedUser.institution,
            department: updatedUser.department
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el perfil' },
            { status: 500 }
        );
    }
}