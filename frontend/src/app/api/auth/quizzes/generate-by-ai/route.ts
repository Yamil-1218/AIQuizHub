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

    const { topic, numQuestions, questionType, title, description } = await req.json();

    // Generar título final personalizado o por defecto
    const finalTitle = title?.trim() || `Cuestionario: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`;

    // Generar descripción final personalizada o por defecto
    const finalDescription = description?.trim() ||
      `Este cuestionario evalúa conocimientos sobre ${topic}. ` +
      `Contiene ${numQuestions} preguntas de tipo ` +
      `${questionType === 'multiple_choice' ? 'opción múltiple' :
        questionType === 'true_false' ? 'verdadero/falso' : 'respuesta corta'}.`;

    const prompt = generatePrompt(topic, numQuestions, questionType, finalTitle);

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

      // Validación y limpieza del título
      if (!quizData.title || quizData.title.trim() === '') {
        quizData.title = finalTitle;
      } else {
        quizData.title = quizData.title.replace(/^"|"$/g, '').trim();
        if (!quizData.title.startsWith('Cuestionario:')) {
          quizData.title = `Cuestionario: ${quizData.title}`;
        }
      }

      // Validación de preguntas
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error('El formato de preguntas no es válido');
      }

    } catch (err: any) {
      console.error('Error al parsear JSON generado:', jsonText, err);
      throw new Error('El contenido generado por Gemini no es JSON válido');
    }

    // Insertar quiz como borrador
    const result: any = await query(
      'INSERT INTO quizzes (title, description, instructor_id, topic, type, status, generated_by_ai) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        quizData.title,
        quizData.description || finalDescription,
        user.id,
        topic,
        questionType,
        'draft',
        1
      ]
    );

    const quizId = result.insertId;

    // Insertar preguntas
    for (const q of quizData.questions) {
      await query(
        'INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
        [
          quizId,
          q.question ?? q.question_text ?? '',
          q.type ?? questionType,
          q.options ? JSON.stringify(q.options) : null,
          q.correctAnswer ?? q.correct_answer ?? null
        ]
      );
    }

    return NextResponse.json(
      {
        quizId,
        title: quizData.title,
        topic: topic,
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

function generatePrompt(topic: string, numQuestions: number, questionType: string, title: string): string {
  let typeInstruction = '';
  if (questionType === 'multiple_choice') {
    typeInstruction = 'con 4 opciones de respuesta donde solo una es correcta';
  } else if (questionType === 'true_false') {
    typeInstruction = 'de tipo verdadero/falso';
  } else {
    typeInstruction = 'de respuesta corta';
  }

  return `Genera un cuestionario sobre "${topic}" con ${numQuestions} preguntas ${typeInstruction}. 
El título del cuestionario debe ser exactamente: "${title}" (sin comillas extras).
La descripción debe ser un resumen conciso del tema del cuestionario.

Instrucciones importantes:
1. El título debe mantenerse exactamente como se indica arriba
2. Incluye una descripción breve pero informativa
3. Todas las preguntas deben tener texto y respuesta correcta
4. Para preguntas de opción múltiple, incluir exactamente 4 opciones
5. El JSON debe ser válido y no contener caracteres extraños

Ejemplo del formato requerido:

{
  "title": "${title}",
  "description": "Breve descripción sobre el tema del cuestionario",
  "questions": [
    {
      "question": "Texto claro y conciso de la pregunta",
      ${questionType === 'multiple_choice' ? `"options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],` : ''}
      "correctAnswer": "Respuesta correcta precisa",
      "type": "${questionType}"
    }
  ]
}

Reglas adicionales:
- Usa "question" como clave para el texto de la pregunta
- Usa "correctAnswer" como clave para la respuesta correcta
- Para preguntas verdadero/falso, usa "Verdadero" o "Falso" como respuesta
- No incluyas texto explicativo fuera del JSON`;
}
