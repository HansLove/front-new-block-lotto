export const API_URL = `${import.meta.env.VITE_TEST_MODE == '0' ? import.meta.env.VITE_SERVER_TESTNET : import.meta.env.VITE_SERVER_MAINNET}`;

const RUTE_PLAY_GAME = 'chips/play/game';

const RUTE_GET_MINERS_HARDWARE_DATA = 'stats/miners';

const RUTE_GET_MINING_POOLS_DATA = 'stats/mining-pools';

const RUTE_USER_CHIPS = 'chips/bitcoin/';

const RUTE_LEDGER_PENDING = 'ledger/get/pending/';

const RUTE_METADATA_INFO = 'metadata/get/info';

const RUTE_MP_GET_APP_ID = 'api/v1/app/key/get';
const RUTE_MP_ADD_MINER = 'api/v1/app/keys';
const RUTE_BITCOIN_ADDRESS = 'bitcoin/address/user/email/';
const RUTE_BITCOIN_SEND_PAY = 'bitcoin/send/pay/';

// Liquidity
const RUTE_LIQUIDITY_ADD = 'liquidity/add/';
const RUTE_LIQUIDITY_GET = 'liquidity/get/';
const RUTE_LIQUIDITY_YIELD = 'liquidity/yield/';
const RUTE_LIQUIDITY_CHART = 'liquidity/chart/';
const RUTE_LIQUIDITY_CHART_PIE = 'liquidity/pie/';
const RUTE_LIQUIDITY_CHART_ALL = 'liquidity/all/';

// Login with email
const RUTE_LOGIN_EMAIL = 'user/login/email';
const RUTE_REGISTER_EMAIL = 'user/email';
const RUTE_LOGIN_VALID_CODE = 'user/valid/code';

const RUTE_USER_INFO_GAMES = 'user/info/games';
const RUTE_USER_CHIPS_CHART = 'chips/chart';

// Users payments history
const RUTE_PAYMENTS_USER = 'payment/get';

// Ask for withdraw in Bitcoin
const RUTE_BITCOIN_WITHDRAW = 'bitcoin/pay/email';

//Energy
// Request energy to miner trough API
const RUTE_REQUEST_ENERGY = 'api/v1/mining/new';

// Entropy endpoints
export const RUTE_ENTROPY_LOW = 'api/v1/mining/energy';
export const RUTE_ENTROPY_HIGH = 'api/v1/mining/energy/high';

const RUTE_REQUEST_NEW_GAME = 'game/new';

const RUTE_ENERGY_REPORT_GAME = 'ledger/energy/user';

//User stand
const RUTE_BLACKJACK_STAND = 'game/bj/stand';
// User double
const RUTE_BLACKJACK_DOUBLE = 'game/bj/double';

// Activation of Insurance
const RUTE_BLACKJACK_INSURANCE = 'game/bj/insurance';

const RUTE_BLACKJACK_DIVIDE = 'game/bj/divide';
