'use client';
import { useState } from 'react';
import LoadingOverlay from './LoadingOverlay';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export default function DemoQuiz() {
  const [prompt, setPrompt] = useState('Hazme un cuestionario de 10 preguntas de fundamentos de TypeScript');
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<{ [index: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setScore(null);
    try {
      const res = await fetch('/api/demo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setQuestions(data.questions);
      setAnswers({});
    } catch (err) {
      console.error('Error al generar preguntas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!questions) return;
    setEvaluating(true);
    setTimeout(() => {
      let total = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correctAnswer) {
          total++;
        }
      });
      setScore(total);
      setEvaluating(false);
    }, 1500); // Simula tiempo de evaluación
  };

  const handleReset = () => {
    setPrompt('');
    setQuestions(null);
    setAnswers({});
    setScore(null);
  };

  return (
    <div className="relative max-w-4xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg text-white">
      {(loading || evaluating) && <LoadingOverlay />}

      <h1 className="text-3xl font-bold mb-4">Demostración con IA</h1>

      {!questions ? (
        <>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white mb-4"
            rows={4}
            placeholder="Escribe un prompt para generar preguntas..."
          />
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-300 transition"
            disabled={loading}
          >
            {loading ? 'Generando...' : 'Generar Cuestionario'}
          </button>
        </>
      ) : (
        <>
          <form className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <p className="font-semibold mb-2">{idx + 1}. {q.question}</p>
                {q.options.map((opt, oIdx) => (
                  <label key={oIdx} className="block mb-1">
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      value={opt}
                      checked={answers[idx] === opt}
                      onChange={() => setAnswers({ ...answers, [idx]: opt })}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
          </form>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded hover:bg-green-400 transition"
              disabled={evaluating}
            >
              {evaluating ? 'Evaluando...' : 'Enviar Respuestas'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded hover:bg-red-400 transition"
            >
              Reiniciar
            </button>
          </div>

          {score !== null && (
            <p className="mt-6 text-xl text-yellow-300 font-semibold">
              Calificación: {score} / {questions.length}
            </p>
          )}
        </>
      )}
    </div>
  );
}
