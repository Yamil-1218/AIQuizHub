'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingOverlay from '../../../../../../components/LoadingOverlay';

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para mostrar LoadingOverlay

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/auth/quizzes/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error al cargar el cuestionario');
        setQuiz(data);
      } catch (err) {
        console.error('Error al obtener el cuestionario:', err);
        toast.error('No se pudo cargar el cuestionario');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true); // Empieza carga

    try {
      const studentAnswers = Object.entries(answers).map(([questionId, studentAnswer]) => ({
        questionId: parseInt(questionId),
        studentAnswer,
      }));

      const answersForEvaluation = studentAnswers.map((sa) => {
        const q = quiz.questions.find((q: any) => q.id === sa.questionId);
        return {
          question: q?.question_text || '',
          studentAnswer: sa.studentAnswer,
          correctAnswer: q?.correct_answer || '',
        };
      });

      const evalRes = await fetch('/api/auth/students/evaluate_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersForEvaluation }),
      });

      if (!evalRes.ok) throw new Error('Error al evaluar con IA');

      const evaluation = await evalRes.json();

      toast.success(`Tu calificación: ${evaluation.score}/10`);

      const payload = {
        quiz_id: quiz.id,
        status: 1,
        score: evaluation.score,
        evaluation: evaluation.results,
      };

      const res = await fetch('/api/auth/students/quiz_assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || 'Error al registrar el cuestionario');
        setIsSubmitting(false); // Termina carga aquí si falla
        return;
      }

      toast.success('¡Cuestionario enviado con éxito!');

      setTimeout(() => {
        setIsSubmitting(false); // Termina carga antes de redirigir
        router.push('/dashboard/student');
      }, 1000);
    } catch (err) {
      console.error('Error en el envío:', err);
      toast.error('Error al enviar respuestas');
      setIsSubmitting(false); // Termina carga si hay error
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Cargando cuestionario...</div>;
  }

  if (!quiz) {
    return <div className="text-red-400 text-center mt-20">No se pudo cargar el cuestionario</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative">
      {isSubmitting && <LoadingOverlay />} {/* Aquí se muestra la pantalla de carga */}

      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-sm text-gray-400 mb-6">{quiz.topic} / {quiz.type}</p>
      <p className="mb-8">{quiz.description}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions.map((question: any, index: number) => (
          <div key={question.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="font-semibold mb-2">
              {index + 1}. {question.question_text}
            </p>

            {question.question_type === 'short_answer' ? (
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700"
                placeholder="Escribe tu respuesta..."
                onChange={(e) => handleChange(question.id, e.target.value)}
                disabled={isSubmitting}
              />
            ) : question.question_type === 'multiple_choice' ? (
              <div className="space-y-2">
                {question.options?.map((option: string, idx: number) => (
                  <label key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={option}
                      className="form-radio text-yellow-400"
                      onChange={() => handleChange(question.id, option)}
                      disabled={isSubmitting}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : question.question_type === 'true_false' ? (
              <div className="space-y-2">
                {['Verdadero', 'Falso'].map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={option}
                      className="form-radio text-yellow-400"
                      onChange={() => handleChange(question.id, option)}
                      disabled={isSubmitting}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-red-400">Tipo de pregunta no soportado</p>
            )}
          </div>
        ))}

        <div className="text-center">
          <button
            type="submit"
            className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-full hover:bg-yellow-300"
            disabled={isSubmitting}
          >
            Enviar respuestas
          </button>
        </div>
      </form>
    </div>
  );
}
