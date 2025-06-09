import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/utils/jwt';

export async function POST(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('auth_token=')[1]?.split(';')[0];
    const user = token ? await getUserFromToken(token) : null;

    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { topic, numQuestions, questionType } = await req.json();

    // Generar prompt para Gemini
    const prompt = generatePrompt(topic, numQuestions, questionType);

    // Preparar payload para Gemini
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

    // Llamar API Gemini
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

    console.log('Respuesta completa de Gemini:', JSON.stringify(data, null, 2));

    // Extraer contenido generado
    const quizContent = data?.candidates?.[0]?.output;

    if (!quizContent) {
      console.error('No se encontró contenido generado en Gemini:', data);
      throw new Error('No se recibió contenido válido de Gemini');
    }

    // Parsear JSON generado por Gemini
    let quizData;
    try {
      quizData = JSON.parse(quizContent);
    } catch (err) {
      console.error('Error al parsear JSON generado:', quizContent, err);
      throw new Error('El contenido generado por Gemini no es JSON válido');
    }

    // Guardar en base de datos
    const [result]: any = await query(
      'INSERT INTO quizzes (title, instructor_id, questions, status) VALUES (?, ?, ?, ?)',
      [quizData.title, user.id, JSON.stringify(quizData.questions), 'draft']
    );

    return NextResponse.json(
      {
        quizId: result.insertId,
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
