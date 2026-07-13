/**
 * Abstract interface for wallet integrations.
 * Enables support for multiple wallet providers (Freighter, WalletConnect, Albedo, etc.).
 */
export interface WalletAdapter {
  /**
   * Initiates wallet connection and returns the connected public key.
   * @returns The connected account's public key
   * @throws WalletError if connection fails or is rejected
   */
  connect(): Promise<string>;

  /**
   * Disconnects from the wallet.
   * @throws WalletError if disconnection fails
   */
  disconnect(): Promise<void>;

  /**
   * Retrieves the currently connected address.
   * @returns The connected public key, or null if not connected
   */
  getAddress(): Promise<string | null>;

  /**
   * Signs a transaction with the connected wallet.
   * @param txXdr - Transaction envelope XDR string
   * @param networkPassphrase - Target network passphrase
   * @returns Signed transaction XDR
   * @throws WalletError if signing fails
   */
  signTransaction(txXdr: string, networkPassphrase: string): Promise<string>;

  /**
   * Signs an auth entry for contract invocation.
   * @param preimageXdr - Auth preimage XDR string
   * @returns Signed auth entry XDR
   * @throws WalletError if signing fails
   */
  signAuthEntry(preimageXdr: string): Promise<string>;
}
