# Quick Start Guide

Get the Fluxion SDK running in minutes.

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org))
- npm 9+ (comes with Node.js)
- A browser with Freighter wallet installed ([get Freighter](https://www.freighter.app))

## Installation

### Step 1: Install Dependencies

```bash
npm install fluxion-sdk @stellar/stellar-sdk @stellar/freighter-api
```

### Step 2: Import and Initialize

```typescript
import { FluxionClient, DEFAULT_CONFIG } from '@fluxion/sdk';

const client = new FluxionClient({
  ...DEFAULT_CONFIG.TESTNET,
  fluxionCoreId: 'YOUR_CONTRACT_ADDRESS',
});
```

## Basic Operations

### Connect Wallet

```typescript
try {
  const address = await client.connect();
  console.log(`Connected: ${address}`);
} catch (error) {
  console.error('Connection failed:', error);
}
```

### Create a Stream

```typescript
const result = await client.streams.createStream({
  recipient: 'GBDUMMY_RECIPIENT_ADDRESS',
  depositAmount: 1000000000n, // 1 billion stroops
  startTime: BigInt(Math.floor(Date.now() / 1000)),
  stopTime: BigInt(Math.floor(Date.now() / 1000) + 86400), // 24 hours later
  tokenAddress: 'CBTOKEN_ADDRESS',
});

console.log(`Stream created: ${result.txHash}`);
```

### Create a Vesting Schedule

```typescript
const result = await client.vesting.createVesting(
  {
    beneficiary: 'GBBENEFICIARY_ADDRESS',
    totalAmount: 1000000000n,
    cliffAmount: 100000000n,
    cliffTime: BigInt(Math.floor(Date.now() / 1000) + 7776000), // 90 days
    endDuration: BigInt(31536000), // 1 year
    revocable: true,
  },
  'CBTOKEN_ADDRESS'
);

console.log(`Vesting created: ${result.txHash}`);
```

### Query Stream Status

```typescript
const stream = await client.streams.getStream(1n);
console.log({
  sender: stream.sender,
  recipient: stream.recipient,
  withdrawnAmount: stream.withdrawnAmount.toString(),
  isCanceled: stream.isCanceled,
});
```

### Withdraw from Stream

```typescript
const result = await client.streams.withdraw(1n, 100000000n);
console.log(`Withdrawal: ${result.txHash}`);
```

### Claim Vested Tokens

```typescript
const result = await client.vesting.claimVested(1n);
console.log(`Claim: ${result.txHash}`);
```

## Error Handling

```typescript
import {
  FluxionError,
  WalletError,
  TransactionError,
  RpcError,
} from '@fluxion/sdk';

try {
  await client.streams.createStream(params);
} catch (error) {
  if (error instanceof WalletError) {
    console.error('Wallet issue:', error.message);
  } else if (error instanceof TransactionError) {
    console.error('Transaction failed:', error.message);
  } else if (error instanceof RpcError) {
    console.error('Network issue:', error.message);
  }
}
```

## Development

### Run Tests

```bash
npm test
```

### Type Check

```bash
npm run type-check
```

### Lint Code

```bash
npm run lint
npm run lint:fix
```

### Format Code

```bash
npm run format
```

### Build

```bash
npm run build
```

## Configuration

### Testnet (Default)

```typescript
import { FluxionClient, DEFAULT_CONFIG } from '@fluxion/sdk';

const client = new FluxionClient({
  ...DEFAULT_CONFIG.TESTNET,
  fluxionCoreId: 'YOUR_TESTNET_CONTRACT',
});
```

### Mainnet

```typescript
const client = new FluxionClient({
  ...DEFAULT_CONFIG.MAINNET,
  fluxionCoreId: 'YOUR_MAINNET_CONTRACT',
});
```

### Custom Network

```typescript
const client = new FluxionClient({
  networkPassphrase: 'Custom Network Passphrase',
  rpcUrl: 'https://your-rpc-endpoint.com',
  fluxionCoreId: 'YOUR_CONTRACT_ID',
});
```

## Examples

See the `examples/` directory for complete working examples:

- `examples/create-stream.ts` - Full stream creation flow
- `examples/create-vesting.ts` - Full vesting schedule flow

## Next Steps

1. **Read the docs**: [README.md](./README.md)
2. **Understand architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
3. **Review security**: [SECURITY.md](./SECURITY.md)
4. **Check examples**: `examples/` directory

## Common Issues

### "Freighter is not installed"

Install Freighter extension from [freighter.app](https://www.freighter.app)

### "Wallet is not connected"

Call `client.connect()` before accessing wallet-dependent methods.

### "Simulation failed"

Ensure:
- Contract ID is correct
- Network passphrase matches contract deployment
- RPC endpoint is accessible

### "Transaction failed on-chain"

Check:
- Account has sufficient balance
- All parameters are valid
- Contract state allows operation

## Support

- **Docs**: [README.md](./README.md)
- **Issues**: GitHub Issues
- **Security**: security@fluxion.org

---

Ready to stream? Start building! 🚀
