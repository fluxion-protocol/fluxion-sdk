import { Networks } from '@stellar/stellar-sdk';
import type { NetworkConfig } from '../types/index.js';

export const DEFAULT_TESTNET_RPC = 'https://soroban-testnet.stellar.org';
export const DEFAULT_MAINNET_RPC = 'https://soroban-mainnet.stellar.org';

export const TIMEOUT_SECONDS = 30;

export const DEFAULT_CONFIG = {
  TESTNET: {
    networkPassphrase: Networks.TESTNET_NETWORK_PASSPHRASE,
    rpcUrl: DEFAULT_TESTNET_RPC,
  } satisfies NetworkConfig,
  MAINNET: {
    networkPassphrase: Networks.PUBLIC_NETWORK_PASSPHRASE,
    rpcUrl: DEFAULT_MAINNET_RPC,
  } satisfies NetworkConfig,
} as const;

export const DEFAULT_FEE = '1000';
export const DEFAULT_SIMULATION_FEE = '100';
export const EMERGENCY_PAUSE_FEE = '1500';
