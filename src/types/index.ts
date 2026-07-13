import { Networks } from '@stellar/stellar-sdk';

export interface NetworkConfig {
  networkPassphrase: string;
  rpcUrl: string;
}

export interface ContractMetadata {
  contractId: string;
}

export interface FluxionConfig extends NetworkConfig {
  fluxionCoreId: string;
  governanceId?: string;
}

export interface StreamParams {
  recipient: string;
  depositAmount: bigint;
  startTime: bigint;
  stopTime: bigint;
  tokenAddress: string;
}

export interface StreamData {
  sender: string;
  recipient: string;
  depositAmount: bigint;
  startTime: bigint;
  stopTime: bigint;
  ratePerSecond: bigint;
  tokenAddress: string;
  withdrawnAmount: bigint;
  isCanceled: boolean;
}

export interface VestingSchedule {
  beneficiary: string;
  totalAmount: bigint;
  cliffAmount: bigint;
  cliffTime: bigint;
  endDuration: bigint;
  releasedAmount: bigint;
  revocable: boolean;
  revoked: boolean;
}

export interface TransactionResult {
  status: 'SUCCESS' | 'FAILED';
  txHash: string;
  returnValue?: unknown;
  error?: string;
}
