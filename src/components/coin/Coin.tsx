import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CoinProps {
  isAnimating?: boolean;
  stopAtFace?: number;
  width?: string;
  // height?: string;
}

export default function Coin({ isAnimating = false, stopAtFace = 0, width = '160px' }: CoinProps) {
  const [, setAnimationSpeed] = useState(0);

  useEffect(() => {
    if (stopAtFace !== 0) {
      setAnimationSpeed(0);
    } else {
      setAnimationSpeed(0.35);
    }
  }, [stopAtFace]);

  const coinSize = parseInt(width);
  // const isMobile = coinSize <= 80;

  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="relative"
        style={{ 
          width: coinSize, 
          height: coinSize,
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
        animate={{
          rotateY: isAnimating ? 360 : stopAtFace === 1 ? 0 : stopAtFace === 2 ? 180 : 0,
        }}
        transition={{
          duration: isAnimating ? 2 : 0.8,
          ease: "easeInOut",
          repeat: isAnimating ? Infinity : 0,
        }}
      >
        {/* Front Face (Heads) */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              linear-gradient(135deg, 
                #FFD700 0%, 
                #FFA500 50%, 
                #FFD700 100%
              )
            `,
            boxShadow: `
              inset 0 0 20px rgba(255, 255, 255, 0.3),
              0 8px 32px rgba(255, 215, 0, 0.3),
              0 0 0 2px rgba(255, 215, 0, 0.2)
            `,
            transform: 'translateZ(4px)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Heads Design - Clean and prominent */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center z-10 relative">
              <div className="w-20 h-20 mx-auto mb-2 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300">
                <span className="text-4xl font-bold text-yellow-600">H</span>
              </div>
              <div className="text-lg font-bold text-white bg-yellow-600/90 px-4 py-1 rounded-full shadow-lg">
                HEADS
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back Face (Tails) */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              linear-gradient(135deg, 
                #C0C0C0 0%, 
                #A0A0A0 50%, 
                #C0C0C0 100%
              )
            `,
            boxShadow: `
              inset 0 0 20px rgba(255, 255, 255, 0.2),
              0 8px 32px rgba(192, 192, 192, 0.3),
              0 0 0 2px rgba(192, 192, 192, 0.2)
            `,
            transform: 'translateZ(-4px) rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Tails Design - Clean and prominent */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center z-10 relative">
              <div className="w-20 h-20 mx-auto mb-2 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-400">
                <span className="text-4xl font-bold text-gray-600">T</span>
              </div>
              <div className="text-lg font-bold text-white bg-gray-600/90 px-4 py-1 rounded-full shadow-lg">
                TAILS
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simple edge */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              linear-gradient(90deg,
                #FFD700 0%,
                #FFA500 50%,
                #FFD700 100%
              )
            `,
            transform: 'rotateX(90deg) translateZ(2px)',
          }}
        />
      </motion.div>
    </div>
  );
}
