import { describe, it, expect } from 'vitest';
import {
  FluxionError,
  WalletError,
  RpcError,
  TransactionError,
  ParsingError,
  ContractError,
} from '../src/errors/index.js';

describe('Error Classes', () => {
  it('should create FluxionError with default code', () => {
    const error = new FluxionError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('FLUXION_CORE_ERROR');
    expect(error.timestamp).toBeDefined();
    expect(error).toBeInstanceOf(Error);
  });

  it('should create FluxionError with custom code', () => {
    const error = new FluxionError('Test error', 'CUSTOM_CODE');
    expect(error.code).toBe('CUSTOM_CODE');
  });

  it('should create WalletError with correct code', () => {
    const error = new WalletError('Wallet failed');
    expect(error.code).toBe('WALLET_CONNECTION_FAILED');
    expect(error).toBeInstanceOf(FluxionError);
  });

  it('should create RpcError with correct code', () => {
    const error = new RpcError('RPC failed');
    expect(error.code).toBe('RPC_REQUEST_FAILED');
    expect(error).toBeInstanceOf(FluxionError);
  });

  it('should create TransactionError with correct code', () => {
    const error = new TransactionError('Transaction failed');
    expect(error.code).toBe('TRANSACTION_EXECUTION_FAILED');
    expect(error).toBeInstanceOf(FluxionError);
  });

  it('should create ParsingError with correct code', () => {
    const error = new ParsingError('Parse failed');
    expect(error.code).toBe('XDR_PARSING_FAILED');
    expect(error).toBeInstanceOf(FluxionError);
  });

  it('should create ContractError with correct code', () => {
    const error = new ContractError('Contract failed');
    expect(error.code).toBe('CONTRACT_CALL_FAILED');
    expect(error).toBeInstanceOf(FluxionError);
  });

  it('should maintain error prototypes for instanceof checks', () => {
    const walletError = new WalletError('test');
    expect(walletError instanceof WalletError).toBe(true);
    expect(walletError instanceof FluxionError).toBe(true);
    expect(walletError instanceof Error).toBe(true);
  });

  it('should capture timestamp for error tracking', () => {
    const before = Date.now();
    const error = new FluxionError('Test');
    const after = Date.now();

    expect(error.timestamp).toBeGreaterThanOrEqual(before);
    expect(error.timestamp).toBeLessThanOrEqual(after);
  });
});
