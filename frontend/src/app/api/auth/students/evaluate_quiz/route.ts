import { NextResponse } from 'next/server';

function extractJSONFromCodeBlock(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return jsonMatch ? jsonMatch[1].trim() : text.trim();
}

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    // Construir prompt para que Gemini evalúe las respuestas:
    // La IA debe responder un JSON con la evaluación pregunta a pregunta.

    const prompt = `
Eres un asistente que evalúa respuestas de un cuestionario.
Para cada pregunta, compara la respuesta del estudiante con la respuesta correcta.
Devuelve un JSON con un array "results", donde cada objeto tiene:
- "question": texto de la pregunta
- "studentAnswer": respuesta del estudiante
- "correctAnswer": respuesta correcta
- "correct": true o false si la respuesta es correcta
Además, calcula un "score" de 0 a 10 basado en el porcentaje de respuestas correctas.

Aquí están las preguntas y respuestas:

${answers.map((a: any, i: number) => `
Pregunta ${i + 1}: ${a.question}
Respuesta estudiante: ${a.studentAnswer}
Respuesta correcta: ${a.correctAnswer}
`).join('\n')}

Por favor, responde SOLO con un bloque JSON, sin texto adicional.
`;

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('Error llamando a Gemini:', res.status, res.statusText, errText);
      throw new Error(`Error llamando a Gemini: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error('No se recibió respuesta de Gemini');

    const jsonText = extractJSONFromCodeBlock(rawText);

    const evaluation = JSON.parse(jsonText);

    // Validar estructura básica
    if (!evaluation.results || !Array.isArray(evaluation.results) || typeof evaluation.score !== 'number') {
      throw new Error('Respuesta JSON inválida o incompleta de Gemini');
    }

    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error('Error evaluando con IA:', error);
    return NextResponse.json({ error: error.message || 'Error evaluando con IA' }, { status: 500 });
  }
}
