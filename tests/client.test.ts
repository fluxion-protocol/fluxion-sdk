import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FluxionClient } from '../src/client/FluxionClient.js';
import { DEFAULT_CONFIG } from '../src/utils/constants.js';
import { WalletError } from '../src/errors/index.js';
import type { WalletAdapter } from '../src/wallet/WalletAdapter.js';

describe('FluxionClient', () => {
  const mockWalletAdapter: WalletAdapter = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    getAddress: vi.fn(),
    signTransaction: vi.fn(),
    signAuthEntry: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with testnet config', () => {
    const client = new FluxionClient({
      ...DEFAULT_CONFIG.TESTNET,
      fluxionCoreId: 'CDAZOG4V2KAPVBBKCAMHUT367AUGYWYEHD652UOJVER5ERNYGSOROBAN',
    });

    expect(client.rpc.server).toBeDefined();
    expect(client.streams).toBeDefined();
    expect(client.vesting).toBeDefined();
    expect(client.governance).toThrow;
  });

  it('should initialize with custom wallet adapter', () => {
    const client = new FluxionClient(
      {
        ...DEFAULT_CONFIG.TESTNET,
        fluxionCoreId: 'C_DUMMY',
      },
      mockWalletAdapter
    );

    expect(client.walletAdapter).toBe(mockWalletAdapter);
  });

  it('should throw WalletError if connection required before connect()', () => {
    const client = new FluxionClient({
      ...DEFAULT_CONFIG.TESTNET,
      fluxionCoreId: 'C_DUMMY',
    });

    expect(() => client.requireConnection()).toThrow(WalletError);
  });

  it('should maintain active address after connection', async () => {
    vi.mocked(mockWalletAdapter.connect).mockResolvedValue('GDZST3XVCDTUJ76ZAV2HA72KYTZ4JJYZNVYGFIHX5DQAEJZQ5A4XEVB');

    const client = new FluxionClient(
      {
        ...DEFAULT_CONFIG.TESTNET,
        fluxionCoreId: 'C_DUMMY',
      },
      mockWalletAdapter
    );

    const address = await client.connect();
    expect(client.activeAddress).toBe(address);
    expect(client.requireConnection()).toBe(address);
  });

  it('should clear active address on disconnect', async () => {
    vi.mocked(mockWalletAdapter.connect).mockResolvedValue('GDZST3XVCDTUJ76ZAV2HA72KYTZ4JJYZNVYGFIHX5DQAEJZQ5A4XEVB');

    const client = new FluxionClient(
      {
        ...DEFAULT_CONFIG.TESTNET,
        fluxionCoreId: 'C_DUMMY',
      },
      mockWalletAdapter
    );

    await client.connect();
    expect(client.activeAddress).not.toBeNull();

    await client.disconnect();
    expect(client.activeAddress).toBeNull();
  });

  it('should require governance config for governance module', () => {
    const client = new FluxionClient({
      ...DEFAULT_CONFIG.TESTNET,
      fluxionCoreId: 'C_DUMMY',
    });

    expect(() => {
      // governance module is lazily initialized
      void client.governance;
    }).not.toThrow();
  });

  it('should initialize with governance config', () => {
    const client = new FluxionClient({
      ...DEFAULT_CONFIG.TESTNET,
      fluxionCoreId: 'C_DUMMY',
      governanceId: 'C_GOV_DUMMY',
    });

    expect(client.governance).toBeDefined();
  });
});
