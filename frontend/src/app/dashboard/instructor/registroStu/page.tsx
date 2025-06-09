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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
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
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.lastLogin
                      ? new Date(student.lastLogin).toLocaleDateString()
                      : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">5</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded text-sm">
                      8.2/10
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-4">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsModalOpen(true);
                      }}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <FaEdit />
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const confirmDelete = confirm(`¿Estás seguro de eliminar a ${student.fullName}?`);
                        if (!confirmDelete) return;

                        const result = await deleteStudent(student.id);
                        toast[result.success ? 'success' : 'error'](result.message);

                        if (result.success) {
                          setStudents(prev => prev.filter(s => s.id !== student.id));
                        }
                      }}
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

    {/* Aquí va el modal, dentro del return */}
    {isModalOpen && selectedStudent && (
     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Editar Estudiante</h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);
              const fullName = formData.get('fullName') as string;
              const email = formData.get('email') as string;

              const result = await updateStudent(selectedStudent.id, { fullName, email });
              toast[result.success ? 'success' : 'error'](result.message);

              if (result.success) {
                setStudents(prev =>
                  prev.map(s => (s.id === selectedStudent.id ? { ...s, fullName, email } : s))
                );
                setIsModalOpen(false);
                setSelectedStudent(null);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium">
                Nombre completo
              </label>
              <input
                id="fullName"
                name="fullName"
                defaultValue={selectedStudent.fullName}
                className="mt-1 w-full border px-3 py-2 rounded bg-white text-black"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={selectedStudent.email}
                className="mt-1 w-full border px-3 py-2 rounded bg-white text-black"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedStudent(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);





}
