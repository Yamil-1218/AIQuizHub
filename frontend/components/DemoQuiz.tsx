'use client';
import { useState } from 'react';
import LoadingOverlay from './LoadingOverlay';
import { FaArrowRight, FaRedo } from 'react-icons/fa';
import { MdEmojiEvents, MdOutlineQuiz } from 'react-icons/md';

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

    const unanswered = questions.some((_, idx) => !answers[idx]);
    if (unanswered) {
      alert('Por favor, responde todas las preguntas antes de enviar.');
      return;
    }

    setEvaluating(true);
    setTimeout(() => {
      let total = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correctAnswer) total++;
      });
      setScore(total);
      setEvaluating(false);
    }, 1200);
  };

  const handleReset = () => {
    setPrompt('');
    setQuestions(null);
    setAnswers({});
    setScore(null);
  };

  return (
    <div className="relative max-w-4xl mx-auto p-4 sm:p-6">
      {(loading || evaluating) && <LoadingOverlay />}

      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20">
          <MdOutlineQuiz className="text-yellow-400 mr-2" />
          <span className="text-sm font-medium">Demostración interactiva</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200 mb-2">
          Cuestionario Generado por IA
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Prueba nuestro generador de cuestionarios con inteligencia artificial
        </p>
      </div>

      {!questions ? (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8 shadow-lg">
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Describe el cuestionario que deseas generar:
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-100 placeholder-gray-500 transition-all"
                rows={4}
                placeholder="Ej: Hazme un cuestionario de 10 preguntas sobre React Hooks"
              />
            </div>
            <button
              onClick={handleGenerate}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold rounded-lg shadow-md transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </span>
              ) : (
                <>
                  Generar Cuestionario <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8 shadow-lg mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center">
                <MdOutlineQuiz className="text-yellow-400 mr-2" /> Cuestionario
              </h2>
              <span className="text-sm bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full font-medium mt-2 sm:mt-0">
                {questions.length} preguntas
              </span>
            </div>

            <form className="space-y-5">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border ${answers[idx] ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-700 bg-gray-900/30'} shadow-sm transition-all`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-gray-900 font-bold mr-3 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-3">{q.question}</h3>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label
                            key={oIdx}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${answers[idx] === opt ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-700 hover:border-yellow-300 bg-gray-800/50'}`}
                          >
                            <input
                              type="radio"
                              name={`q-${idx}`}
                              value={opt}
                              checked={answers[idx] === opt}
                              onChange={() => setAnswers({ ...answers, [idx]: opt })}
                              className="h-5 w-5 text-yellow-500 focus:ring-yellow-400 border-gray-600"
                            />
                            <span className="ml-3 text-gray-100">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </form>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center"
              disabled={evaluating}
            >
              {evaluating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Evaluando...
                </span>
              ) : (
                <>
                  Enviar Respuestas <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center"
            >
              <FaRedo className="mr-2" /> Reiniciar
            </button>
          </div>

          {score !== null && (
            <div className={`mt-6 p-6 rounded-xl border ${score === questions.length ? 'border-green-400 bg-green-400/10' : score > questions.length / 2 ? 'border-yellow-400 bg-yellow-400/10' : 'border-red-400 bg-red-400/10'} shadow-lg transition-all`}>
              <div className="flex flex-col items-center text-center">
                <div className={`h-20 w-20 rounded-full flex items-center justify-center ${score === questions.length ? 'bg-gradient-to-br from-green-400 to-green-600' : score > questions.length / 2 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-red-400 to-red-600'} text-white font-bold text-2xl mb-4 shadow-md`}>
                  {score}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                  {score === questions.length ? (
                    <>
                      ¡Perfecto! <MdEmojiEvents className="ml-2 text-yellow-400" />
                    </>
                  ) : score > questions.length / 2 ? (
                    '¡Buen trabajo!'
                  ) : (
                    'Puedes mejorar'
                  )}
                </h3>
                <p className="text-gray-300 mb-4">
                  Obtuviste {score} de {questions.length} respuestas correctas
                </p>
                {score !== questions.length && (
                  <button
                    onClick={() => {
                      setAnswers({});
                      setScore(null);
                    }}
                    className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-white transition-colors flex items-center"
                  >
                    <FaRedo className="mr-2" /> Intentar nuevamente
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}