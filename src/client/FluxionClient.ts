import type { FluxionConfig } from '../types/index.js';
import type { WalletAdapter } from '../wallet/WalletAdapter.js';
import { FreighterAdapter } from '../wallet/FreighterAdapter.js';
import { RpcLayer } from '../rpc/RpcLayer.js';
import { StreamsModule } from '../modules/streams.js';
import { VestingModule } from '../modules/vesting.js';
import { GovernanceModule } from '../modules/governance.js';
import { WalletError } from '../errors/index.js';

/**
 * Main Fluxion SDK client.
 * Provides access to streams, vesting, governance, and wallet operations.
 */
export class FluxionClient {
  public readonly config: FluxionConfig;
  public readonly rpc: RpcLayer;
  public readonly walletAdapter: WalletAdapter;
  public activeAddress: string | null = null;

  public readonly streams: StreamsModule;
  public readonly vesting: VestingModule;
  public readonly governance: GovernanceModule;

  constructor(config: FluxionConfig, walletAdapter?: WalletAdapter) {
    this.config = config;
    this.rpc = new RpcLayer(config);
    this.walletAdapter = walletAdapter ?? new FreighterAdapter();

    this.streams = new StreamsModule(this);
    this.vesting = new VestingModule(this);
    this.governance = new GovernanceModule(this);
  }

  /**
   * Connects to the wallet and sets active address.
   * @returns Connected account's public key
   * @throws WalletError if connection fails
   */
  async connect(): Promise<string> {
    this.activeAddress = await this.walletAdapter.connect();
    return this.activeAddress;
  }

  /**
   * Disconnects from the wallet.
   * @throws WalletError if disconnection fails
   */
  async disconnect(): Promise<void> {
    await this.walletAdapter.disconnect();
    this.activeAddress = null;
  }

  /**
   * Ensures wallet is connected and returns active address.
   * @returns Active wallet address
   * @throws WalletError if wallet not connected
   */
  requireConnection(): string {
    if (!this.activeAddress) {
      throw new WalletError('Wallet is not connected. Call client.connect() first.');
    }
    return this.activeAddress;
  }
}
