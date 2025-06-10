// src/app/dashboard/instructor/quizzes/[id]/edit/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function EditQuiz({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`/api/auth/quizzes/${params.id}`, { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        // Parsear opciones si vienen como string
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

  if (loading || !quiz) return <div className="text-white">Cargando...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Editar Cuestionario</h1>

      <input
        className="w-full mb-4 p-2 rounded bg-gray-800 text-white border border-gray-700"
        value={quiz.title}
        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
        placeholder="Título del cuestionario"
      />
      <textarea
        className="w-full mb-6 p-2 rounded bg-gray-800 text-white border border-gray-700"
        value={quiz.description}
        onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
        placeholder="Descripción"
      />

      {quiz.questions.map((q: any, idx: number) => (
        <div key={idx} className="mb-6">
          <label className="block mb-2">Pregunta {idx + 1}</label>
          <input
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
            value={q.question_text}
            onChange={(e) => {
              const updated = [...quiz.questions]
              updated[idx].question_text = e.target.value
              setQuiz({ ...quiz, questions: updated })
            }}
            placeholder={`Texto de la pregunta ${idx + 1}`}
          />

          {Array.isArray(q.options) && (
            <div className="space-y-2">
              {q.options.map((option: string, oidx: number) => (
                <input
                  key={oidx}
                  className="w-full p-2 rounded bg-gray-600 text-white"
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
            className="w-full mt-2 p-2 rounded bg-gray-700 text-white"
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

      <button
        onClick={handleSave}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
      >
        Guardar cambios
      </button>
    </div>
  )
}
