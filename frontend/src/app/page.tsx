// app/page.tsx
import { FaBrain, FaCode, FaChartLine, FaGraduationCap, FaRobot, FaArrowRight } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript, SiMysql } from 'react-icons/si';
import { MdStars } from 'react-icons/md';

export default function Home() {
  const features = [
    {
      icon: <FaRobot className="text-4xl" />,
      title: "Evaluación por IA",
      description: "Integración con Gemini y OpenAI para evaluar respuestas de código en tiempo real"
    },
    {
      icon: <FaCode className="text-4xl" />,
      title: "Cuestionarios Dinámicos",
      description: "Preguntas de opción múltiple y abiertas con retroalimentación inmediata"
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Seguimiento de Progreso",
      description: "Dashboard con estadísticas detalladas de tu aprendizaje"
    },
    {
      icon: <FaGraduationCap className="text-4xl" />,
      title: "Enfoque Educativo",
      description: "Contenido diseñado por expertos en pedagogía tecnológica"
    }
  ];

  const techStack = [
    { icon: <SiNextdotjs className="text-4xl" />, name: "Next.js" },
    { icon: <SiTypescript className="text-4xl" />, name: "TypeScript" },
    { icon: <SiMysql className="text-4xl" />, name: "MySQL" },
    { icon: <MdStars className="text-4xl" />, name: "Gemini API" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <span className="text-yellow-400 mr-2">✨</span>
              <span className="text-sm font-medium">Plataforma educativa con IA</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Domina la programación con <span className="text-yellow-400">cuestionarios inteligentes</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Aprende Next.js, TypeScript y más con nuestra plataforma de evaluación asistida por inteligencia artificial.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/register"
                className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                Comenzar Gratis <FaArrowRight className="ml-2" />
              </a>
              <a
                href="/demo"
                className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 rounded-lg text-lg transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Ver Demostración
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tecnologías que impulsan nuestra plataforma</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {techStack.map((tech, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="p-4 bg-white/10 rounded-xl group-hover:bg-yellow-400/20 transition-all duration-300">
                  {tech.icon}
                </div>
                <span className="mt-3 text-lg font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Características Principales</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Todo lo que necesitas para aprender programación de manera efectiva
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2 shadow-lg"
              >
                <div className="text-yellow-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">¿Listo para mejorar tus habilidades?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Únete a nuestra comunidad de estudiantes y lleva tu conocimiento de programación al siguiente nivel.
            </p>
            <a
              href="/register"
              className="inline-block px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Crear Cuenta Gratis
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}