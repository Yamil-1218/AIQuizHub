'use client'

import { FaChalkboardTeacher, FaPlus, FaUsers, FaFileAlt, FaChartBar } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function InstructorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulando la carga de datos del instructor
        const userResponse = await fetch('/api/user/me')
        if (!userResponse.ok) throw new Error('Error al cargar perfil')
        const userData = await userResponse.json()
        setUser(userData)

        // Simulando la carga de estudiantes
        const studentsResponse = await fetch('/api/students')
        if (!studentsResponse.ok) throw new Error('Error al cargar estudiantes')
        const studentsData = await studentsResponse.json()
        setStudents(studentsData)

        // Simulando la carga de quizzes creados
        const quizzesResponse = await fetch('/api/quizzes/created')
        if (!quizzesResponse.ok) throw new Error('Error al cargar cuestionarios')
        const quizzesData = await quizzesResponse.json()
        setQuizzes(quizzesData)

      } catch (error: any) {
        toast.error(error.message || 'Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Panel del Instructor</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/profile')}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
              >
                <FaChalkboardTeacher />
                <span>Perfil</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-indigo-800 to-purple-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Bienvenido, {user?.name || 'Instructor'}!</h2>
            <p className="text-gray-300">Gestiona tus cursos y sigue el progreso de tus estudiantes</p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400/20 p-3 rounded-full">
                <FaUsers className="text-yellow-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Estudiantes</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400/20 p-3 rounded-full">
                <FaFileAlt className="text-yellow-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Cuestionarios</p>
                <p className="text-2xl font-bold">{quizzes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400/20 p-3 rounded-full">
                <FaChartBar className="text-yellow-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Promedio General</p>
                <p className="text-2xl font-bold">7.8/10</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400/20 p-3 rounded-full">
                <FaChalkboardTeacher className="text-yellow-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Cursos Activos</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button 
              onClick={() => router.push('/quiz/new')}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-400/20 p-3 rounded-full group-hover:bg-yellow-400/30 transition-all">
                  <FaPlus className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold">Nuevo Cuestionario</h3>
                  <p className="text-sm text-gray-400">Crea un nuevo examen</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/students')}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-400/20 p-3 rounded-full group-hover:bg-yellow-400/30 transition-all">
                  <FaUsers className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold">Ver Estudiantes</h3>
                  <p className="text-sm text-gray-400">Gestiona tus alumnos</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/analytics')}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-400/20 p-3 rounded-full group-hover:bg-yellow-400/30 transition-all">
                  <FaChartBar className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold">Analíticas</h3>
                  <p className="text-sm text-gray-400">Ver estadísticas</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/ai-evaluator')}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-400/20 p-3 rounded-full group-hover:bg-yellow-400/30 transition-all">
                  <FaFileAlt className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold">Evaluador IA</h3>
                  <p className="text-sm text-gray-400">Configura evaluaciones</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Recent Students */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Estudiantes Recientes</h2>
            <button 
              onClick={() => router.push('/students')}
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
                {students.slice(0, 5).map((student) => (
                  <tr key={student.id} className="hover:bg-white/10 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="bg-yellow-400/20 text-yellow-400 w-8 h-8 rounded-full flex items-center justify-center">
                          {student.name.charAt(0)}
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">2023-11-15</td>
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

        {/* Recent Quizzes */}
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
                {quizzes.slice(0, 5).map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-white/10 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{quiz.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">24/30</td>
                    <td className="px-6 py-4 whitespace-nowrap">7.5/10</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded text-sm">
                        Activo
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
                        onClick={() => router.push(`/quiz/${quiz.id}/edit`)}
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
      </main>
    </div>
  )
}