import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/utils/jwt';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { topic, numQuestions, questionType } = await req.json();

    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    const user = token ? await getUserFromToken(token) : null;

    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Prompt para generar preguntas con OpenAI
    const prompt = `Crea ${numQuestions} preguntas del tipo ${questionType} sobre el tema "${topic}". 
Devuélvelas en formato JSON con las siguientes claves:
- question_text
- options (solo si es opción múltiple)
- correct_answer
- explanation`;

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = aiResponse.choices[0].message.content;
    const questions = JSON.parse(content || '[]');

    // 1. Insertar el quiz
    const [quizResult]: any = await query(
      'INSERT INTO quizzes (instructor_id, title, topic, type, status, generated_by_ai) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, `Cuestionario IA - ${topic}`, topic, questionType, 'draft', true]
    );

    const quizId = quizResult.insertId;

    // 2. Insertar preguntas
    for (const q of questions) {
      await query(
        'INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)',
        [
          quizId,
          q.question_text,
          questionType,
          questionType === 'multiple_choice' ? JSON.stringify(q.options) : null,
          q.correct_answer,
          q.explanation || '',
        ]
      );
    }

    return NextResponse.json({ quizId }, { status: 200 });

  } catch (err) {
    console.error('Error generando preguntas con IA:', err);
    return NextResponse.json({ error: 'Error generando cuestionario' }, { status: 500 });
  }
}
