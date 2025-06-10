import { NextResponse } from 'next/server';

function extractJSONFromCodeBlock(text: string): string {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    return jsonMatch ? jsonMatch[1].trim() : '';
}

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const generatedPrompt = `
Eres un generador de cuestionarios. Genera un cuestionario de opción múltiple basado en la siguiente solicitud del usuario:

"${prompt}"

Tu respuesta debe ser un bloque de JSON que contenga exactamente este formato:

\`\`\`json
{
  "questions": [
    {
      "question": "¿Qué es TypeScript?",
      "options": ["Un framework", "Un lenguaje tipado", "Un compilador de Java"],
      "correctAnswer": "Un lenguaje tipado"
    },
    ...
  ]
}
\`\`\`

No agregues ninguna explicación, solo responde con el bloque JSON.
`;

        const body = {
            contents: [
                {
                    parts: [{ text: generatedPrompt }]
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

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) throw new Error('La IA no devolvió texto');

        console.log('Texto crudo recibido de Gemini:\n', rawText);

        const jsonText = extractJSONFromCodeBlock(rawText);

        if (!jsonText) throw new Error('No se encontró un bloque JSON en la respuesta');

        const quizData = JSON.parse(jsonText);

        if (!quizData.questions || !Array.isArray(quizData.questions)) {
            throw new Error('Formato incorrecto: no se encontró el array de preguntas');
        }

        return NextResponse.json({ questions: quizData.questions });
    } catch (err: any) {
        console.error('Error en demo/generate:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
