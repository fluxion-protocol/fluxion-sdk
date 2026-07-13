import freighterApi from '@stellar/freighter-api';
import type { WalletAdapter } from './WalletAdapter.js';
import { WalletError } from '../errors/index.js';

/**
 * Freighter wallet adapter for browser-based Stellar transactions.
 * Implements the WalletAdapter interface for seamless wallet integration.
 */
export class FreighterAdapter implements WalletAdapter {
  /**
   * Connects to Freighter wallet and requests authorization.
   * @returns The connected account's public key
   * @throws WalletError if Freighter is unavailable or connection is rejected
   */
  async connect(): Promise<string> {
    const isInstalled = await freighterApi.isConnected();
    if (!isInstalled) {
      throw new WalletError(
        'Freighter is not installed or available. Please install Freighter extension.'
      );
    }

    const access = await freighterApi.requestAccess();
    if (access.error) {
      throw new WalletError(`Connection rejected: ${access.error}`);
    }

    const pk = await this.getAddress();
    if (!pk) {
      throw new WalletError('No public key returned after authorization.');
    }

    return pk;
  }

  /**
   * Disconnects from Freighter (no-op for browser extension).
   */
  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Retrieves the currently connected Freighter address.
   * @returns Public key or null if not connected
   */
  async getAddress(): Promise<string | null> {
    try {
      const auth = await freighterApi.getAddress();
      return auth.address ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Signs a transaction with Freighter.
   * @param txXdr - Transaction envelope XDR
   * @param networkPassphrase - Target network passphrase
   * @returns Signed transaction XDR
   * @throws WalletError if signing fails
   */
  async signTransaction(txXdr: string, networkPassphrase: string): Promise<string> {
    try {
      const response = await freighterApi.signTransaction(txXdr, { networkPassphrase });
      if (response.error) {
        throw new WalletError(response.error);
      }
      return response.signedTxXdr;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new WalletError(`Failed to sign transaction: ${errorMessage}`);
    }
  }

  /**
   * Signs an auth entry with Freighter for contract invocation.
   * @param preimageXdr - Auth preimage XDR
   * @returns Signed auth entry XDR
   * @throws WalletError if signing fails
   */
  async signAuthEntry(preimageXdr: string): Promise<string> {
    try {
      const response = await freighterApi.signAuthEntry(preimageXdr);
      if (response.error) {
        throw new WalletError(response.error);
      }
      return response.signedAuthEntry;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new WalletError(`Failed to sign auth entry: ${errorMessage}`);
    }
  }
}
