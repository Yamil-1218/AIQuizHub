import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { topic, count, type } = await req.json()

  if (!topic || !count || !type) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  try {
    // Simular llamada a IA (reemplaza esto por llamada real a OpenAI o tu backend)
    const draftQuiz = {
      id: Date.now().toString(), // usar UUID si prefieres
      topic,
      type,
      questions: Array.from({ length: count }).map((_, i) => ({
        question: `Pregunta ${i + 1} sobre ${topic}`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        answer: 'Opción A',
      })),
    }

    // Aquí deberías guardar el borrador en tu DB
    // por ahora simulamos con sessionStorage o una base de datos temporal

    // Devuelve el ID del cuestionario borrador generado
    return NextResponse.json({ draftId: draftQuiz.id })
  } catch (err) {
    return NextResponse.json({ error: 'Fallo la generación' }, { status: 500 })
  }
}
