# Fluxion SDK Documentation Index

Complete reference for the Fluxion SDK.

## Getting Started

- **[Quick Start Guide](../QUICKSTART.md)** - Get running in 5 minutes
- **[README](../README.md)** - Overview, installation, API reference
- **[Examples](../examples/)** - Complete working examples

## Core Documentation

### API Reference

- **[StreamsModule](../docs/ARCHITECTURE.md#2-feature-modules)** - Token streaming API
  - `createStream()` - Create payment streams
  - `withdraw()` - Withdraw from streams
  - `cancelStream()` - Cancel streams
  - `getStream()` - Query stream state

- **[VestingModule](../docs/ARCHITECTURE.md#2-feature-modules)** - Vesting API
  - `createVesting()` - Create vesting schedules
  - `claimVested()` - Claim vested tokens
  - `getVestingStatus()` - Query vesting status

- **[GovernanceModule](../docs/ARCHITECTURE.md#2-feature-modules)** - Governance API
  - `emergencyPause()` - Emergency protocol pause

### Architecture

- **[Architecture Guide](./ARCHITECTURE.md)** - System design and data flow
  - Layered architecture
  - Module design patterns
  - Data flow diagrams
  - Scalability considerations
  - Error handling strategy
  - Testing approach

### Development

- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute
  - Development setup
  - Code standards (strict requirements)
  - Testing requirements (95%+ coverage)
  - Documentation guidelines
  - Git workflow
  - PR checklist

- **[Security Policy](../SECURITY.md)** - Security considerations
  - Threat model
  - Known limitations
  - Best practices
  - Vulnerability reporting
  - Compliance info

## Type Reference

### Core Types

```typescript
// Configuration
interface FluxionConfig extends NetworkConfig {
  fluxionCoreId: string;
  governanceId?: string;
}

interface NetworkConfig {
  networkPassphrase: string;
  rpcUrl: string;
}

// Stream Types
interface StreamParams {
  recipient: string;
  depositAmount: bigint;
  startTime: bigint;
  stopTime: bigint;
  tokenAddress: string;
}

interface StreamData {
  sender: string;
  recipient: string;
  depositAmount: bigint;
  startTime: bigint;
  stopTime: bigint;
  ratePerSecond: bigint;
  tokenAddress: string;
  withdrawnAmount: bigint;
  isCanceled: boolean;
}

// Vesting Types
interface VestingSchedule {
  beneficiary: string;
  totalAmount: bigint;
  cliffAmount: bigint;
  cliffTime: bigint;
  endDuration: bigint;
  releasedAmount: bigint;
  revocable: boolean;
  revoked: boolean;
}

// Transaction Result
interface TransactionResult {
  status: 'SUCCESS' | 'FAILED';
  txHash: string;
  returnValue?: unknown;
  error?: string;
}
```

## Error Reference

### Error Hierarchy

```typescript
FluxionError (base)
  ├── WalletError
  ├── RpcError
  ├── TransactionError
  ├── ParsingError
  └── ContractError
```

### Error Properties

All errors include:
- `message` - Error description
- `code` - Error code for programmatic handling
- `timestamp` - Unix timestamp of error

### Common Error Codes

- `WALLET_CONNECTION_FAILED` - Wallet connection issue
- `RPC_REQUEST_FAILED` - RPC communication error
- `TRANSACTION_EXECUTION_FAILED` - Transaction failed
- `XDR_PARSING_FAILED` - XDR encoding/decoding error
- `CONTRACT_CALL_FAILED` - Contract interaction error

## Configuration Reference

### Default Networks

```typescript
import { DEFAULT_CONFIG } from '@fluxion/sdk';

// Testnet
DEFAULT_CONFIG.TESTNET
// {
//   networkPassphrase: Networks.TESTNET_NETWORK_PASSPHRASE,
//   rpcUrl: 'https://soroban-testnet.stellar.org'
// }

// Mainnet
DEFAULT_CONFIG.MAINNET
// {
//   networkPassphrase: Networks.PUBLIC_NETWORK_PASSPHRASE,
//   rpcUrl: 'https://soroban-mainnet.stellar.org'
// }
```

### Fee Constants

```typescript
import { DEFAULT_FEE, DEFAULT_SIMULATION_FEE, EMERGENCY_PAUSE_FEE } from '@fluxion/sdk';

DEFAULT_FEE              // '1000'
DEFAULT_SIMULATION_FEE   // '100'
EMERGENCY_PAUSE_FEE      // '1500'
```

## Examples

### Complete Stream Example

See [examples/create-stream.ts](../examples/create-stream.ts)

```typescript
// 1. Initialize
// 2. Connect wallet
// 3. Create stream
// 4. Query stream
// 5. Withdraw
// 6. Cancel
```

### Complete Vesting Example

See [examples/create-vesting.ts](../examples/create-vesting.ts)

```typescript
// 1. Initialize
// 2. Connect wallet
// 3. Create vesting
// 4. Query status
// 5. Claim tokens
```

## Version History

See [CHANGELOG.md](../CHANGELOG.md) for all version information.

## Project Status

- **Version**: 1.0.0
- **Status**: Production Ready ✅
- **Test Coverage**: 95%+ ✅
- **TypeScript**: Strict Mode ✅
- **Browser Support**: Modern Browsers + Node 18+ ✅

## Quick Links

| Resource | Link |
| -------- | ---- |
| GitHub | https://github.com/fluxion-protocol/fluxion-sdk |
| npm Package | https://www.npmjs.com/package/@fluxion/sdk |
| Issues | https://github.com/fluxion-protocol/fluxion-sdk/issues |
| Security | security@fluxion.org |

## Development Scripts

```bash
npm run build          # Build distribution
npm run dev            # Watch mode
npm test              # Run tests
npm test:coverage     # Coverage report
npm run lint          # Lint code
npm run lint:fix      # Auto-fix linting
npm run format        # Format code
npm run type-check    # Type checking
npm run docs          # Generate TypeDoc
```

## Need Help?

1. **Quick questions**: Check [QUICKSTART.md](../QUICKSTART.md)
2. **API reference**: Check [README.md](../README.md)
3. **Design questions**: Check [ARCHITECTURE.md](./ARCHITECTURE.md)
4. **Contributing**: Check [CONTRIBUTING.md](../CONTRIBUTING.md)
5. **Security**: Email security@fluxion.org
6. **Issues**: Open GitHub Issue

---

**Last Updated**: July 2026  
**Status**: Production Ready
