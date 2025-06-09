'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteStudent, updateStudent } from '@/lib/students';
import toast from 'react-hot-toast';

interface Student {
  id: number;
  fullName: string;
  email: string;
  lastLogin: string | null;
}

export default function RegisteredStudents() {
  const router = useRouter();
  const { user, initialized } = useSelector((state: RootState) => state.auth);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Redirección de acuerdo al estado de usuario y su rol
  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
      return;
    }

    if (initialized && user?.role !== 'instructor') {
      router.push('/dashboard/student');
      return;
    }
  }, [user, initialized, router]);

  // Cargar estudiantes si el usuario es instructor
  useEffect(() => {
    if (user?.role === 'instructor') {
      const fetchStudents = async () => {
        try {
          const res = await fetch('/api/auth/students');
          if (!res.ok) throw new Error('Error al cargar estudiantes');
          const data = await res.json();
          setStudents(data);
        } catch (error: any) {
          toast.error(error.message || 'Error inesperado');
        } finally {
          setLoadingData(false);
        }
      };

      fetchStudents();
    }
  }, [user]);

  if (!initialized || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Estudiantes Registrados</h1>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full table-auto">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Último acceso</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Cuestionarios</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Promedio</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No hay estudiantes registrados.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-white/10 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="bg-yellow-400/20 text-yellow-400 w-8 h-8 rounded-full flex items-center justify-center">
                          {student.fullName.charAt(0)}
                        </div>
                        <span>{student.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">5</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded text-sm">
                        8.2/10
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.lastLogin
                        ? new Date(student.lastLogin).toLocaleDateString()
                        : 'Nunca'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-4">
                      <button
                        onClick={() => router.push(`/dashboard/instructor/registroStu/${student.id}`)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/dashboard/instructor/registroStu/${student.id}`)}
                        className="text-red-400 hover:text-red-300"
                        >
                        <FaTrash />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
