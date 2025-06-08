'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { updateUser } from '@/store/slices/authSlice';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, initialized } = useSelector((state: RootState) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        institution: '',
        department: ''
    });

    // Verificación de autenticación
    useEffect(() => {
        if (initialized && !user) {
            router.push('/login');
        }
    }, [user, initialized, router]);

    // Inicializar formulario
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
        try {
            const token = Cookies.get('auth_token');
            if (!token) {
                throw new Error('No autenticado');
            }

            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Error al actualizar');

            const updatedUser = await response.json();
            dispatch(updateUser(updatedUser));
            toast.success('Perfil actualizado correctamente');
            setIsEditing(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Error al actualizar el perfil');
            }
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
                            <h2 className="text-3xl font-bold">Perfil de {user.role === 'instructor' ? 'Instructor' : 'Estudiante'}</h2>
                            <div className="flex space-x-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            <FaTimes className="mr-2" />
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleUpdateProfile}
                                            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            <FaSave className="mr-2" />
                                            Guardar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg"
                                    >
                                        <FaEdit className="mr-2" />
                                        Editar
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

function ProfileField({ label, value, isEditing, onChange, type = 'text' }: {
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