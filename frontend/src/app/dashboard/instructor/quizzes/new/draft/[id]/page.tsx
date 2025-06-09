// src/app/dashboard/instructor/quizzes/new/draft/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DraftQuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/auth/quizzes/${params.id}`);
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
    try {
      const response = await fetch(`/api/auth/quizzes/${params.id}/publish`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error publicando cuestionario');
      
      toast.success('Cuestionario publicado con éxito');
      router.push(`/quiz/${params.id}/edit`);
    } catch (error: any) {
      toast.error(error.message);
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
            <div key={index} className="border-b border-white/10 pb-4">
              <p className="font-medium mb-2">{index + 1}. {q.question}</p>
              {q.options && (
                <ul className="ml-6 list-disc">
                  {q.options.map((opt: string, i: number) => (
                    <li key={i} className={i === q.correctAnswer ? 'text-green-400' : ''}>
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
              {q.type === 'short_answer' && (
                <p className="text-sm text-gray-400 mt-1">
                  Respuesta correcta: {q.correctAnswer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => router.push('/dashboard/instructor')}
          className="px-4 py-2 border border-white/20 rounded hover:bg-white/10"
        >
          Guardar borrador
        </button>
        <button
          onClick={handlePublish}
          className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
        >
          Publicar cuestionario
        </button>
      </div>
    </div>
  );
}