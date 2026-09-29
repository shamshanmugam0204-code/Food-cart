import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { StickyCartBar } from './StickyCartBar';
import { ToastContainer } from '../common/Toast';

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-ink antialiased">
      <ToastContainer />
      <Header />
      <main className="flex-1 pb-16 sm:pb-0">
        <Outlet />
      </main>
      <StickyCartBar />
      <Footer />
    </div>
  );
}
