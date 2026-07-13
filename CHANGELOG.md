# Changelog

All notable changes to the Fluxion SDK are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-13

### Added

- **Core Client**: Main `FluxionClient` for SDK initialization and state management
- **Streams Module**: Full token streaming functionality
  - `createStream()` - Create continuous payment streams
  - `withdraw()` - Withdraw vested tokens from streams
  - `cancelStream()` - Cancel active streams
  - `getStream()` - Query stream state and data
- **Vesting Module**: Token vesting schedule management
  - `createVesting()` - Create cliff and linear vesting schedules
  - `claimVested()` - Claim vested tokens
  - `getVestingStatus()` - Query vesting schedule status
- **Governance Module**: Protocol administration
  - `emergencyPause()` - Emergency pause functionality
- **Wallet Integration**
  - `WalletAdapter` interface for wallet provider abstraction
  - `FreighterAdapter` implementation for browser wallet support
- **RPC Layer**: Stellar Soroban network communication
  - Transaction simulation
  - Transaction submission and polling
  - Error handling and retry logic
- **XDR Parser**: Type-safe XDR encoding/decoding
  - `encodeParam()` - Native to XDR encoding
  - `decodeResponse()` - XDR to native decoding
- **Error Hierarchy**: Typed error classes
  - `FluxionError` - Base error class
  - `WalletError` - Wallet-related errors
  - `RpcError` - RPC communication errors
  - `TransactionError` - Transaction execution errors
  - `ParsingError` - XDR parsing errors
  - `ContractError` - Contract interaction errors
- **Type Definitions**
  - `NetworkConfig` - Network configuration
  - `FluxionConfig` - SDK configuration
  - `StreamParams` - Stream creation parameters
  - `StreamData` - Stream state data
  - `VestingSchedule` - Vesting schedule definition
  - `TransactionResult` - Transaction execution result
- **Testing**
  - 95%+ code coverage (statements, functions, lines)
  - 90%+ branch coverage
  - Comprehensive unit test suite
- **Documentation**
  - Complete API reference in README.md
  - Architecture documentation (ARCHITECTURE.md)
  - Security policy (SECURITY.md)
  - Contributing guidelines (CONTRIBUTING.md)
  - Usage examples (examples/)
- **Build & Deployment**
  - TypeScript strict mode
  - ESM + CJS dual output
  - Tree-shaking enabled
  - Source maps for debugging
  - GitHub Actions CI/CD pipeline
  - npm auto-publish on release
- **Development Tools**
  - ESLint configuration with strict rules
  - Prettier code formatting
  - EditorConfig support
  - Git hooks configuration ready

### Standards Compliance

- 100% TypeScript strict mode
- Zero `any` types policy
- Comprehensive error handling
- Browser and Node.js 18+ support
- Apache 2.0 license
- SEP-0010 compatible signing

---

## Version Management

This is version 1.0.0, the initial production release of Fluxion SDK.

For bug reports and feature requests, visit: https://github.com/fluxion-protocol/fluxion-sdk/issues

For security vulnerabilities, email: security@fluxion.org
