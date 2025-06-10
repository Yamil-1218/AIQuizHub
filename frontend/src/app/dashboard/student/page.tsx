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
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [attemptsCount, setAttemptsCount] = useState<number | null>(null);

  useEffect(() => {
    if (!initialized) return;

    if (initialized && !user) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'student') {
      router.push('/dashboard/instructor');
    }
  }, [user, initialized, router]);

useEffect(() => {
  if (user?.role === 'student') {
    const fetchData = async () => {
      try {
        const quizzesRes = await fetch('/api/auth/quizzes/available');
        const statusesRes = await fetch('/api/auth/students/quiz_statuses');
        const avgRes = await fetch('/api/auth/students/average-score');

        if (!quizzesRes.ok) throw new Error('Error al cargar cuestionarios');
        if (!statusesRes.ok) throw new Error('Error al cargar estados');

        const quizzesData = await quizzesRes.json();
        const statusesData = await statusesRes.json();

        // Map de estados { quizId => status }
        const statusMap = new Map<number, string>();
        statusesData.forEach((q: any) => {
          statusMap.set(q.id, q.status);
        });

        // Combinar: añadir status a cada quiz
        const quizzesWithStatus = (Array.isArray(quizzesData[0]) ? quizzesData[0] : quizzesData).map((quiz: any) => ({
          ...quiz,
          status: statusMap.get(quiz.id) || 'Disponible',
        }));

        setQuizzes(quizzesWithStatus);

        if (avgRes.ok) {
          const { average, attemptsCount } = await avgRes.json();
          setAverageScore(average);
          setAttemptsCount(attemptsCount);
        }

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
            icon={<FaClipboardList className="text-yellow-400 text-xl" />}
            title="Cuestionarios completados"
            value={attemptsCount !== null ? attemptsCount : quizzes.length}
          />
          <StatCard
            icon={<FaChartLine className="text-yellow-400 text-xl" />}
            title="Promedio"
            value={averageScore !== null ? `${averageScore.toFixed(1)}/10` : '—'}
          />
          <StatCard
            icon={<FaClipboardList className="text-yellow-400 text-xl" />}
            title="Cuestionarios"
            value={quizzes.length}
          />
        </section>

        {/* Cuestionarios disponibles */}
        <AvailableQuizzes quizzes={quizzes} />

        {/* Actividad reciente */}
        <RecentActivity />
      </main>
    </div>
  );
}

// Componentes auxiliares
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
  );
}

function AvailableQuizzes({ quizzes }: { quizzes: any[] }) {
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const router = useRouter();

  const tipoTraducciones: Record<string, string> = {
    "multiple_choice": "Opción múltiple",
    "true_false": "Verdadero/Falso",
    "short_answer": "Respuesta corta",
    "essay": "Ensayo",
    // Agrega más traducciones según tus tipos
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Cuestionarios Disponibles</h2>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Título</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Tema</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Creado el</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {quizzes.map((quiz, index) => {
              const isCompleted = quiz.status === 'Completado';
              return (
                <tr key={index} className="hover:bg-white/10 transition-all cursor-default">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{quiz.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tipoTraducciones[quiz.type] || quiz.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{quiz.topic}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        isCompleted
                          ? 'bg-green-400/20 text-green-400'
                          : 'bg-yellow-400/20 text-yellow-400'
                      }`}
                    >
                      {quiz.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString('es-ES') : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => !isCompleted && setSelectedQuiz(quiz)}
                      disabled={isCompleted}
                      className={`text-sm font-medium underline ${
                        isCompleted
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-yellow-400 hover:text-yellow-300 cursor-pointer'
                      }`}
                    >
                      Saber más
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setSelectedQuiz(null)}
              className="absolute top-2 right-4 text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-2">{selectedQuiz.title}</h3>
            <p className="text-sm text-gray-400 mb-4">
              {selectedQuiz.topic} / {selectedQuiz.type}
            </p>
            <p className="mb-4"><strong>Descripción:</strong> {selectedQuiz.description || 'Sin descripción disponible.'}</p>
            <div className="text-center">
              <button
                onClick={() => {
                  router.push(`/dashboard/student/quizzes/${selectedQuiz.id}`);
                }}
                className="bg-yellow-400 text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-yellow-300 transition"
              >
                Comenzar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
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
  );
}
