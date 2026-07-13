import { Contract, TransactionBuilder, Account } from '@stellar/stellar-sdk';
import type { FluxionClient } from '../client/FluxionClient.js';
import type { TransactionResult } from '../types/index.js';
import { encodeParam } from '../xdr/xdr-parser.js';
import { TIMEOUT_SECONDS, EMERGENCY_PAUSE_FEE } from '../utils/constants.js';

/**
 * Governance module for protocol administration and emergency controls.
 */
export class GovernanceModule {
  private readonly contract: Contract;

  constructor(private readonly client: FluxionClient) {
    if (!this.client.config.governanceId) {
      throw new Error('Governance module requires a governanceId in config.');
    }
    this.contract = new Contract(this.client.config.governanceId);
  }

  /**
   * Triggers emergency pause of the Fluxion protocol.
   * Requires governance role authorization.
   * @returns Transaction result
   * @throws Error if emergency pause fails
   */
  async emergencyPause(): Promise<TransactionResult> {
    const sender = this.client.requireConnection();
    const sourceAccount = await this.client.rpc.server.getAccount(sender);

    const tx = new TransactionBuilder(
      new Account(sourceAccount.accountId(), sourceAccount.sequenceNumber()),
      {
        fee: EMERGENCY_PAUSE_FEE,
        networkPassphrase: this.client.config.networkPassphrase,
      }
    )
      .addOperation(this.contract.call('emergency_pause', encodeParam(sender, 'address')))
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
}
