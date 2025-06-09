'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/index'

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

  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    async function fetchDraft() {
      try {
        const res = await fetch(`/api/quiz/draft/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setTitle(data.title)
        setQuestions(data.questions)
        setLoading(false)
      } catch (err) {
        console.error('Error al cargar el cuestionario:', err)
      }
    }

    if (id && token) fetchDraft()
  }, [id, token])

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

  const handleTitleChange = (value: string) => setTitle(value)

  const handlePublish = async () => {
    try {
      const res = await fetch(`/api/quiz/publish/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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

      <Input
        className="text-xl font-semibold"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Título del cuestionario"
      />

      {questions.map((q, index) => (
        <div key={index} className="border p-4 rounded-xl space-y-2 bg-gray-50">
          <Textarea
            value={q.question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            placeholder={`Pregunta ${index + 1}`}
          />
          <Input
            value={q.answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder="Respuesta correcta"
          />
        </div>
      ))}

      <Button onClick={handlePublish} className="mt-4">Publicar cuestionario</Button>
    </div>
  )
}
