'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function QuizGeneratorForm() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(5)
  const [type, setType] = useState('multiple-choice')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/quizzes/generate-by-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count, type }),
      })

      const data = await res.json()
      if (res.ok) {
        // Redirigir a vista de edición del borrador generado
        router.push(`/dashboard/instructor/quizzes/draft/${data.draftId}`)
      } else {
        alert(data.error || 'Error generando el cuestionario')
      }
    } catch (err) {
      alert('Error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <h2 className="text-xl font-bold">Generar Cuestionario por IA</h2>

      <div>
        <label className="block font-medium">Tema</label>
        <input
          className="w-full border p-2 rounded"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium">Cantidad de preguntas</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={count}
          min={1}
          max={20}
          onChange={(e) => setCount(parseInt(e.target.value))}
        />
      </div>

      <div>
        <label className="block font-medium">Tipo</label>
        <select
          className="w-full border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="multiple-choice">Opción múltiple</option>
          <option value="true-false">Verdadero / Falso</option>
          <option value="short-answer">Respuesta corta</option>
        </select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Generando...' : 'Generar cuestionario'}
      </Button>
    </form>
  )
}
