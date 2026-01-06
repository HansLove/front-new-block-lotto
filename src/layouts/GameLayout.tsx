import { Outlet } from 'react-router-dom';

// import useScrollRestoration from '@/hooks/useScrollRestoration';
import { BaseLayout } from '@/layouts/BaseLayout';

export const GameLayout = () => {
  // useScrollRestoration();

  return (
    <BaseLayout className="bg-slate-950 dark:bg-slate-100">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-red-800/10" />
      <div className="absolute inset-0 bg-[url('/images/bgdots.png')] bg-repeat opacity-20" />

      <div className="background-container overlay">
        <div className="z-30 mx-auto flex w-full flex-row items-center justify-center">
          <div className="inline-block w-full rounded-xl px-4">
            <div id="games_div" className="mx-auto flex">
              <div className="w-full rounded-xl">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
