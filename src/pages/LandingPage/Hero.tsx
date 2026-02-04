import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useLogInHook';

const Hero = () => {
  const { isSessionActive, openLoginModal } = useAuth();
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    if (isSessionActive) {
      navigate('/lotto');
    } else {
      openLoginModal();
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-4xl font-normal italic leading-tight text-gray-900 sm:text-5xl md:text-6xl">
          Decentralized luck. Powered by math.
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-gray-600">
          Participate in the first transparent, high-frequency lottery system active on the blockchain. No house edge,
          just pure probability.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={handleStartPlaying}
            className="w-full rounded-lg bg-lotto-green-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-lotto-green-600 sm:w-auto"
          >
            Start Playing
          </button>
          <Link
            to="/lotto"
            className="text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            See live lottos →
          </Link>
        </div>
        <p className="mt-8">
          <Link to="#transparency" className="text-sm text-gray-400 transition-colors hover:text-gray-600">
            View Contracts
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Hero;
