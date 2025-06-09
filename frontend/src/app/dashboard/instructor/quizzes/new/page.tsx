// src/app/dashboard/instructor/quizzes/new/page.tsx
'use client';

import QuizGeneratorForm from '../../../../../../components/QuizGeneratorForm'

export default function NewQuizPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Generar nuevo cuestionario</h1>
      <QuizGeneratorForm />
    </div>
  );
}