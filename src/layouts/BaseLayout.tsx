import LoginModal from '@/components/Login/Login';
import Navbar from '@/components/Navbar/Navbar';
import useScrollRestoration from '@/hooks/useScrollRestoration';

export const BaseLayout = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  useScrollRestoration();

  return (
    <div className={`min-h-screen ${className}`}>
      <Navbar />
      <LoginModal />
      <main className="pt-20">
        {' '}
        {/* Add top padding to account for fixed navbar */}
        {children}
      </main>
    </div>
  );
};
