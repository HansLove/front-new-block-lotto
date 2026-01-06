import './style.css';

import React from 'react';

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Spinning Block Lotto logo */}
        <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-lotto-blue-500 text-4xl font-bold text-white animate-spin-slow sm:h-40 sm:w-40 md:h-48 md:w-48">
          B
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Block Lotto</h2>
          <p className="animate-pulse text-sm text-gray-600 sm:text-base">Loading...</p>
        </div>

        {/* Progress indicator */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full animate-pulse rounded-full bg-gradient-to-r from-lotto-green-500 to-lotto-green-600"></div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
