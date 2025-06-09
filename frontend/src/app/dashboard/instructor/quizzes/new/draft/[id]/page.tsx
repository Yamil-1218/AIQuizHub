'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Question {
  id: string
  question: string
  options?: string[]
  answer: string
}

export default function DraftQuizPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDraft() {
      try {
        const res = await fetch(`/api/quiz/draft/${id}`, {
          credentials: 'include' // envia cookies automáticamente
        })
        if (!res.ok) throw new Error('Error cargando cuestionario')
        const data = await res.json()
        setTitle(data.title)
        setQuestions(data.questions)
        setLoading(false)
      } catch (err) {
        console.error('Error al cargar el cuestionario:', err)
      }
    }

    if (id) fetchDraft()
  }, [id])

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions]
    updated[index].question = value
    setQuestions(updated)
  }

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...questions]
    updated[index].answer = value
    setQuestions(updated)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handlePublish = async () => {
    try {
      const res = await fetch(`/api/quiz/publish/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // enviar cookies también aquí
        body: JSON.stringify({ title, questions }),
      })

      if (res.ok) {
        router.push('/dashboard/instructor/quizzes')
      } else {
        const error = await res.json()
        console.error('Error publicando cuestionario:', error.message)
      }
    } catch (err) {
      console.error('Error en publicación:', err)
    }
  }

  if (loading) return <p className="p-4">Cargando cuestionario...</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Editar cuestionario</h1>

      <input
        className="w-full border p-2 rounded text-xl font-semibold"
        value={title}
        onChange={handleTitleChange}
        placeholder="Título del cuestionario"
      />

      {questions.map((q, index) => (
        <div key={index} className="border p-4 rounded-xl space-y-2 bg-gray-50">
          <textarea
            className="w-full border p-2 rounded"
            value={q.question}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleQuestionChange(index, e.target.value)
            }
            placeholder={`Pregunta ${index + 1}`}
          />
          <input
            className="w-full border p-2 rounded"
            value={q.answer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleAnswerChange(index, e.target.value)
            }
            placeholder="Respuesta correcta"
          />
        </div>
      ))}

      <button
        onClick={handlePublish}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Publicar cuestionario
      </button>
    </div>
  )
}
