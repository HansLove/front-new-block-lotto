import axios from 'axios';
import { useEffect, useState } from 'react';

export default function BitcoinNetworkStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://api.blockchain.info/stats');
        console.log('Response :::::', response);
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blockchain stats:', error);
        setStats({
          timestamp: 1745227624000,
          market_price_usd: 87626.53,
          hash_rate: 728995743823.8036,
          total_fees_btc: -37187500000,
          n_btc_mined: 37187500000,
          n_tx: 418493,
          n_blocks_mined: 119,
          minutes_between_blocks: 11.0763,
          totalbc: 1985423750000000,
          n_blocks_total: 893356,
          estimated_transaction_volume_usd: 3460263889.760351,
          blocks_size: 197895328,
          miners_revenue_usd: 0,
          nextretarget: 895103,
          difficulty: 123234387977050,
          estimated_btc_sent: 3948877000790,
          miners_revenue_btc: 0,
          total_btc_sent: 40328217046527,
          trade_volume_btc: 2218.75,
          trade_volume_usd: 194421363.4375,
        });
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return <p className="text-center text-gray-400">Loading Bitcoin Network Stats...</p>;
  }

  //   const hashrateEH = (stats.hash_rate / 1e18).toFixed(2); // Convert H/s to EH/s
  // const hashrateEH = (stats.hash_rate / 1e9).toFixed(2); // Convert H/s to EH/s
  const difficultyT = (stats.difficulty / 1e12).toFixed(2); // Convert to T (tera)
  // const btcPrice = stats.market_price_usd.toLocaleString("en-US", {
  //   style: "currency",
  //   currency: "USD",
  // });
  const blockRewardBTC = (stats.n_btc_mined / 1e8 / stats.n_blocks_mined).toFixed(2); // In BTC per block

  function KPI({ title, value }: { title: string; value: string }) {
    return (
      <div className="rounded-xl bg-[#1a1a2e] p-4 shadow-xl">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">
        &quot;We do not mine. We compute. Every device connected to Caos Engine is just executing a universal logic:
        proof of randomness. Electricity in. Results out&quot;
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <KPI title="Computational Power" value={`${(stats.hash_rate / 1e9).toFixed(2)} GigaOps/s`} />
        <KPI title="Result Frequency" value={`${blockRewardBTC} results/10m`} />
        <KPI
          title="Energy-to-Result Ratio"
          value={`${(stats.market_price_usd / (stats.hash_rate / 1e12)).toFixed(6)} $/TeraOp`}
        />
        <KPI title="Algorithmic Resistance" value={`${difficultyT} log-units`} />
        <KPI title="Result Latency" value={`${stats.minutes_between_blocks.toFixed(2)} s`} />
        <KPI title="Executions Completed" value={`${stats.n_blocks_mined}`} />
      </div>
    </>
  );
}
