'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '@/store';
import { setUser, logout } from '@/store/slices/authSlice';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ToasterProvider } from '../../components/providers/ToasterProvider';

function AuthHandler({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = Cookies.get('auth_token');
      
      if (!token) {
        if (pathname?.startsWith('/dashboard')) {
          router.push('/login');
        }
        return;
      }

      try {
        const decoded = jwt.decode(token) as jwt.JwtPayload;
        if (!decoded || !decoded.id) {
          throw new Error('Token inválido');
        }

        // Si el token es válido pero no tenemos usuario en Redux
        if (!user) {
          dispatch(setUser({
            id: decoded.id,
            role: decoded.role,
            email: decoded.email,
            fullName: decoded.fullName,
            institution: decoded.institution,
            department: decoded.department,
          }));
        }

        // Redirigir si está en login/register
        if (['/login', '/register'].includes(pathname || '')) {
          router.push(`/dashboard/${decoded.role}`);
        }

      } catch (error) {
        Cookies.remove('auth_token');
        dispatch(logout());
        if (pathname?.startsWith('/dashboard')) {
          router.push('/login');
        }
      }
    };

    verifyAuth();
  }, [pathname, router, dispatch, user]);

  return <>{children}</>;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <Provider store={store}>
      <AuthHandler>
        {!isDashboard && <Navbar />}
        <main className="min-h-screen">
          <ToasterProvider />
          {children}
        </main>
        {!isDashboard && <Footer />}
      </AuthHandler>
    </Provider>
  );
}