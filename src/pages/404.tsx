import { Link } from 'react-router-dom';

import Particles from '@/components/particles';

function NotFoundPage() {
  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 dark:bg-slate-100">
        <Particles className="bg-dots-top pointer-events-none absolute inset-0" quantity={50} />

        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-slate-950 to-red-800/20 dark:from-red-200/20 dark:via-slate-100 dark:to-red-300/20" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-8xl font-bold text-red-600 dark:text-red-700 sm:text-9xl md:text-[12rem]">404</h1>
              <h2 className="text-2xl font-bold text-white dark:text-gray-900 sm:text-3xl md:text-4xl">
                Page Not Found
              </h2>
            </div>

            <p className="mx-auto max-w-2xl text-lg text-gray-300 dark:text-gray-700 sm:text-xl">
              Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved. Return to the homepage to
              continue exploring our APIs.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/"
                className="transform rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-105 hover:from-red-700 hover:to-red-800"
              >
                Back to Home
              </Link>

              <Link
                to="/api"
                className="transform rounded-lg border-2 border-red-600 px-8 py-4 font-semibold text-red-600 transition hover:scale-105 hover:bg-red-600 hover:text-white dark:border-red-700 dark:text-red-700 dark:hover:bg-red-700 dark:hover:text-white"
              >
                View API Docs
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm dark:border-gray-300 dark:bg-white/50">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
                  <h3 className="text-sm font-medium text-gray-400 dark:text-gray-600">Error Code</h3>
                </div>
                <p className="mt-2 text-2xl font-bold text-white dark:text-gray-900">404</p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm dark:border-gray-300 dark:bg-white/50">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-amber-500" />
                  <h3 className="text-sm font-medium text-gray-400 dark:text-gray-600">Status</h3>
                </div>
                <p className="mt-2 text-2xl font-bold text-white dark:text-gray-900">Not Found</p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm dark:border-gray-300 dark:bg-white/50">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />
                  <h3 className="text-sm font-medium text-gray-400 dark:text-gray-600">Action</h3>
                </div>
                <p className="mt-2 text-2xl font-bold text-white dark:text-gray-900">Redirect</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px animate-pulse bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <div className="absolute -left-48 top-1/4 h-96 w-96 animate-pulse rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute -right-48 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-red-700/10 blur-3xl delay-1000" />
      </div>
    </>
  );
}

export default NotFoundPage;
