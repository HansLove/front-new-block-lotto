import { Dialog, Transition } from '@headlessui/react';
import { ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useLogInHook';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openLoginModal, isSessionActive, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleNewLotto = () => {
    if (isSessionActive) navigate('/lotto');
    else openLoginModal();
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-white/[0.07] bg-[#07070a]/90 backdrop-blur-sm">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
          aria-label="Global"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 flex items-center gap-2.5 p-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lotto-blue-500 text-lg font-bold text-white">
                B
              </div>
              <span className="text-lg font-semibold text-white">Block-Lotto</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white/50 hover:text-white/90"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
            <button
              onClick={handleNewLotto}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
            >
              + New Lotto
            </button>
            <button
              onClick={() => (isSessionActive ? navigate('/lotto') : openLoginModal())}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white"
            >
              {isSessionActive ? 'Dashboard' : 'Connect'}
            </button>
            {isSessionActive && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white/50 transition-colors hover:border-white/25 hover:text-white/80"
                aria-label="Log out"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Log out
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto border-r border-white/[0.07] bg-[#0e0e14] pb-12 shadow-2xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white/50 hover:text-white/90"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-6 flow-root px-4">
                  <div className="-my-6 divide-y divide-white/[0.07]">
                    <div className="space-y-3 py-6">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleNewLotto();
                        }}
                        className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
                      >
                        + New Lotto
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          isSessionActive ? navigate('/lotto') : openLoginModal();
                        }}
                        className="w-full rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white"
                      >
                        {isSessionActive ? 'Dashboard' : 'Connect'}
                      </button>
                      {isSessionActive && (
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/50 transition-colors hover:border-white/25 hover:text-white/80"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          Log out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default Navbar;
