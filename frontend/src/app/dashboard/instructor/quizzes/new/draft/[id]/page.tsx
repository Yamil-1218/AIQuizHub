'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DraftQuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/auth/quizzes/${params.id}`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Error cargando cuestionario');

        setQuiz(data);
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
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error publicando cuestionario');

      toast.success('Cuestionario publicado con éxito');
      router.push(`/quiz/${params.id}/edit`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Borrador: {quiz?.title}</h1>

      <div className="bg-white/5 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Preguntas</h2>
        <div className="space-y-6">
          {quiz?.questions?.map((q: any, index: number) => (
            <div key={index} className="border-b border-white/20 pb-4">
              <p className="font-semibold">
                {index + 1}. {q.question_text}
              </p>
              {q.options && (
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300">
                  {JSON.parse(q.options).map((opt: string, i: number) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              )}
              <p className="mt-2 italic text-green-400">Respuesta correcta: {q.correct_answer}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handlePublish}
        disabled={publishing}
        className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-md font-semibold disabled:opacity-50"
      >
        {publishing ? 'Publicando...' : 'Publicar cuestionario'}
      </button>
    </div>
  );
}
