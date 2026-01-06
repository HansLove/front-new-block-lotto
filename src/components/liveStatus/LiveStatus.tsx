import { useEffect, useState } from 'react';

import ConnectionStatus from './ConnectionStatus';
import RandomSeedGenerator from './RandomSeedGenerator';
import ShareHistory from './ShareHistory';

export default function LiveStatus() {
  const [connections, setConnections] = useState(0);
  const [shareTimestamps, setShareTimestamps] = useState<number[]>([]);
  const [lastSeed, setLastSeed] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState('--');

  // Simulación de conexión
  useEffect(() => {
    const interval = setInterval(() => {
      setConnections(Math.random() > 0.5 ? 1 : 0);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Simulación de shares
  useEffect(() => {
    const interval = setInterval(() => {
      setShareTimestamps(prev => [...prev, Date.now()]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Tiempo desde el último share
  useEffect(() => {
    const timer = setInterval(() => {
      if (shareTimestamps.length === 0) return;
      const seconds = Math.floor((Date.now() - shareTimestamps[shareTimestamps.length - 1]) / 1000);
      setElapsed(`${seconds} seconds ago`);
    }, 5000);
    return () => clearInterval(timer);
  }, [shareTimestamps]);

  const simulateNewSeed = () => {
    const newSeed = Math.floor(Math.random() * 1_000_000_000);
    setLastSeed(newSeed);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-lg bg-gray-900 p-6 text-white shadow-lg">
      <ConnectionStatus connections={connections} />
      <ShareHistory shareTimestamps={shareTimestamps} elapsed={elapsed} />
      <RandomSeedGenerator lastSeed={lastSeed} onGenerate={simulateNewSeed} />
    </div>
  );
}
