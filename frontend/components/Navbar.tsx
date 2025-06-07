'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaBrain, FaTimes, FaBars, FaSignOutAlt, FaUser, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { verifyToken } from '@/utils/jwt';
import toast from 'react-hot-toast';

// Interface para el payload del JWT
interface JwtPayload {
  role: string;
  fullName?: string;
  email?: string;
  // otras propiedades que pueda tener tu token
}

interface UserData {
  role: string | null;
  fullName?: string;
  email?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<UserData>({ role: null });
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const checkAuth = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (token) {
        try {
          const decoded = await verifyToken(token);
          
          // Verificación de tipo segura
          if (typeof decoded === 'object' && decoded !== null && 'role' in decoded) {
            const payload = decoded as JwtPayload;
            setUserData({ 
              role: payload.role,
              fullName: payload.fullName,
              email: payload.email
            });
          } else {
            // Token no tiene la estructura esperada
            setUserData({ role: null });
          }
        } catch (error) {
          setUserData({ role: null });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    checkAuth();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUserData({ role: null });
    toast.success('Sesión cerrada correctamente');
    router.push('/');
    setIsOpen(false);
  };

  const getDashboardLink = () => {
    return userData.role === 'instructor' 
      ? { 
          name: 'Panel Instructor', 
          path: '/dashboard/instructor', 
          icon: <FaChalkboardTeacher className="mr-2" /> 
        }
      : { 
          name: 'Mi Aprendizaje', 
          path: '/dashboard/student', 
          icon: <FaUserGraduate className="mr-2" /> 
        };
  };

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Cuestionarios', path: '/quizzes' },
    { name: 'Características', path: '/features' },
    { name: 'Contacto', path: '/contact' },
  ];

  const dashboardLink = getDashboardLink();

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FaBrain className="text-2xl text-yellow-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-indigo-400 bg-clip-text text-transparent">
              AIQuizHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-1 py-2 font-medium transition ${pathname === link.path ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-white hover:text-yellow-300'}`}
              >
                {link.name}
              </Link>
            ))}
            {userData.role && (
              <Link
                href={dashboardLink.path}
                className={`px-1 py-2 font-medium transition ${pathname.startsWith('/dashboard') ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-white hover:text-yellow-300'}`}
              >
                {dashboardLink.name}
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {userData.role ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-white group relative">
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-yellow-400" />
                    <span>{userData.fullName || (userData.role === 'instructor' ? 'Instructor' : 'Estudiante')}</span>
                  </div>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {userData.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 flex items-center text-white hover:text-yellow-300 transition"
                >
                  <FaSignOutAlt className="mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-white hover:text-yellow-300 transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded-lg transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-lg font-medium ${pathname === link.path ? 'bg-yellow-400 text-gray-900' : 'text-white hover:bg-gray-800'}`}
                >
                  {link.name}
                </Link>
              ))}
              {userData.role && (
                <Link
                  href={dashboardLink.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-lg font-medium flex items-center ${pathname.startsWith('/dashboard') ? 'bg-yellow-400 text-gray-900' : 'text-white hover:bg-gray-800'}`}
                >
                  {dashboardLink.icon}
                  {dashboardLink.name}
                </Link>
              )}
              
              <div className="pt-2 border-t border-gray-700">
                {userData.role ? (
                  <>
                    <div className="px-3 py-2 text-white flex items-center">
                      <FaUser className="mr-2 text-yellow-400" />
                      <div>
                        <div>{userData.fullName || (userData.role === 'instructor' ? 'Instructor' : 'Estudiante')}</div>
                        <div className="text-xs text-gray-400">{userData.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 mt-2 rounded-lg flex items-center text-white hover:bg-gray-800"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg text-white hover:bg-gray-800"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 mt-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}