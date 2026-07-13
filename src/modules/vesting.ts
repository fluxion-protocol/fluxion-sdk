import { Contract, TransactionBuilder, Account } from '@stellar/stellar-sdk';
import type { FluxionClient } from '../client/FluxionClient.js';
import type { VestingSchedule, TransactionResult } from '../types/index.js';
import { encodeParam, decodeResponse } from '../xdr/xdr-parser.js';
import { TIMEOUT_SECONDS, DEFAULT_FEE, DEFAULT_SIMULATION_FEE } from '../utils/constants.js';
import { TransactionError } from '../errors/index.js';

/**
 * Vesting module for managing token vesting schedules on Fluxion.
 */
export class VestingModule {
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
   * Creates a new vesting schedule.
   * @param schedule - Vesting schedule configuration
   * @param tokenAddress - Token contract address
   * @returns Transaction result
   * @throws Error if vesting creation fails
   */
  async createVesting(
    schedule: Omit<VestingSchedule, 'releasedAmount' | 'revoked'>,
    tokenAddress: string
  ): Promise<TransactionResult> {
    const args = [
      encodeParam(this.client.activeAddress, 'address'),
      encodeParam(schedule.beneficiary, 'address'),
      encodeParam(schedule.totalAmount, 'i128'),
      encodeParam(schedule.cliffTime, 'u64'),
      encodeParam(schedule.endDuration, 'u64'),
      encodeParam(schedule.revocable, 'bool'),
      encodeParam(tokenAddress, 'address'),
    ];
    return this.buildAndSign('create_vesting', args);
  }

  /**
   * Claims vested tokens.
   * @param vestingId - Vesting schedule identifier
   * @returns Transaction result
   * @throws Error if claim fails
   */
  async claimVested(vestingId: bigint): Promise<TransactionResult> {
    const args = [
      encodeParam(vestingId, 'u64'),
      encodeParam(this.client.activeAddress, 'address'),
    ];
    return this.buildAndSign('claim_vesting', args);
  }

  /**
   * Retrieves vesting schedule status from contract state.
   * @param vestingId - Vesting schedule identifier
   * @returns Vesting schedule details
   * @throws TransactionError if vesting fetch fails
   */
  async getVestingStatus(vestingId: bigint): Promise<VestingSchedule> {
    const args = [encodeParam(vestingId, 'u64')];
    const sourceAccount = new Account(this.client.config.fluxionCoreId, '0');

    const tx = new TransactionBuilder(sourceAccount, {
      fee: DEFAULT_SIMULATION_FEE,
      networkPassphrase: this.client.config.networkPassphrase,
    })
      .addOperation(this.contract.call('get_vesting', ...args))
      .setTimeout(TIMEOUT_SECONDS)
      .build();

    const simulation = await this.client.rpc.simulate(tx);

    if (!simulation.result?.retval) {
      throw new TransactionError('Failed to fetch vesting data.');
    }

    const rawData = decodeResponse<Record<string, unknown>>(simulation.result.retval);

    return {
      beneficiary: String(rawData.beneficiary),
      totalAmount: BigInt(String(rawData.totalAmount)),
      cliffAmount: BigInt(String(rawData.cliffAmount)),
      cliffTime: BigInt(String(rawData.cliffTime)),
      endDuration: BigInt(String(rawData.endDuration)),
      releasedAmount: BigInt(String(rawData.releasedAmount)),
      revocable: Boolean(rawData.revocable),
      revoked: Boolean(rawData.revoked),
    };
  }
}
