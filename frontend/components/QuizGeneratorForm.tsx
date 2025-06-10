'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function QuizGeneratorForm() {
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState(''); // Nuevo estado para el título
  const [description, setDescription] = useState(''); // Nuevo estado para la descripción
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast.error('Por favor ingresa un tema para el cuestionario');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/auth/quizzes/generate-by-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          title, // Envía el título
          description, // Envía la descripción
          numQuestions,
          questionType,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error generando cuestionario');

      toast.success('Cuestionario generado con éxito');
      router.push(`/dashboard/instructor/quizzes/new/draft/${data.quizId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md overflow-hidden md:max-w-3xl">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Generador de Cuestionarios</h1>
          <p className="mt-2 text-gray-600">
            Crea cuestionarios personalizados en minutos con ayuda de IA
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          {/* Logo Gemini estilo simple SVG */}
          <svg
            className="w-6 h-6 text-yellow-600"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="4" />
            <path
              d="M20 44L32 20L44 44"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 36H40"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 border border-transparent rounded-md font-semibold text-yellow-800">
            Modo IA
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo de tema (existente) */}
        <div className="space-y-1">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Tema del cuestionario
            <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-gray-900"
              placeholder="Ej: Fundamentos de Programación"
            />
          </div>
        </div>

        {/* Nuevo campo: Título */}
        <div className="space-y-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título del cuestionario
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-gray-900"
            placeholder="Ej: Evaluación de Fundamentos de TypeScript"
          />
          <p className="mt-1 text-sm text-gray-500">
            El título que verán los estudiantes
          </p>
        </div>

        {/* Nuevo campo: Descripción */}
        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-gray-900"
            placeholder="Breve descripción del contenido del cuestionario..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Explica el propósito y alcance del cuestionario
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-900">
              {/* Cambié el color a gray-900 para mejor visibilidad */}
              Número de preguntas
            </label>
            <select
              id="numQuestions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-gray-900"
            >
              {[3, 5, 10, 15].map((num) => (
                <option key={num} value={num}>
                  {num} preguntas
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="questionType" className="block text-sm font-medium text-gray-900">
              Tipo de preguntas
            </label>
            <select
              id="questionType"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-gray-900"
            >
              <option value="multiple_choice">Opción múltiple</option>
              <option value="true_false">Verdadero/Falso</option>
              <option value="short_answer">Respuesta corta</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <svg
                  className="-ml-1 mr-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Generar Cuestionario
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-full">
            <svg
              className="h-5 w-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Consejo:</span> Sé específico con el tema para obtener mejores resultados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
