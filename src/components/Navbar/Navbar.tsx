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
    if (isSessionActive) {
      navigate('/lotto');
    } else {
      openLoginModal();
    }
  };

  return (
    <>
      <header className="fixed z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 flex items-center gap-2 p-1.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lotto-blue-500 text-xl font-bold text-white">
                B
              </div>
              <span className="text-xl font-bold text-gray-900">Block-Lotto</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <button
              onClick={handleNewLotto}
              className="rounded-lg bg-lotto-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-lotto-green-600"
            >
              + New Lotto
            </button>
            <button
              onClick={() => (isSessionActive ? navigate('/lotto') : openLoginModal())}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {isSessionActive ? 'Dashboard' : 'Connect'}
            </button>
            {isSessionActive && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                aria-label="Log out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
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
            <div className="fixed inset-0 bg-black/50" />
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
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-6 flow-root px-4">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="py-6">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleNewLotto();
                        }}
                        className="w-full rounded-lg bg-lotto-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-lotto-green-600"
                      >
                        + New Lotto
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          isSessionActive ? navigate('/lotto') : openLoginModal();
                        }}
                        className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {isSessionActive ? 'Dashboard' : 'Connect'}
                      </button>
                      {isSessionActive && (
                        <button
                          onClick={handleLogout}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
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
