export const API_URL = `${import.meta.env.VITE_TEST_MODE == '0' ? import.meta.env.VITE_SERVER_TESTNET : import.meta.env.VITE_SERVER_MAINNET}`;
