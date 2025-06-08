'use client';

import { FaBook, FaChartLine, FaClipboardList, FaComments } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, initialized } = useSelector((state: RootState) => state.auth);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
      return;
    }

    if (initialized && user?.role !== 'student') {
      router.push('/dashboard/instructor');
      return;
    }
  }, [user, initialized, router]);

  useEffect(() => {
    if (user?.role === 'student') {
      const fetchData = async () => {
        try {
          const quizzesRes = await fetch('/api/quizzes/available');
          
          if (!quizzesRes.ok) {
            throw new Error('Error al cargar cuestionarios');
          }

          const quizzesData = await quizzesRes.json();
          setQuizzes(quizzesData);
        } catch (error: any) {
          toast.error(error.message || 'Error al cargar datos');
        } finally {
          setLoadingData(false);
        }
      };

      fetchData();
    }
  }, [user]);

  if (!initialized || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">

      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Sección de bienvenida */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-indigo-800 to-purple-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">¡Bienvenido, {user?.fullName || 'Estudiante'}!</h2>
            <p className="text-gray-300">Prepárate para mejorar tus habilidades con nuestros cuestionarios interactivos</p>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<FaBook className="text-yellow-400 text-xl" />}
            title="Cursos completados"
            value="3"
          />
          <StatCard
            icon={<FaChartLine className="text-yellow-400 text-xl" />}
            title="Promedio"
            value="8.5/10"
          />
          <StatCard
            icon={<FaClipboardList className="text-yellow-400 text-xl" />}
            title="Cuestionarios"
            value={quizzes.length}
          />
        </section>

        {/* Cuestionarios disponibles */}
        <AvailableQuizzes quizzes={quizzes.slice(0, 3)} router={router} />

        {/* Actividad reciente */}
        <RecentActivity />
      </main>
    </div>
  )
}

// Componentes auxiliares (pueden estar en un archivo aparte)
function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string | number }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all">
      <div className="flex items-center space-x-4">
        <div className="bg-yellow-400/20 p-3 rounded-full">
          {icon}
        </div>
        <div>
          <p className="text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function AvailableQuizzes({ quizzes, router }: { quizzes: any[], router: any }) {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cuestionarios Disponibles</h2>
        <button
          onClick={() => router.push('/quizzes')}
          className="text-yellow-400 hover:text-yellow-300 flex items-center"
        >
          Ver todos <span className="ml-1">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            onClick={() => router.push(`/quiz/${quiz.id}`)}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all cursor-pointer hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{quiz.title}</h3>
              <span className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded">
                {quiz.difficulty}
              </span>
            </div>
            <p className="text-gray-400 mb-4">{quiz.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span>{quiz.questions} preguntas</span>
              <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">
                Comenzar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function RecentActivity() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Actividad Reciente</h2>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Cuestionario</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Calificación</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Feedback</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {[1, 2, 3].map((item) => (
              <tr key={item} className="hover:bg-white/10 transition-all cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">Fundamentos de TypeScript</td>
                <td className="px-6 py-4 whitespace-nowrap">2023-11-{10 + item}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded text-sm">
                    9/10
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-yellow-400 hover:text-yellow-300 flex items-center">
                    <FaComments className="mr-1" /> Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}