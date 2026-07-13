/**
 * Base error class for all Fluxion SDK errors.
 * Provides hierarchical error handling with error codes.
 */
export class FluxionError extends Error {
  public readonly code: string;
  public readonly timestamp: number;

  constructor(message: string, code: string = 'FLUXION_CORE_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = Date.now();
    Object.setPrototypeOf(this, FluxionError.prototype);
  }
}

/**
 * Wallet connection and signing related errors.
 */
export class WalletError extends FluxionError {
  constructor(message: string, code: string = 'WALLET_CONNECTION_FAILED') {
    super(message, code);
    Object.setPrototypeOf(this, WalletError.prototype);
  }
}

/**
 * RPC communication and request errors.
 */
export class RpcError extends FluxionError {
  constructor(message: string, code: string = 'RPC_REQUEST_FAILED') {
    super(message, code);
    Object.setPrototypeOf(this, RpcError.prototype);
  }
}

/**
 * Transaction simulation and submission errors.
 */
export class TransactionError extends FluxionError {
  constructor(message: string, code: string = 'TRANSACTION_EXECUTION_FAILED') {
    super(message, code);
    Object.setPrototypeOf(this, TransactionError.prototype);
  }
}

/**
 * XDR encoding/decoding errors.
 */
export class ParsingError extends FluxionError {
  constructor(message: string, code: string = 'XDR_PARSING_FAILED') {
    super(message, code);
    Object.setPrototypeOf(this, ParsingError.prototype);
  }
}

/**
 * Contract interaction errors.
 */
export class ContractError extends FluxionError {
  constructor(message: string, code: string = 'CONTRACT_CALL_FAILED') {
    super(message, code);
    Object.setPrototypeOf(this, ContractError.prototype);
  }
}
