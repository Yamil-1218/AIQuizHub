'use client';

import { FaUsers, FaFileAlt, FaChartBar, FaPlus, FaComments } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';

export default function InstructorDashboard() {
  const router = useRouter();
  const { user, initialized } = useSelector((state: RootState) => state.auth);
  const [students, setStudents] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

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

  useEffect(() => {

    if (user?.role === 'instructor') {
      const fetchData = async () => {
        try {
          const [studentsRes, quizzesRes] = await Promise.all([
            fetch('/api/auth/students'),
            fetch('/api/auth/quizzes/created')
          ]);

          if (!studentsRes.ok) throw new Error('Error al cargar estudiantes');
          if (!quizzesRes.ok) throw new Error('Error al cargar cuestionarios');

          const [studentsData, quizzesData] = await Promise.all([
            studentsRes.json(),
            quizzesRes.json()
          ]);

          setStudents(studentsData);
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

      {/* Contenido principal con padding-top para el navbar fijo */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Sección de bienvenida */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-indigo-800 to-purple-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Bienvenido, {user?.fullName || 'Instructor'}!</h2>
            <p className="text-gray-300">Gestiona tus cursos y sigue el progreso de tus estudiantes</p>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<FaUsers className="text-yellow-400 text-xl" />}
            title="Estudiantes"
            value="10"
          />
          <StatCard
            icon={<FaFileAlt className="text-yellow-400 text-xl" />}
            title="Cuestionarios"
            value={quizzes.length}
            onClick={() => router.push('/dashboard/instructor/quizzes/list')}
          />
          <StatCard
            icon={<FaChartBar className="text-yellow-400 text-xl" />}
            title="Promedio General"
            value="7.8/10"
          />
          <StatCard
            icon={<FaUsers className="text-yellow-400 text-xl" />}
            title="Cursos Activos"
            value="4"
          />
        </section>

        {/* Acciones rápidas */}
        <QuickActions router={router} />

        {/* Estudiantes recientes */}
        <RecentStudents students={students.slice(-5).reverse()} router={router} /> {/*Reverse invierte el orden de los estudiantes para que el mas recente se muestre primero*/}


        {/* Cuestionarios recientes */}
        <RecentQuizzes quizzes={quizzes.slice(0, 5)} router={router} />
      </main>
    </div>
  )
}

// Componentes auxiliares
function StatCard({ icon, title, value, onClick }: { icon: React.ReactNode, title: string, value: string | number, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all">
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

function QuickActions({ router }: { router: any }) {
  const actions = [
    {
      icon: <FaPlus className="text-yellow-400 text-xl" />,
      title: "Nuevo Cuestionario",
      description: "Crea un nuevo examen",
      onClick: () => router.push('/dashboard/instructor/quizzes/new')
    },
    {
      icon: <FaUsers className="text-yellow-400 text-xl" />,
      title: "Ver Estudiantes",
      description: "Gestiona tus alumnos",
      onClick: () => router.push('/dashboard/instructor/registroStu')
    },
    {
      icon: <FaChartBar className="text-yellow-400 text-xl" />,
      title: "Analíticas",
      description: "Ver estadísticas",
      onClick: () => router.push('/analytics')
    },
    {
      icon: <FaComments className="text-yellow-400 text-xl" />,
      title: "Evaluador IA",
      description: "Configura evaluaciones",
      onClick: () => window.open('https://ai.google.dev/gemini-api/docs', '_blank')
    }

  ]

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Acciones Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400/20 p-3 rounded-full group-hover:bg-yellow-400/30 transition-all">
                {action.icon}
              </div>
              <div>
                <h3 className="font-bold">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function RecentStudents({ students, router }: { students: any[], router: any }) {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Estudiantes Recientes</h2>
        <button
          onClick={() => router.push('/dashboard/instructor/registroStu')}
          className="text-yellow-400 hover:text-yellow-300 flex items-center"
        >
          Ver todos <span className="ml-1">→</span>
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Estudiante</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Último Acceso</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Cuestionarios</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Promedio</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-white/10 transition-all">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-400/20 text-yellow-400 w-8 h-8 rounded-full flex items-center justify-center">
                      {student.fullName.charAt(0)}
                    </div>
                    <span>{student.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.lastLogin ? new Date(student.lastLogin).toLocaleDateString() : 'Nunca'}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">5</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded text-sm">
                    8.2/10
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => router.push(`/student/${student.id}`)}
                    className="text-yellow-400 hover:text-yellow-300 text-sm"
                  >
                    Ver detalles
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

function RecentQuizzes({ quizzes, router }: { quizzes: any[], router: any }) {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cuestionarios Recientes</h2>
        <button
          onClick={() => router.push('/quizzes')}
          className="text-yellow-400 hover:text-yellow-300 flex items-center"
        >
          Ver todos <span className="ml-1">→</span>
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Título</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Estudiantes</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Promedio</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-white/10 transition-all">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{quiz.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">24/30</td>
                <td className="px-6 py-4 whitespace-nowrap">7.5/10</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-sm ${quiz.status === 'published'
                      ? 'bg-green-400/20 text-green-400'
                      : quiz.status === 'draft'
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'bg-gray-400/20 text-gray-300'
                      }`}
                  >
                    {quiz.status === 'published'
                      ? 'Publicado'
                      : quiz.status === 'draft'
                        ? 'Borrador'
                        : quiz.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => router.push(`/quiz/${quiz.id}/results`)}
                    className="text-yellow-400 hover:text-yellow-300 text-sm mr-4"
                  >
                    Resultados
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/instructor/quizzes/${quiz.id}/edit`)}
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Editar
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