'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from '@/store/slices/authSlice';
import { RootState } from '@/store/index';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      const token = Cookies.get('token');
      if (token) {
        try {
          const decoded = jwt.decode(token) as {
            id: string;
            role: 'student' | 'instructor';
            fullName?: string;
            email?: string;
            institution?: string;
            department?: string;
          };
          
          if (decoded) {
            dispatch(setUser({
              id: decoded.id, // Campo obligatorio
              role: decoded.role,
              email: decoded.email || '', // Valor por defecto para email
              fullName: decoded.fullName,
              ...(decoded.role === 'student' && { institution: decoded.institution }),
              ...(decoded.role === 'instructor' && { department: decoded.department })
            }));
          } else {
            router.push('/login');
          }
        } catch (err) {
          console.error('Error decoding token:', err);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, dispatch, router]);

  const handleLogout = () => {
    Cookies.remove('token');
    dispatch(logout());
    router.push('/login');
    toast.success('Sesión cerrada correctamente');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      <main className="container mx-auto px-4 pt-24 pb-8">
        <section className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Perfil de {user.role === 'instructor' ? 'Instructor' : 'Estudiante'}</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-gray-400 text-sm">Nombre completo</h3>
                <p className="text-xl">{user.fullName || 'No especificado'}</p>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm">Correo electrónico</h3>
                <p className="text-xl">{user.email || 'No especificado'}</p>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm">Rol</h3>
                <p className="text-xl capitalize">{user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}