import { useState } from 'react';
import {
  FaBars,
  FaBug,
  // FaBook,
  FaKey,
  // FaBolt,
  // FaCode,
  // FaCodeBranch,
  FaQuestion,
  FaRocket,
  FaServer,
  FaTimes,
} from 'react-icons/fa';

import useScrollRestoration from '@/hooks/useScrollRestoration';

import Authentication from './sections/Authentication';
import Endpoints from './sections/Endpoints';
import ErrorCodes from './sections/ErrorCodes';
import FAQs from './sections/FAQs';
import GettingStarted from './sections/GettingStarted';
import Introduction from './sections/Introduction';
import Libraries from './sections/Libraries';
import RateLimits from './sections/RateLimits';
import Versioning from './sections/Versioning';

const sections = [
  { id: 'getting-started', label: 'Getting Started', icon: FaRocket },
  { id: 'authentication', label: 'Authentication', icon: FaKey },
  { id: 'endpoints', label: 'Endpoints', icon: FaServer },
  { id: 'errors', label: 'Error Codes', icon: FaBug },
  // Temporarily hidden sections:
  // { id: 'introduction', label: 'Introduction', icon: FaBook },
  // { id: "rate-limits", label: "Rate Limits", icon: FaBolt },
  // { id: "libraries", label: "Libraries", icon: FaCode },
  // { id: "versioning", label: "Versioning", icon: FaCodeBranch },
  { id: 'faqs', label: 'FAQs', icon: FaQuestion },
];

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { restore } = useScrollRestoration();

  const renderSection = () => {
    switch (activeSection) {
      case 'introduction':
        return <Introduction />;
      case 'authentication':
        return <Authentication />;
      case 'getting-started':
        return <GettingStarted />;
      case 'endpoints':
        return <Endpoints />;
      case 'errors':
        return <ErrorCodes />;
      case 'rate-limits':
        return <RateLimits />;
      case 'libraries':
        return <Libraries />;
      case 'versioning':
        return <Versioning />;
      case 'faqs':
        return <FAQs />;
      default:
        return null;
    }
  };

  const onSectionChange = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false); // Close mobile menu when section changes
    restore();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Mobile Menu Button */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="rounded-lg bg-slate-800/90 p-3 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/90"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      <div className="flex min-h-screen pt-4 lg:pt-0">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-80 transform border-r border-slate-700 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-sm transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 pt-20 lg:pt-6">
            <div className="mb-8">
              <h1 className="mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-2xl font-bold text-transparent">
                CaosEngine
              </h1>
              <span className="text-lg font-semibold text-orange-500">API Documentation</span>
            </div>

            <nav className="space-y-2">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onSectionChange(id)}
                  className={`group flex w-full items-center rounded-lg px-4 py-3 text-left transition-all duration-200 ${
                    activeSection === id
                      ? 'border border-red-500/30 bg-gradient-to-r from-red-600/20 to-orange-600/20 text-orange-400 shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div
                    className={`mr-3 rounded-lg p-2 transition-all duration-200 ${
                      activeSection === id
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                        : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-slate-300'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="mt-12 border-t border-slate-700 pt-6">
              <p className="text-xs text-slate-500">
                Need help? Check our{' '}
                <button
                  onClick={() => onSectionChange('faqs')}
                  className="text-orange-400 transition-colors duration-200 hover:text-orange-300"
                >
                  FAQs
                </button>
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-6 py-8 lg:px-12 lg:py-12">{renderSection()}</div>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
