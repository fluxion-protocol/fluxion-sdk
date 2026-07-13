# Fluxion SDK

[![npm version](https://img.shields.io/npm/v/fluxion-sdk.svg)](https://www.npmjs.com/package/fluxion-sdk)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Type coverage](https://img.shields.io/badge/type%20coverage-100%25-brightgreen)]()

The canonical, production-ready TypeScript SDK for interacting with the **Fluxion Protocol** on Stellar/Soroban.

## Overview

Fluxion SDK abstracts the complexities of Soroban XDR generation, RPC simulation, and Freighter Wallet transaction signing into a simple, typed, modern developer interface. Built for continuous token streaming and automated vesting implementations.

## Features

- **Type-Safe**: 100% TypeScript with strict mode enabled
- **Zero Runtime Dependencies**: Peer dependencies only (Stellar SDK, Freighter API)
- **Tree-Shakeable**: Modern ESM + CJS dual output with proper tree-shaking
- **Comprehensive Error Handling**: Typed error hierarchy for every failure scenario
- **RPC Resilience**: Automatic transaction polling and simulation handling
- **Wallet Abstraction**: Easily swap wallet providers (Freighter default, extensible to WalletConnect, Albedo)

## Installation

```bash
npm install fluxion-sdk @stellar/stellar-sdk @stellar/freighter-api
```

### Peer Dependencies

- `@stellar/stellar-sdk` (^13.0.0)
- `@stellar/freighter-api` (^2.0.0)

## Quick Start

```typescript
import { FluxionClient, DEFAULT_CONFIG } from 'fluxion-sdk';

// Initialize client
const client = new FluxionClient({
  ...DEFAULT_CONFIG.TESTNET,
  fluxionCoreId: 'YOUR_CONTRACT_ID',
});

// Connect wallet
await client.connect();

// Create a payment stream
const result = await client.streams.createStream({
  recipient: 'GBDUMMY_RECIPIENT_ADDRESS',
  depositAmount: 500000000n, // 500 tokens (7 decimals)
  startTime: BigInt(Math.floor(Date.now() / 1000) + 3600), // In 1 hour
  stopTime: BigInt(Math.floor(Date.now() / 1000) + 2592000), // In 30 days
  tokenAddress: 'CBDUSDCABCD1234567890ABCDEF',
});

console.log(`Stream created: ${result.txHash}`);
```

## API Reference

### FluxionClient

Main SDK client with wallet and module management.

#### Methods

- `connect(): Promise<string>` - Connects wallet, returns public key
- `disconnect(): Promise<void>` - Disconnects wallet
- `requireConnection(): string` - Returns active address or throws WalletError

#### Modules

- `streams` - StreamsModule for token streaming
- `vesting` - VestingModule for token vesting schedules
- `governance` - GovernanceModule for protocol administration

### StreamsModule

```typescript
createStream(params: StreamParams): Promise<TransactionResult>
withdraw(streamId: bigint, amount: bigint): Promise<TransactionResult>
cancelStream(streamId: bigint): Promise<TransactionResult>
getStream(streamId: bigint): Promise<StreamData>
```

### VestingModule

```typescript
createVesting(schedule: Omit<VestingSchedule, 'releasedAmount' | 'revoked'>, tokenAddress: string): Promise<TransactionResult>
claimVested(vestingId: bigint): Promise<TransactionResult>
getVestingStatus(vestingId: bigint): Promise<VestingSchedule>
```

### GovernanceModule

```typescript
emergencyPause(): Promise<TransactionResult>
```

## Error Handling

All errors extend `FluxionError` with typed codes:

```typescript
import { FluxionError, WalletError, TransactionError, RpcError } from 'fluxion-sdk';

try {
  await client.connect();
} catch (error) {
  if (error instanceof WalletError) {
    console.error(`Wallet error: ${error.code}`);
  } else if (error instanceof TransactionError) {
    console.error(`Transaction failed: ${error.message}`);
  }
}
```

## Custom Wallet Adapter

Implement `WalletAdapter` to use alternative wallets:

```typescript
import type { WalletAdapter } from 'fluxion-sdk';

class CustomWalletAdapter implements WalletAdapter {
  async connect(): Promise<string> { /* ... */ }
  async disconnect(): Promise<void> { /* ... */ }
  async getAddress(): Promise<string | null> { /* ... */ }
  async signTransaction(txXdr: string, networkPassphrase: string): Promise<string> { /* ... */ }
  async signAuthEntry(preimageXdr: string): Promise<string> { /* ... */ }
}

const client = new FluxionClient(config, new CustomWalletAdapter());
```

## Development

### Scripts

```bash
npm run build       # Build distribution
npm run dev         # Watch mode development
npm run test        # Run tests
npm test:coverage   # Coverage report (95%+ required)
npm run lint        # Lint source
npm run lint:fix    # Auto-fix linting issues
npm run format      # Format with Prettier
npm run type-check  # TypeScript type checking
npm run docs        # Generate TypeDoc documentation
```

### Testing

Tests use Vitest with 95% coverage requirements:

```bash
npm test            # Run once
npm test -- --watch # Watch mode
npm test:coverage   # Coverage report
```

## Security

Security policy: [SECURITY.md](./SECURITY.md)

### Known Threat Model

1. **Malicious RPC Inputs**: XDR responses strictly validated via `scValToNative`
2. **Wallet Signing**: SDK never requests private keys; all signing via Freighter extension
3. **Transaction Isolation**: Unsigned transactions passed to wallet for signing only

## Browser Support

- Modern browsers with ES2020+ support
- Node.js 18+

## License

Apache 2.0

## Contributing

Contributions follow standard Git workflow:

1. Fork repository
2. Create feature branch (`git checkout -b feat/feature-name`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push branch (`git push origin feat/feature-name`)
5. Open Pull Request

All PRs require:
- ✅ Tests passing (90%+ coverage)
- ✅ Linting passes
- ✅ TypeScript strict mode passes
- ✅ No `any` types

## Support

- [GitHub Issues](https://github.com/fluxion-protocol/fluxion-sdk/issues)
- [Documentation](./docs/)
- [Architecture Design](./docs/ARCHITECTURE.md)

---

Built with precision for developers by the Fluxion Protocol Foundation.
