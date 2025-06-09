import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/utils/jwt';

function extractJSONFromCodeBlock(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return jsonMatch ? jsonMatch[1].trim() : text.trim();
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    const user = token ? await getUserFromToken(token) : null;

    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { topic, numQuestions, questionType } = await req.json();

    const prompt = generatePrompt(topic, numQuestions, questionType);

    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('Error en llamada a Gemini:', res.status, res.statusText, errText);
      throw new Error(`Error en llamada a Gemini: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('No se encontró contenido generado por Gemini');
    }

    const jsonText = extractJSONFromCodeBlock(rawText);

    let quizData;
    try {
      quizData = JSON.parse(jsonText);
    } catch (err) {
      console.error('Error al parsear JSON generado:', jsonText, err);
      throw new Error('El contenido generado por Gemini no es JSON válido');
    }

    // Insertar en tabla quizzes como borrador
    const [result]: any = await query(
      'INSERT INTO quizzes (title, instructor_id, topic, type, status, generated_by_ai) VALUES (?, ?, ?, ?, ?, ?)',
      [quizData.title, user.id, topic, questionType, 'draft', 1]
    );

    const quizId = result.insertId;

    // Insertar cada pregunta
    for (const q of quizData.questions) {
      await query(
        'INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
        [
          quizId,
          q.question ?? '',
          q.type ?? 'short_answer',
          q.options ? JSON.stringify(q.options) : null,
          q.correctAnswer ?? null
        ]
      );
    }

    return NextResponse.json(
      {
        quizId,
        title: quizData.title,
        questions: quizData.questions,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error generando cuestionario:', err);
    return NextResponse.json(
      { error: err.message || 'Error generando cuestionario' },
      { status: 500 }
    );
  }
}

function generatePrompt(topic: string, numQuestions: number, questionType: string): string {
  let typeInstruction = '';
  if (questionType === 'multiple_choice') {
    typeInstruction = 'con 4 opciones de respuesta donde solo una es correcta';
  } else if (questionType === 'true_false') {
    typeInstruction = 'de tipo verdadero/falso';
  } else {
    typeInstruction = 'de respuesta corta';
  }

  return `Genera un cuestionario sobre "${topic}" con ${numQuestions} preguntas ${typeInstruction}. 
Devuelve un JSON con el formato: 
{
  "title": "Título del cuestionario",
  "questions": [
    {
      "question": "Texto de la pregunta",
      "options": ["op1", "op2", "op3", "op4"], // solo para multiple_choice,
      "correctAnswer": "respuesta correcta",
      "type": "${questionType}"
    }
  ]
}`;
}
