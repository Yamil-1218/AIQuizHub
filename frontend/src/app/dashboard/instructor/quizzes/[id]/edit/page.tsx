'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { use } from 'react'

export default function EditQuiz({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`/api/auth/quizzes/${params.id}`, { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        const parsedQuestions = data.questions.map((q: any) => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        }))
        setQuiz({ ...data, questions: parsedQuestions })
      } else {
        toast.error('Error cargando cuestionario')
      }
      setLoading(false)
    }

    fetchQuiz()
  }, [params.id])

  const handleSave = async () => {
    const res = await fetch(`/api/auth/quizzes/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...quiz, status: 'published' }),
    })

    if (res.ok) {
      toast.success('Guardado correctamente')
      router.push('/dashboard/instructor/quizzes/list')
    } else {
      const error = await res.json()
      toast.error(error.message || 'Error al guardar')
    }
  }

  if (loading || !quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        Cargando cuestionario...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-white">Editar Cuestionario</h1>

        <div className="space-y-4">
          <input
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            placeholder="Título del cuestionario"
          />
          <textarea
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            placeholder="Descripción"
            rows={3}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Preguntas</h2>
          {quiz.questions.map((q: any, idx: number) => (
            <div key={idx} className="bg-gray-700 p-4 mb-6 rounded-lg border border-gray-600 space-y-3">
              <label className="block text-gray-300 font-medium">Pregunta {idx + 1}</label>
              <input
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                value={q.question_text}
                onChange={(e) => {
                  const updated = [...quiz.questions]
                  updated[idx].question_text = e.target.value
                  setQuiz({ ...quiz, questions: updated })
                }}
                placeholder="Texto de la pregunta"
              />

              {Array.isArray(q.options) && (
                <div className="space-y-2">
                  {q.options.map((option: string, oidx: number) => (
                    <input
                      key={oidx}
                      className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                      value={option}
                      onChange={(e) => {
                        const updated = [...quiz.questions]
                        updated[idx].options[oidx] = e.target.value
                        setQuiz({ ...quiz, questions: updated })
                      }}
                      placeholder={`Opción ${oidx + 1}`}
                    />
                  ))}
                </div>
              )}

              <input
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                value={q.correct_answer}
                onChange={(e) => {
                  const updated = [...quiz.questions]
                  updated[idx].correct_answer = e.target.value
                  setQuiz({ ...quiz, questions: updated })
                }}
                placeholder="Respuesta correcta"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}
