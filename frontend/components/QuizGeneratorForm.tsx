// components/QuizGeneratorForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const QuizGeneratorForm = () => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/quizzes/created/generate-by-ai', {
        topic,
        numQuestions,
        questionType,
      });

      if (response.status === 200) {
        const quizId = response.data.quizId;
        router.push(`/dashboard/instructor/quizzes/new/draft/${quizId}`);
      }
    } catch (error) {
      console.error('Error generando cuestionario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Tema</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Cantidad de preguntas</label>
        <input
          type="number"
          min={1}
          max={50}
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Tipo de pregunta</label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="multiple_choice">Opción múltiple</option>
          <option value="true_false">Verdadero/Falso</option>
          <option value="short_answer">Respuesta corta</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Generando...' : 'Generar con IA'}
      </button>
    </form>
  );
};

export default QuizGeneratorForm;
