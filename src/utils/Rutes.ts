export const API_URL = `${import.meta.env.VITE_TEST_MODE == '0' ? import.meta.env.VITE_SERVER_TESTNET : import.meta.env.VITE_SERVER_MAINNET}`;

// Entropy endpoints (used by services/entropy.ts)
export const RUTE_ENTROPY_LOW = 'api/v1/mining/energy';
export const RUTE_ENTROPY_HIGH = 'v1/mining/energy/high';
