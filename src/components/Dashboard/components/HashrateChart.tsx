import { useEffect, useState } from 'react';
// import axios from "axios";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { hashRateData } from './hashRateData';

// Convert timestamp + hashrate pair into recharts format
const parseHashrateData = (raw: [number, number][]) => {
  return raw.map(([timestamp, hashrate]) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    hashrate: Number((hashrate / 1e15).toFixed(2)), // convert to PH/s
  }));
};

export default function HashrateChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHashrate = async () => {
      try {
        // const res = await axios.get(
        //   "https://api.blockchain.info/charts/hash-rate?timespan=7days&format=json"
        // );

        // const parsed = res.data.values.map((entry: any) => [
        // const parsed2 = hashRateData.map((entry: any) => console.log("Entr data:",entry));
        const parsed: any = hashRateData.map((entry: any) => [entry[0] * 1000, entry[1]]);

        setData(parseHashrateData(parsed));
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch hashrate chart:', err);
        setLoading(false);
      }
    };

    fetchHashrate();
  }, []);

  return (
    <div className="w-full rounded-xl bg-[#1a1a2e] p-6 shadow-xl">
      <h2 className="mb-4 text-lg font-semibold text-white">Network Hashrate (Last 7 Days)</h2>
      {loading ? (
        <p className="text-gray-400">Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" unit=" PH/s" />
            <Tooltip formatter={(val: any) => `${val} PH/s`} />
            <Line type="monotone" dataKey="hashrate" stroke="#e63946" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
