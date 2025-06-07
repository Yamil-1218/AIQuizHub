'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ToasterProvider } from '../../components/providers/ToasterProvider';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No mostrar Navbar/Footer en el dashboard
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <Provider store={store}>
      {!isDashboard && <Navbar />}
      <main className="min-h-screen">
        {children}
        <ToasterProvider />
      </main>
      {!isDashboard && <Footer />}
    </Provider>
  );
}
