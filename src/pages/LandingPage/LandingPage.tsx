import { useEffect } from 'react';

import LoginModal from '@/components/Login/Login';
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/hooks/useLogInHook';

import Hero from './Hero';

function LandingPage() {
  const { openLoginModal } = useAuth();

  useEffect(() => {
    const shouldTriggerLogin = Boolean(localStorage.getItem('shouldTriggerLogin'));
    if (shouldTriggerLogin) {
      openLoginModal();
      localStorage.removeItem('shouldTriggerLogin');
      return;
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-16">
        <Hero />
        <LoginModal />
      </div>
    </>
  );
}

export default LandingPage;
