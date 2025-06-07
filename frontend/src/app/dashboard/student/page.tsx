'use client'

import { FaBook, FaChartLine, FaClipboardList, FaComments, FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulando la carga de datos del usuario
        const userResponse = await fetch('/api/user/me')
        if (!userResponse.ok) throw new Error('Error al cargar perfil')
        const userData = await userResponse.json()
        setUser(userData)

        // Simulando la carga de quizzes disponibles
        const quizzesResponse = await fetch('/api/quizzes/available')
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
            <h1 className="text-2xl font-bold">Panel del Estudiante</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/profile')}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
              >
                <FaUser />
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
            <h2 className="text-3xl font-bold mb-2">¡Bienvenido, {user?.name || 'Estudiante'}!</h2>
            <p className="text-gray-300">Prepárate para mejorar tus habilidades con nuestros cuestionarios interactivos</p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400/20 p-3 rounded-full">
                <FaBook className="text-yellow-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Cursos completados</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400/20 p-3 rounded-full">
                <FaChartLine className="text-yellow-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Promedio</p>
                <p className="text-2xl font-bold">8.5/10</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400 transition-all">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400/20 p-3 rounded-full">
                <FaClipboardList className="text-yellow-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Cuestionarios</p>
                <p className="text-2xl font-bold">{quizzes.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Quizzes */}
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
            {quizzes.slice(0, 3).map((quiz, index) => (
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

        {/* Recent Activity */}
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
      </main>
    </div>
  )
}