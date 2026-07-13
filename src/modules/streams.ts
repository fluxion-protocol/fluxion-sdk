import { Contract, TransactionBuilder, Account } from '@stellar/stellar-sdk';
import type { FluxionClient } from '../client/FluxionClient.js';
import type { StreamParams, StreamData, TransactionResult } from '../types/index.js';
import { encodeParam, decodeResponse } from '../xdr/xdr-parser.js';
import { TIMEOUT_SECONDS, DEFAULT_FEE, DEFAULT_SIMULATION_FEE } from '../utils/constants.js';
import { TransactionError } from '../errors/index.js';

/**
 * Streams module for managing continuous token streams on Fluxion.
 */
export class StreamsModule {
  private readonly contract: Contract;

  constructor(private readonly client: FluxionClient) {
    this.contract = new Contract(this.client.config.fluxionCoreId);
  }

  /**
   * Builds, simulates, and signs a contract method call.
   * @param method - Contract method name
   * @param args - Encoded XDR arguments
   * @returns Transaction result
   * @throws Error if transaction execution fails
   */
  private async buildAndSign(method: string, args: unknown[]): Promise<TransactionResult> {
    const sender = this.client.requireConnection();
    const sourceAccount = await this.client.rpc.server.getAccount(sender);

    const tx = new TransactionBuilder(
      new Account(sourceAccount.accountId(), sourceAccount.sequenceNumber()),
      {
        fee: DEFAULT_FEE,
        networkPassphrase: this.client.config.networkPassphrase,
      }
    )
      .addOperation(this.contract.call(method, ...args))
      .setTimeout(TIMEOUT_SECONDS)
      .build();

    const simulation = await this.client.rpc.simulate(tx);
    const assembledTx = TransactionBuilder.fromXDR(
      simulation.transactionData.build().toXDR(),
      this.client.config.networkPassphrase
    );

    const signedXdr = await this.client.walletAdapter.signTransaction(
      assembledTx.toXDR(),
      this.client.config.networkPassphrase
    );
    return this.client.rpc.submitAndPoll(signedXdr);
  }

  /**
   * Creates a new payment stream.
   * @param params - Stream parameters (recipient, amount, timing, token)
   * @returns Transaction result
   * @throws Error if stream creation fails
   */
  async createStream(params: StreamParams): Promise<TransactionResult> {
    const args = [
      encodeParam(this.client.activeAddress, 'address'),
      encodeParam(params.recipient, 'address'),
      encodeParam(params.depositAmount, 'i128'),
      encodeParam(params.startTime, 'u64'),
      encodeParam(params.stopTime, 'u64'),
      encodeParam(params.tokenAddress, 'address'),
    ];
    return this.buildAndSign('create_stream', args);
  }

  /**
   * Withdraws funds from an active stream.
   * @param streamId - Stream identifier
   * @param amount - Amount to withdraw
   * @returns Transaction result
   * @throws Error if withdrawal fails
   */
  async withdraw(streamId: bigint, amount: bigint): Promise<TransactionResult> {
    const args = [
      encodeParam(streamId, 'u64'),
      encodeParam(this.client.activeAddress, 'address'),
      encodeParam(amount, 'i128'),
    ];
    return this.buildAndSign('withdraw_stream', args);
  }

  /**
   * Cancels an active stream.
   * @param streamId - Stream identifier
   * @returns Transaction result
   * @throws Error if cancellation fails
   */
  async cancelStream(streamId: bigint): Promise<TransactionResult> {
    const args = [
      encodeParam(streamId, 'u64'),
      encodeParam(this.client.activeAddress, 'address'),
    ];
    return this.buildAndSign('cancel_stream', args);
  }

  /**
   * Retrieves stream data from the contract state.
   * @param streamId - Stream identifier
   * @returns Stream data including rates and status
   * @throws TransactionError if stream fetch fails
   */
  async getStream(streamId: bigint): Promise<StreamData> {
    const args = [encodeParam(streamId, 'u64')];
    const sourceAccount = new Account(this.client.config.fluxionCoreId, '0');

    const tx = new TransactionBuilder(sourceAccount, {
      fee: DEFAULT_SIMULATION_FEE,
      networkPassphrase: this.client.config.networkPassphrase,
    })
      .addOperation(this.contract.call('get_stream', ...args))
      .setTimeout(TIMEOUT_SECONDS)
      .build();

    const simulation = await this.client.rpc.simulate(tx);

    if (!simulation.result?.retval) {
      throw new TransactionError('Failed to fetch stream data from state.');
    }

    const rawData = decodeResponse<Record<string, unknown>>(simulation.result.retval);

    return {
      sender: String(rawData.sender),
      recipient: String(rawData.recipient),
      depositAmount: BigInt(String(rawData.depositAmount)),
      startTime: BigInt(String(rawData.startTime)),
      stopTime: BigInt(String(rawData.stopTime)),
      ratePerSecond: BigInt(String(rawData.ratePerSecond)),
      tokenAddress: String(rawData.tokenAddress),
      withdrawnAmount: BigInt(String(rawData.withdrawnAmount)),
      isCanceled: Boolean(rawData.isCanceled),
    };
  }
}
