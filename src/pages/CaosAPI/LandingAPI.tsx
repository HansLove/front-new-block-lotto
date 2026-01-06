import { Fade, Slide, Zoom } from 'react-awesome-reveal';
import { GiServerRack } from 'react-icons/gi';

import Coin from '@/components/coin/Coin';
import Dice from '@/components/dice/Dice';

const LandingAPI = () => {
  return (
    <div className="overflow-hidden bg-slate-950 dark:bg-slate-100">
      <div className="mx-auto px-4 py-16 sm:max-w-xl md:max-w-full md:px-24 md:pt-40 lg:max-w-screen-xl lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="min-h-fit overflow-hidden py-14">
            <Coin isAnimating={true} stopAtFace={0} />
            <Dice dice={0} isAnimating={true} speed="1.5s" />
          </div>

          <div className="lg:pr-10">
            <Zoom triggerOnce>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                <GiServerRack className="h-8 text-white" />
              </div>
            </Zoom>

            <Slide triggerOnce>
              <h2 className="mb-6 text-5xl font-extrabold leading-tight text-red-600">Caos Engine API</h2>
            </Slide>

            <Fade cascade triggerOnce>
              <p className="mb-4 text-gray-400 dark:text-slate-800">
                Caos API alldaskjdaksjows any system to request provably random values using real computation performed
                by connected machines.
              </p>
              <p className="mb-4 text-gray-400 dark:text-slate-800">
                Instead of trusting centralized logic, you interact with the fundamental forces of entropy, verifiable
                through proof-of-work hashes and cryptographic signatures.
              </p>
              <p className="mb-6 text-gray-400 dark:text-slate-800">
                Every request triggers real operations executed by our network of devices — not mythical miners, but
                pure compute machines.
              </p>

              <div className="mt-4 rounded-lg bg-slate-800 p-4 text-left dark:bg-slate-200">
                <p className="mb-2 font-mono text-sm text-gray-300 dark:text-gray-700">Example API Request:</p>
                <pre className="rounded bg-slate-900 p-3 font-mono text-xs text-green-400 dark:bg-white dark:text-black">
                  GET https://api.caosengine.com/random?type=sha256&length=32
                </pre>
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-800">
                  Returns a verifiable random string based on a fresh proof-of-work computation.
                </p>
              </div>

              <hr className="my-5 border-gray-600" />
              <div className="text-right text-sm text-red-500 dark:text-red-500">
                <p>“Caos is not destruction — it is pure computation.”</p>
                <p className="mt-1">– Bob Burnett</p>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingAPI;
