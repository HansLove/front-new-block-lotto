import { USDTNetwork } from '@taloon/nowpayments-components';

export const USDT_NETWORK_LABELS: Record<USDTNetwork, string> = {
  [USDTNetwork.USDTMATIC]: 'USDT (Polygon)',
  [USDTNetwork.USDTTRC20]: 'USDT (Tron)',
  [USDTNetwork.USDTBSC]: 'USDT (BNB Chain)',
  [USDTNetwork.USDTARB]: 'USDT (Arbitrum)',
  [USDTNetwork.USDTSOL]: 'USDT (Solana)',
  [USDTNetwork.USDTNEAR]: 'USDT (NEAR)',
  [USDTNetwork.USDTOP]: 'USDT (Optimism)',
  [USDTNetwork.USDTDOT]: 'USDT (Polkadot)',
};
