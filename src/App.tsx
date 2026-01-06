import './App.scss';

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router-dom';

import { BaseLayout } from '@/layouts/BaseLayout';

import { Footer } from './components/footer';
import Loader from './components/Loader/Loader';
import { useAuth } from './hooks/useLogInHook';
import FAQ from './pages/Footer/FAQ';

// Lazy load all route components
const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const MiningPoolConnection = lazy(() => import('./components/miningPoolConnection'));
const SignUp = lazy(() => import('./components/signup/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/Request'));
const ResetPassword = lazy(() => import('./pages/ForgotPassword/Reset'));
const NotFoundPage = lazy(() => import('./pages/404'));

const TermsAndConditions = lazy(() => import('./pages/Footer/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/Footer/PrivacyPolicy'));

// Unified Games Hub component - central playground for all games
const UnifiedGamesHub = lazy(() => import('./components/UnifiedGamesHub'));
const ApiKeys = lazy(() => import('./pages/CaosAPI/ApiKeys'));
const LottoDash = lazy(() => import('./pages/lotto/lottodashboard'));
const TicketDetail = lazy(() => import('./pages/lotto/TicketDetail'));
// Base layout component that provides consistent spacing and structure

// Layout component for routes that need Navbar with standard content spacing
const NavbarLayout = () => (
  <BaseLayout>
    <div className="mx-auto w-full bg-white px-4 py-8">
      <Outlet />
    </div>
  </BaseLayout>
);

// Landing page layout (no navbar, full width)
const LandingLayout = () => (
  <div className="min-h-screen">
    <Outlet />
  </div>
);

// Auth pages layout (no navbar, centered content)
const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="w-full max-w-md px-4">
      <Outlet />
    </div>
  </div>
);

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Landing page - no navbar */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Auth pages - no navbar, centered */}
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/api-key" element={<ApiKeys />} />
          {/* Main app routes - with navbar and proper spacing */}
          <Route element={<NavbarLayout />}>
            <Route path="/games" element={<UnifiedGamesHub />} />
            <Route path="/network" element={<MiningPoolConnection />} />
            {/* <Route path="/simulation" element={<SimulationBallDemo />} /> */}
          </Route>
          {/* Lotto routes - full page */}
          <Route path="/lotto" element={<LottoDash />} />
          <Route path="/lotto/:ticketId" element={<TicketDetail />} />

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
