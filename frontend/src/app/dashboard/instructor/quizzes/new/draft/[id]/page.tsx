'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DraftQuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'details'>('preview');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/auth/quizzes/${params.id}`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Error cargando cuestionario');

        // Asegurar que los datos tienen la estructura correcta
        const formattedQuiz = {
          ...data,
          title: data.title || 'Sin título',
          description: data.description || 'Sin descripción',
          questions: data.questions?.map((q: any) => ({
            ...q,
            question_text: q.question_text || q.question || '',
            correct_answer: q.correct_answer || q.correctAnswer || ''
          })) || []
        };

        setQuiz(formattedQuiz);
      } catch (error: any) {
        toast.error(error.message);
        router.push('/dashboard/instructor');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id, router]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const response = await fetch(`/api/auth/quizzes/${params.id}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: quiz.title,
          description: quiz.description || '', // Asegurar que se envía la descripción
          questions: quiz.questions,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error publicando cuestionario');

      toast.success('Cuestionario publicado con éxito');
      router.push('/dashboard/instructor');
    } catch (error: any) {
      toast.error(error.message || 'Error desconocido');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Previsualización del Cuestionario</h1>
          <p className="text-gray-400 mt-1">Revisa cuidadosamente antes de publicar</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => router.push(`/dashboard/instructor/quizzes/${params.id}/edit`)}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-medium text-sm transition-colors"
          >
            Editar
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-semibold disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {publishing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publicando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Publicar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('preview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'preview' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-400'}`}
          >
            Vista Previa
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-400'}`}
          >
            Detalles
          </button>
        </nav>
      </div>

      {/* Quiz Info */}
      <div className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">
          {quiz?.title || 'Cuestionario sin título'}
        </h2>
        <p className="text-gray-400">
          {quiz?.description || "Sin descripción"}
        </p>
      </div>

      {/* Questions Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {quiz?.questions?.map((q: any, index: number) => (
            <div key={index} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-600/20 text-yellow-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">{q.question_text}</h3>

                  {q.options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {JSON.parse(q.options).map((opt: string, i: number) => (
                        <div
                          key={i}
                          className={`p-3 rounded border ${opt === q.correct_answer ? 'border-green-500 bg-green-900/20' : 'border-gray-600 bg-gray-700/30'}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${opt === q.correct_answer ? 'bg-green-500' : 'bg-gray-600'}`}>
                              {opt === q.correct_answer && (
                                <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                                  <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z" />
                                </svg>
                              )}
                            </div>
                            <span className={opt === q.correct_answer ? 'text-green-100' : 'text-gray-300'}>{opt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-2 text-sm text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Respuesta correcta: <span className="font-semibold">{q.correct_answer}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz Details */}
      {activeTab === 'details' && (
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Información del Cuestionario</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Título</h4>
              <p className="text-gray-200">{quiz?.title}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Estado</h4>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                Borrador
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Total de Preguntas</h4>
              <p className="text-gray-200">{quiz?.questions?.length || 0}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Fecha de Creación</h4>
              <p className="text-gray-200">
                {quiz?.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'Fecha no disponible'}
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Descripción</h4>
              <p className="text-gray-200">{quiz?.description || "No se proporcionó descripción"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={() => router.push('/dashboard/instructor')}
          className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700/50 transition-colors"
        >
          Volver al panel
        </button>
        <button
          onClick={() => router.push(`/dashboard/instructor/quizzes/${params.id}/edit`)}
          className="px-4 py-2 bg-gray-700 rounded-md text-white hover:bg-gray-600 transition-colors"
        >
          Editar cuestionario
        </button>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="px-6 py-2 bg-green-600 rounded-md text-white hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {publishing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publicando...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Publicar cuestionario
            </>
          )}
        </button>
      </div>
    </div>
  );
}