'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { updateUser } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, initialized } = useSelector((state: RootState) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // <-- nuevo estado loading
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    department: ''
  });

  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
    }
  }, [initialized, user, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        institution: user.institution || '',
        department: user.department || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setIsLoading(true); // <-- activamos loading
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el perfil');
      }

      const updatedUser = await response.json();

      dispatch(updateUser(updatedUser));
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error desconocido al actualizar el perfil');
      }
    } finally {
      setIsLoading(false); // <-- desactivamos loading en todos los casos
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      <main className="container mx-auto px-4 pt-24 pb-8">
        <section className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                Perfil de {user.role === 'instructor' ? 'Instructor' : 'Estudiante'}
              </h2>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading} // evita cancelar mientras carga
                      className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                    >
                      <FaTimes />
                      <span>Cancelar</span>
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isLoading} // deshabilita botón al cargar
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      ) : (
                        <FaSave />
                      )}
                      <span>{isLoading ? 'Guardando...' : 'Guardar'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg"
                  >
                    <FaEdit />
                    <span>Editar</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <ProfileField
                label="Nombre completo"
                value={formData.fullName}
                isEditing={isEditing}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />

              <ProfileField
                label="Correo electrónico"
                value={formData.email}
                isEditing={isEditing}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="email"
              />

              {user.role === 'student' && (
                <ProfileField
                  label="Institución"
                  value={formData.institution}
                  isEditing={isEditing}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                />
              )}

              {user.role === 'instructor' && (
                <ProfileField
                  label="Departamento"
                  value={formData.department}
                  isEditing={isEditing}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProfileField({
  label,
  value,
  isEditing,
  onChange,
  type = 'text'
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <h3 className="text-gray-400 text-sm mb-1">{label}</h3>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-yellow-400 focus:outline-none"
        />
      ) : (
        <p className="text-xl py-2 border-b border-white/10">{value || 'No especificado'}</p>
      )}
    </div>
  );
}
