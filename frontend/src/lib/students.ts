// lib/api/students.ts

export async function deleteStudent(id: number) {
  const res = await fetch(`/api/auth/students/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message || 'Error al eliminar estudiante' };
  }

  return { success: true, message: data.message || 'Estudiante eliminado correctamente' };
}


export async function updateStudent(
  id: number,
  updates: {
    fullName: string;
    email: string;
    institution?: string;
    department?: string;
    birthDate?: string;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/[id]/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || 'Error al actualizar' };
    }

    return { success: true, message: data.message || 'Estudiante actualizado correctamente' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error desconocido al actualizar' };
  }
}
