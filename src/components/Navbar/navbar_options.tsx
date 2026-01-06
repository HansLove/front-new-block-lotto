/* eslint-disable simple-import-sort/imports */
import {
  CpuChipIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  // ServerIcon,
  CubeIcon,
  // BoltIcon,
  CommandLineIcon,
  SparklesIcon,
  // HeartIcon,
  // PuzzlePieceIcon,
} from '@heroicons/react/24/outline';

export const COMPUTING_SOLUTIONS = [
  {
    name: 'Personalized Computing',
    route: '/personalized-computing',
    description: 'High-performance GPU computing for your specific needs.',
    icon: CpuChipIcon,
  },
  {
    name: 'Energy Network',
    route: '/network',
    description: 'Connect to our energy network to power your computing needs.',
    icon: CubeIcon,
  },
];

export const ENTERPRISE_SERVICES = [
  {
    name: 'RaaS API',
    route: '/raas-api',
    description: 'RaaS API is a high-frequency random number generator ',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Energy Provider',
    route: '/energy-provider',
    description: 'Energy provider for the computing engine.',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Yield Generation',
    route: '/yield-solutions',
    description: 'DeFi strategies with verifiable randomness.',
    icon: CurrencyDollarIcon,
  },
];

export const GAMES = [
  {
    name: 'Games Hub',
    route: '/games',
    description: 'Experience true randomness through fun games.',
    icon: SparklesIcon,
  },
  // {
  //   name: 'Random Generator',
  //   route: '/games/random-number',
  //   description: 'Cryptographically verified random numbers.',
  //   icon: CpuChipIcon,
  // },
];

export const PLATFORM_ACCESS = [
  {
    name: 'API Access',
    route: '/raas-api',
    description: 'Integrate our computing power into your apps.',
    icon: CommandLineIcon,
  },
];
