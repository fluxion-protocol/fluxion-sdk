# Contributing to Fluxion SDK

Thank you for your interest in contributing to the Fluxion SDK. This document outlines our development process, code standards, and contribution guidelines.

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/fluxion-protocol/fluxion-sdk.git
cd fluxion-sdk

# Install dependencies
npm install

# Start development watch mode
npm run dev
```

## Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feat/feature-name
# or for bugfixes:
git checkout -b fix/bug-name
```

### 2. Make Changes

- Write your code following the standards below
- Commit frequently with clear messages
- Reference issues when relevant: `fix #123`

### 3. Test & Lint

```bash
npm test              # Run tests
npm run lint          # Check linting
npm run format        # Auto-format
npm run type-check    # TypeScript validation
npm test:coverage     # Coverage report
```

### 4. Submit Pull Request

Push your branch and open a PR with:
- Clear title and description
- Reference to related issues
- Summary of changes
- Test coverage details

## Code Standards

### Strict Requirements

1. **Zero `any` Types**: Absolute prohibition on `any` type usage
   ```typescript
   // ❌ Bad
   function process(data: any): void { }

   // ✅ Good
   function process(data: Record<string, unknown>): void { }
   ```

2. **100% TypeScript Strict Mode**: Must pass `tsc --noEmit`
   ```typescript
   // ❌ Bad
   function getValue() {
     return data?.value;  // Implicit any
   }

   // ✅ Good
   function getValue(data: Record<string, unknown>): unknown {
     return data?.value;
   }
   ```

3. **No Console Logs in Production Code**:
   ```typescript
   // ❌ Bad
   console.log('Debug:', data);

   // ✅ Good - use custom logger or remove
   // Consider throwing error instead
   ```

4. **Explicit Return Types**:
   ```typescript
   // ❌ Bad
   export function getValue(key: string) {
     return cache.get(key);
   }

   // ✅ Good
   export function getValue(key: string): unknown {
     return cache.get(key);
   }
   ```

5. **Error Handling**:
   ```typescript
   // ❌ Bad
   async function fetch() {
     return data;  // Unhandled promise rejection potential
   }

   // ✅ Good
   async function fetch(): Promise<Data> {
     try {
       return await api.call();
     } catch (error: unknown) {
       throw new RpcError(`Failed to fetch: ${error}`);
     }
   }
   ```

### Code Style

- Use **2-space indentation**
- Use **single quotes** for strings
- Use **trailing commas** in multi-line objects/arrays
- Maximum line length: **100 characters**
- Use **arrow functions** for callbacks

```typescript
// ✅ Good style
export interface UserConfig {
  name: string;
  age: number;
  tags: string[];
}

export function createUser(config: UserConfig): User {
  const user: User = {
    ...config,
    createdAt: new Date(),
  };
  return user;
}
```

### Naming Conventions

- `PascalCase` for Classes, Interfaces, Types
- `camelCase` for functions, variables, properties
- `UPPER_SNAKE_CASE` for constants
- Prefix private methods with `_` (optional; use `private` keyword)

```typescript
// ✅ Good
export interface StreamParams {
  recipient: string;
  amount: bigint;
}

export class StreamsModule {
  private readonly contract: Contract;

  private async buildAndSign(method: string, args: unknown[]): Promise<void> {
    // ...
  }
}

export const DEFAULT_TIMEOUT = 30;
```

## Testing Requirements

### Coverage Thresholds

All PRs must meet these coverage minimums:

- **Statements**: 95%
- **Branches**: 90%
- **Functions**: 95%
- **Lines**: 95%

### Writing Tests

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Module', () => {
  it('should perform expected behavior', () => {
    const result = functionUnderTest();
    expect(result).toBe(expectedValue);
  });

  it('should handle error cases', () => {
    expect(() => functionUnderTest(invalidInput)).toThrow(CustomError);
  });
});
```

### Running Tests

```bash
npm test              # Single run
npm test -- --watch   # Watch mode
npm test:coverage     # Coverage report
```

## Documentation

### JSDoc Comments

Document all public APIs:

```typescript
/**
 * Creates a payment stream.
 *
 * @param params - Stream configuration
 * @returns Transaction result with hash and status
 * @throws TransactionError if stream creation fails
 * @example
 * ```typescript
 * const result = await client.streams.createStream({
 *   recipient: 'GBXXX...',
 *   depositAmount: 1000000000n,
 *   startTime: BigInt(Math.floor(Date.now() / 1000)),
 *   stopTime: BigInt(Math.floor(Date.now() / 1000) + 86400),
 *   tokenAddress: 'CCYYY...',
 * });
 * ```
 */
export async function createStream(params: StreamParams): Promise<TransactionResult> {
  // ...
}
```

### README & ARCHITECTURE

- Update README.md if adding new APIs
- Update docs/ARCHITECTURE.md if changing system design
- Include examples for new features

## Git Commit Messages

- Use clear, descriptive messages
- Start with verb: Add, Fix, Update, Refactor, Docs, etc.
- Reference issues: `fix #123`

```
Good commits:
- Add error handling for RPC timeouts
- Fix wallet connection race condition (fixes #456)
- Refactor XDR parser for clarity
- Update README with new API examples
```

## Pull Request Checklist

Before submitting, ensure:

- [ ] Code passes `npm lint`
- [ ] Code passes `npm test`
- [ ] Code passes `npm test:coverage` (95%+ coverage)
- [ ] Code passes `npm run type-check`
- [ ] No `any` types introduced
- [ ] New APIs have JSDoc comments
- [ ] README updated if needed
- [ ] Commit messages are clear
- [ ] No unrelated changes included

## Release Process

Releases follow semantic versioning (MAJOR.MINOR.PATCH):

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.2.3`
4. Push tag: `git push origin v1.2.3`
5. CI/CD publishes to npm

## Getting Help

- **GitHub Issues**: Ask questions or report bugs
- **Discussions**: General questions and ideas
- **Security**: Report at security@fluxion.org

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.

---

Thank you for making Fluxion SDK better!
