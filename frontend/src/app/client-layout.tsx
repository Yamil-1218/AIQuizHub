'use client';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ToasterProvider } from '../../components/providers/ToasterProvider';
import AuthRedirector from '../../components/AuthRedirector';
import LoadingOverlay from '../../components/LoadingOverlay'; // Componente nuevo para carga

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRedirector />
      <ToasterProvider />
      {/* Eliminar la lógica de navbar/footer aquí - mover a layouts específicos */}
      {children}
    </Provider>
  );
}