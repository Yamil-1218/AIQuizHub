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
      if (res.ok) setQuiz(data)
      else toast.error('Error cargando cuestionario')
      setLoading(false)
    }
    fetchQuiz()
  }, [params.id])

  const handleSave = async () => {
    const res = await fetch(`/api/auth/quizzes/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(quiz),
    })
    if (res.ok) {
      toast.success('Guardado correctamente')
      router.push(`/dashboard/instructor/quizzes/${params.id}/draft`)
    } else {
      const error = await res.json()
      toast.error(error.message || 'Error al guardar')
    }
  }

  if (loading || !quiz) return <div>Cargando...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Editar Cuestionario</h1>

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
        <div key={idx} className="mb-4">
          <input
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
            value={q.question_text}
            onChange={(e) => {
              const newQuestions = [...quiz.questions]
              newQuestions[idx].question_text = e.target.value
              setQuiz({ ...quiz, questions: newQuestions })
            }}
            placeholder={`Pregunta ${idx + 1}`}
          />
        </div>
      ))}

      <button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
        Guardar cambios
      </button>
    </div>
  )
}
