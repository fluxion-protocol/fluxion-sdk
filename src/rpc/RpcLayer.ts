import { rpc, TransactionBuilder, Transaction, Account } from '@stellar/stellar-sdk';
import { RpcError, TransactionError } from '../errors/index.js';
import type { NetworkConfig, TransactionResult } from '../types/index.js';

/**
 * RPC layer for Stellar/Soroban network communication.
 * Handles transaction simulation, submission, and polling.
 */
export class RpcLayer {
  public readonly server: rpc.Server;

  constructor(public readonly config: NetworkConfig) {
    this.server = new rpc.Server(this.config.rpcUrl);
  }

  /**
   * Simulates a transaction to prepare it for execution.
   * @param tx - Transaction to simulate
   * @returns Simulation response with transaction data
   * @throws TransactionError if simulation fails
   * @throws RpcError if RPC communication fails
   */
  async simulate(tx: Transaction): Promise<rpc.Api.SimulateTransactionResponse> {
    try {
      const simulation = await this.server.simulateTransaction(tx);

      if (rpc.Api.isSimulationError(simulation)) {
        throw new TransactionError(`Simulation failed: ${simulation.error}`);
      }

      return simulation;
    } catch (error: unknown) {
      if (error instanceof TransactionError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new RpcError(`RPC Simulate error: ${errorMessage}`);
    }
  }

  /**
   * Submits a signed transaction and polls for completion.
   * @param signedTxXdr - Signed transaction envelope XDR
   * @returns Transaction result with status and hash
   * @throws TransactionError if transaction execution fails
   * @throws RpcError if RPC communication fails
   */
  async submitAndPoll(signedTxXdr: string): Promise<TransactionResult> {
    try {
      const tx = TransactionBuilder.fromXDR(
        signedTxXdr,
        this.config.networkPassphrase
      ) as Transaction;

      const sendRes = await this.server.sendTransaction(tx);

      if (sendRes.status === 'ERROR') {
        throw new TransactionError(
          `Transaction send failed: ${JSON.stringify(sendRes.errorResultXdr)}`
        );
      }

      const txResponse = await this.server.pollTransaction(sendRes.hash);

      if (txResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
        return {
          status: 'SUCCESS',
          txHash: sendRes.hash,
          returnValue: txResponse.returnValue
            ? txResponse.returnValue.toXDR('base64')
            : undefined,
        };
      }

      return {
        status: 'FAILED',
        txHash: sendRes.hash,
        error: 'Transaction failed on-chain',
      };
    } catch (error: unknown) {
      if (error instanceof TransactionError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new RpcError(`RPC Submission error: ${errorMessage}`);
    }
  }
}
