// components/Footer.tsx
import Link from 'next/link';
import { 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaDiscord, 
  FaYoutube,
  FaBrain,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt
} from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiMysql, SiDocker, SiTypescript } from 'react-icons/si';

export default function Footer() {
  const footerLinks = [
    {
      title: "Plataforma",
      links: [
        { name: "Inicio", href: "/" },
        { name: "Cuestionarios", href: "/quizzes" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Precios", href: "/pricing" }
      ]
    },
    {
      title: "Recursos",
      links: [
        { name: "Documentación", href: "/docs" },
        { name: "Blog", href: "/blog" },
        { name: "Tutoriales", href: "/tutorials" },
        { name: "API", href: "/api-docs" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Términos", href: "/terms" },
        { name: "Privacidad", href: "/privacy" },
        { name: "Cookies", href: "/cookies" },
        { name: "Licencias", href: "/licenses" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center mb-4">
              <FaBrain className="text-2xl text-yellow-400 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-indigo-400 bg-clip-text text-transparent">
                AIQuizHub
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              La plataforma educativa más avanzada para aprender programación con ayuda de inteligencia artificial.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                <FaDiscord className="text-xl" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-yellow-400 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0 text-yellow-400" />
                <span>Av. Tecnología 1234, Ciudad Digital</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-yellow-400" />
                <a href="mailto:info@aiquizhub.com" className="hover:text-yellow-400 transition">
                  info@aiquizhub.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-yellow-400" />
                <a href="tel:+1234567890" className="hover:text-yellow-400 transition">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center items-center mb-8 gap-6">
          <div className="flex items-center space-x-6">
            <SiNextdotjs className="text-2xl text-gray-300 hover:text-white transition" title="Next.js" />
            <SiTypescript className="text-2xl text-blue-500 hover:text-blue-400 transition" title="TypeScript" />
            <SiTailwindcss className="text-2xl text-cyan-400 hover:text-cyan-300 transition" title="Tailwind CSS" />
            <SiMysql className="text-2xl text-blue-600 hover:text-blue-400 transition" title="MySQL" />
            <SiDocker className="text-2xl text-blue-400 hover:text-blue-300 transition" title="Docker" />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} AIQuizHub. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}