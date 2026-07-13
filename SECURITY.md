# Security Policy

## Scope

This document covers the security policy for the `@fluxion/sdk` TypeScript implementation, including wallet integration, XDR parsing, and RPC communication layers.

## Supported Versions

Only the latest major version receives active security updates and patches.

| Version | Status           | Until   |
| ------- | ---------------- | ------- |
| 1.x     | Active Support   | TBD     |
| < 1.0   | Unsupported      | N/A     |

## Reporting a Vulnerability

To report security vulnerabilities (wallet spoofing, XDR manipulation, RPC redirection, etc.):

**Email**: security@fluxion.org

**Guidelines**:
- Do NOT open public GitHub issues for security exploits
- Include affected SDK version
- Provide reproduction steps if possible
- Allow reasonable time for a fix before public disclosure

We aim to acknowledge reports within 24 hours and issue fixes within 7 days for critical issues.

## Threat Model (SDK Level)

### 1. Malicious RPC Inputs

**Risk**: Compromised or hostile RPC endpoint returns oversized/malformed XDR data.

**Mitigation**:
- `scValToNative()` decoding is strictly typed via `xdr-parser`
- Unbounded Maps/Vectors are rejected to prevent memory exhaustion
- Type validation happens before any processing
- No dynamic evaluation or unsafe parsing

### 2. Wallet Signing Isolation

**Risk**: SDK requests private keys or crafts unauthorized transactions.

**Mitigation**:
- SDK **never** accepts private keys
- All signing delegated via SEP-0010/XDR payloads to isolated Freighter extension
- Wallet remains in control of transaction approval
- SDK builds unsigned transactions only; wallet approves before signing

### 3. Transaction Manipulation

**Risk**: Transaction data corrupted during XDR encoding/decoding.

**Mitigation**:
- Uses `@stellar/stellar-sdk` v13+ native `nativeToScVal`/`scValToNative`
- Transaction builder validates all inputs
- RPC simulation verified before signing
- Strict TypeScript types prevent type coercion attacks

### 4. Contract Address Injection

**Risk**: SDK initialized with malicious contract IDs, routing funds to attacker.

**Mitigation**:
- Contract IDs passed explicitly during client initialization
- No DNS lookups or dynamic resolution
- Caller responsibility to validate contract addresses
- Recommend obtaining contract IDs from official channels only

### 5. Dependencies

**Risk**: Compromised transitive dependencies.

**Mitigation**:
- Minimal peer dependencies (Stellar SDK, Freighter API)
- No production runtime dependencies
- All dev dependencies pinned to exact versions
- Regular `npm audit` checks

## Security Best Practices

### For SDK Users

1. **Validate Contract Addresses**: Always verify contract IDs from official sources
2. **Keep Freighter Updated**: Ensure wallet extension is latest version
3. **Use HTTPS Only**: Connect to verified RPC endpoints only
4. **Monitor Transactions**: Always review transaction details before signing
5. **Test on Testnet First**: Validate flows on TESTNET before mainnet

### For SDK Developers

1. **Strict Types**: No `any` types allowed; TypeScript strict mode enforced
2. **Error Isolation**: Catch and re-throw errors as typed `FluxionError` subclasses
3. **Input Validation**: Validate all XDR inputs before parsing
4. **Dependency Review**: Audit new dependencies before merging
5. **Code Review**: All PRs require security-focused review

## Known Limitations

1. **Browser-Only**: SDK assumes browser environment with Freighter; Node.js support limited
2. **No Key Management**: SDK does not manage wallets; integrates with Freighter only
3. **RPC Trust**: SDK trusts configured RPC endpoint; verify endpoint before use
4. **Network Passphrase**: Incorrect passphrase can lead to fund loss; verify carefully

## Security Release Process

1. Issue severity assessed (Critical/High/Medium/Low)
2. Fix prepared in private branch
3. Release prepared with security fixes
4. Announcement sent to community
5. Patch published to npm

## Compliance

- Developed with security-first mindset
- Follows OWASP guidelines for application security
- No hardcoded credentials or secrets
- Clean dependency chain

## Questions?

For security questions or clarifications: security@fluxion.org

---

Last Updated: July 2026
