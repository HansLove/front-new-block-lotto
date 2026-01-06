import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { generateHexSeed, requestHighEntropy, requestLowEntropy } from '../services/entropy';
import { SeparadorDecimal } from '../utils/SeparadorDecimal';
import Coin from './coin/Coin';
import Dice from './dice/Dice';

interface GameResult {
  type: string;
  result: any;
  proof: {
    hash: string;
    nonce: number;
    stars: number;
    merkleRoot?: string;
    blockHeight?: number;
    timestamp?: number;
    isBlock?: boolean;
  };
}

interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  entropyType: 'high' | 'low';
  stars: number;
}

const UnifiedGamesHub = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  // Store results per game
  const [gameResults, setGameResults] = useState<Record<string, GameResult | null>>({});
  const [loadingGame, setLoadingGame] = useState<string | null>(null);
  const [gameCount, setGameCount] = useState(0);
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [hexSeed, setHexSeed] = useState('');
  const [isHighEntropyPending, setIsHighEntropyPending] = useState(false);

  // Get current game's result
  const currentGameResult = selectedGame ? gameResults[selectedGame] : null;
  const isLoading = loadingGame === selectedGame;

  const isAddressValid = bitcoinAddress.trim().length >= 26;

  const games: Game[] = [
    {
      id: 'coin-flip',
      name: 'Flip a Coin',
      icon: '🪙',
      description: 'Heads or tails?',
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'from-yellow-500/10 to-yellow-600/10',
      entropyType: 'high',
      stars: 12,
    },
    {
      id: 'dice-roll',
      name: 'Roll a Dice',
      icon: '🎲',
      description: 'Roll 1-6',
      color: 'from-red-400 to-red-600',
      bgColor: 'from-red-500/10 to-red-600/10',
      entropyType: 'low',
      stars: 3,
    },
    {
      id: 'random-number',
      name: 'Random Number',
      icon: '🔢',
      description: 'Pick any range',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      entropyType: 'low',
      stars: 3,
    },
    {
      id: 'truth-dare',
      name: 'Truth or Dare',
      icon: '🎯',
      description: 'Make a choice',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10',
      entropyType: 'low',
      stars: 3,
    },
  ];

  const [minNumber, setMinNumber] = useState('1');
  const [maxNumber, setMaxNumber] = useState('100');

  const handleGameSelect = (gameId: string) => {
    if (loadingGame || isHighEntropyPending) return;
    setSelectedGame(selectedGame === gameId ? null : gameId);
    // Auto-generate hex seed when selecting coin-flip
    if (gameId === 'coin-flip' && !hexSeed) {
      setHexSeed(generateHexSeed());
    }
  };

  const isValidHexSeed = (seed: string): boolean => {
    // Must be exactly 8 hex characters (Go's hex.DecodeString requires even length)
    return /^[0-9a-fA-F]{8}$/.test(seed);
  };

  const canPlay = (gameId: string): boolean => {
    if (!isAddressValid) return false;
    if (gameId === 'coin-flip' && !isValidHexSeed(hexSeed)) return false;
    return true;
  };

  const playGame = async (gameId: string) => {
    if (loadingGame || isHighEntropyPending) return;

    if (!bitcoinAddress.trim()) {
      toast.error('Please enter a Bitcoin address', {
        position: 'bottom-center',
        theme: 'dark',
      });
      return;
    }

    if (gameId === 'coin-flip' && !hexSeed.trim()) {
      toast.error('Please enter or generate a hex seed', {
        position: 'bottom-center',
        theme: 'dark',
      });
      return;
    }

    setLoadingGame(gameId);
    setGameCount(prev => prev + 1);

    const gameName = games.find(g => g.id === gameId)?.name;
    toast(`Playing ${gameName}...`, {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: 'dark',
    });

    try {
      let result: GameResult;

      if (gameId === 'coin-flip') {
        setIsHighEntropyPending(true);
        toast.info('High entropy mining in progress...', {
          position: 'bottom-center',
          theme: 'dark',
          autoClose: false,
        });

        const entropyData = await requestHighEntropy(bitcoinAddress, 12, hexSeed);
        const coinResult = (entropyData.nonce % 2) + 1;

        result = {
          type: 'coin',
          result: coinResult,
          proof: {
            hash: entropyData.hash,
            nonce: entropyData.nonce,
            stars: entropyData.leadingZeros,
            merkleRoot: entropyData.merkleRoot,
            blockHeight: entropyData.blockHeight,
            timestamp: entropyData.timestamp,
          },
        };
        setIsHighEntropyPending(false);
        toast.dismiss();
      } else {
        const stars = 3;
        const entropyData = await requestLowEntropy(bitcoinAddress, stars);

        switch (gameId) {
          case 'dice-roll': {
            const diceResult = (entropyData.energy.nonce % 6) + 1;
            result = {
              type: 'dice',
              result: diceResult,
              proof: {
                hash: entropyData.energy.hash,
                nonce: entropyData.energy.nonce,
                stars: entropyData.energy.hash.match(/^0+/)?.[0]?.length || 0,
                merkleRoot: entropyData.energy.merkleRoot,
                blockHeight: entropyData.energy.blockHeight,
                timestamp: entropyData.energy.timestamp,
                isBlock: entropyData.energy.isBlock,
              },
            };
            break;
          }
          case 'random-number': {
            const min = parseInt(minNumber);
            const max = parseInt(maxNumber);
            const range = max - min + 1;
            const randomResult = (entropyData.energy.nonce % range) + min;

            result = {
              type: 'number',
              result: randomResult,
              proof: {
                hash: entropyData.energy.hash,
                nonce: entropyData.energy.nonce,
                stars: entropyData.energy.hash.match(/^0+/)?.[0]?.length || 0,
                merkleRoot: entropyData.energy.merkleRoot,
                blockHeight: entropyData.energy.blockHeight,
                timestamp: entropyData.energy.timestamp,
                isBlock: entropyData.energy.isBlock,
              },
            };
            break;
          }
          case 'truth-dare': {
            const booleanResult = (entropyData.energy.nonce % 2) + 1;
            result = {
              type: 'boolean',
              result: booleanResult,
              proof: {
                hash: entropyData.energy.hash,
                nonce: entropyData.energy.nonce,
                stars: entropyData.energy.hash.match(/^0+/)?.[0]?.length || 0,
                merkleRoot: entropyData.energy.merkleRoot,
                blockHeight: entropyData.energy.blockHeight,
                timestamp: entropyData.energy.timestamp,
                isBlock: entropyData.energy.isBlock,
              },
            };
            break;
          }
          default:
            return;
        }
      }

      // Store result for this specific game
      setGameResults(prev => ({ ...prev, [gameId]: result }));
      setLoadingGame(null);
    } catch (error: any) {
      setLoadingGame(null);
      setIsHighEntropyPending(false);
      toast.dismiss();

      if (error.response?.status === 400) {
        toast.error('Invalid parameters', {
          position: 'bottom-center',
          theme: 'dark',
        });
      } else if (error.response?.status === 408) {
        toast.error('Mining timeout - try again', {
          position: 'bottom-center',
          theme: 'dark',
        });
      } else if (error.message === 'Request timed out') {
        toast.error('Request timed out', {
          position: 'bottom-center',
          theme: 'dark',
        });
      } else {
        toast.error('Server error - try again', {
          position: 'bottom-center',
          theme: 'dark',
        });
      }
    }
  };

  const getResultDisplay = (gameResult: GameResult | null) => {
    if (!gameResult) return null;

    switch (gameResult.type) {
      case 'coin':
        return (
          <div className="text-center">
            <div className="mb-4">
              <Coin stopAtFace={gameResult.result} isAnimating={loadingGame === 'coin-flip'} />
            </div>
            <div
              className={`inline-flex items-center justify-center bg-gradient-to-r px-6 py-3 ${gameResult.result === 1 ? 'from-yellow-400 to-yellow-600' : 'from-gray-400 to-gray-600'} rounded-2xl text-xl font-bold text-white`}
            >
              {gameResult.result === 1 ? 'HEADS' : 'TAILS'}
            </div>
          </div>
        );
      case 'dice':
        return (
          <div className="text-center">
            <div className="mb-4">
              <Dice dice={gameResult.result} isAnimating={loadingGame === 'dice-roll'} />
            </div>
            <div className="text-4xl font-bold text-white">{gameResult.result}</div>
          </div>
        );
      case 'number':
        return (
          <div className="text-center">
            <div className="mb-4 text-6xl font-bold text-white">{gameResult.result}</div>
            <div className="text-gray-400">
              Between {minNumber} and {maxNumber}
            </div>
          </div>
        );
      case 'boolean':
        return (
          <div className="text-center">
            <div className={`text-4xl font-bold ${gameResult.result === 1 ? 'text-green-400' : 'text-red-400'}`}>
              {gameResult.result === 1 ? 'TRUTH' : 'DARE'}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative min-h-screen w-full">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-3 text-4xl font-bold text-white md:text-6xl">
            Quantum{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Games Hub
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-gray-400">
            Experience truly random games powered by blockchain-verified computational energy
          </p>
        </motion.div>

        {/* Bitcoin Address - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mb-8 max-w-4xl"
        >
          <div className="flex items-center gap-4 rounded-2xl border border-slate-700/50 bg-slate-900/80 p-4 backdrop-blur-xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-base font-bold">
              ₿
            </div>
            <input
              type="text"
              value={bitcoinAddress}
              onChange={e => setBitcoinAddress(e.target.value)}
              placeholder="Enter your Bitcoin address..."
              className="flex-1 bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none"
            />
            {isAddressValid && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm"
              >
                ✓
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Main Layout: Vertical Tabs + Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row">
              {/* Vertical Tabs - Left Side */}
              <div className="border-b border-slate-700/50 bg-slate-900/50 p-3 md:w-56 md:shrink-0 md:border-b-0 md:border-r md:p-4">
                <div className="flex gap-2 overflow-x-auto md:flex-col md:gap-3 md:overflow-x-visible">
                  {games.map(game => {
                    const isDisabled = !!loadingGame || isHighEntropyPending || !isAddressValid;
                    return (
                      <button
                        key={game.id}
                        onClick={() => handleGameSelect(game.id)}
                        disabled={isDisabled}
                        className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition-all md:w-full md:gap-4 md:px-4 md:py-4 ${
                          selectedGame === game.id
                            ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-white ring-2 ring-yellow-500/50'
                            : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                        } ${isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                      >
                        <span className="text-2xl md:text-3xl">{game.icon}</span>
                        <div className="hidden md:block">
                          <div className="text-base font-semibold">{game.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="text-yellow-500">{game.stars} ⭐</span>
                            <span className={game.entropyType === 'high' ? 'text-purple-400' : 'text-green-400'}>
                              {game.entropyType === 'high' ? '⚡' : '🚀'}
                            </span>
                          </div>
                        </div>
                        {/* Mobile: show name */}
                        <span className="text-xs font-medium md:hidden">{game.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Panel - Right Side */}
              <div className="flex-1 p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {!selectedGame || !isAddressValid ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex min-h-[350px] flex-col items-center justify-center text-center"
                    >
                      <div className="mb-4 text-6xl">🎮</div>
                      <p className="text-gray-400">
                        {!isAddressValid ? 'Enter a Bitcoin address to start' : 'Select a game to play'}
                      </p>
                    </motion.div>
                  ) : isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex min-h-[350px] flex-col items-center justify-center"
                    >
                      <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-yellow-500/30 border-t-yellow-500" />
                      <p className="text-gray-400">
                        {isHighEntropyPending ? 'Mining high entropy... (up to 60s)' : 'Generating...'}
                      </p>
                    </motion.div>
                  ) : currentGameResult ? (
                    <motion.div
                      key={`result-${selectedGame}-${gameCount}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="min-h-[350px]"
                    >
                      {/* Result Display */}
                      <div className="mb-8 flex items-center justify-center py-6">
                        {getResultDisplay(currentGameResult)}
                      </div>

                      {/* Proof Section - Compact */}
                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-base font-semibold text-white">Proof of Randomness</span>
                          <span className="text-base text-yellow-500">{currentGameResult.proof.stars} ⭐</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-400">
                            Nonce:{' '}
                            <span className="font-mono text-gray-300">
                              {SeparadorDecimal(currentGameResult.proof.nonce)}
                            </span>
                          </p>
                          <p className="truncate text-gray-400">
                            Hash: <span className="font-mono text-gray-300">{currentGameResult.proof.hash}</span>
                          </p>
                        </div>
                      </div>

                      {/* Play Again */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => playGame(selectedGame)}
                        className={`mt-6 w-full rounded-xl bg-gradient-to-r ${games.find(g => g.id === selectedGame)?.color} py-4 text-lg font-bold text-white`}
                      >
                        ▶️ Play Again
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="options"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="min-h-[350px]"
                    >
                      {/* Game Header */}
                      <div className="mb-6 flex items-center gap-4">
                        <span className="text-4xl">{games.find(g => g.id === selectedGame)?.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {games.find(g => g.id === selectedGame)?.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-yellow-500">{games.find(g => g.id === selectedGame)?.stars} ⭐</span>
                            <span
                              className={
                                games.find(g => g.id === selectedGame)?.entropyType === 'high'
                                  ? 'text-purple-400'
                                  : 'text-green-400'
                              }
                            >
                              {games.find(g => g.id === selectedGame)?.entropyType === 'high'
                                ? '⚡ High entropy'
                                : '🚀 Fast'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Game-specific Options */}
                      {selectedGame === 'coin-flip' && (
                        <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
                          <div className="mb-3 flex items-center gap-2 text-base">
                            <span className="text-yellow-500">🔐</span>
                            <span className="font-semibold text-white">Hex Seed</span>
                            <span className="text-sm text-gray-400">(8 hex characters)</span>
                          </div>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={hexSeed}
                              onChange={e => {
                                const filtered = e.target.value
                                  .replace(/[^0-9a-fA-F]/g, '')
                                  .toLowerCase()
                                  .slice(0, 8);
                                setHexSeed(filtered);
                              }}
                              placeholder="a1b2c3d4"
                              maxLength={8}
                              className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 font-mono text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                            <button
                              onClick={() => setHexSeed(generateHexSeed())}
                              className="rounded-lg bg-yellow-500/20 px-4 py-3 text-base text-yellow-400 transition-all hover:bg-yellow-500/30"
                            >
                              🎲 Random
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedGame === 'random-number' && (
                        <div className="mb-6 rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
                          <div className="mb-3 text-base font-semibold text-white">Set Range</div>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={minNumber}
                              onChange={e => setMinNumber(e.target.value)}
                              className="w-28 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-center text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-xl text-gray-500">→</span>
                            <input
                              type="number"
                              value={maxNumber}
                              onChange={e => setMaxNumber(e.target.value)}
                              className="w-28 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-center text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Play Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => playGame(selectedGame)}
                        disabled={!canPlay(selectedGame)}
                        className={`w-full rounded-xl py-4 text-lg font-bold text-white transition-all ${
                          canPlay(selectedGame)
                            ? `bg-gradient-to-r ${games.find(g => g.id === selectedGame)?.color} hover:shadow-lg hover:shadow-yellow-500/20`
                            : 'cursor-not-allowed bg-slate-700 opacity-50'
                        }`}
                      >
                        ▶️ Play {games.find(g => g.id === selectedGame)?.name}
                      </motion.button>

                      {selectedGame === 'coin-flip' && !isValidHexSeed(hexSeed) && (
                        <p className="mt-3 text-center text-sm text-yellow-500">Enter 8 hex characters to play</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <ToastContainer />
    </section>
  );
};

export default UnifiedGamesHub;
