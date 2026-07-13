# Repository Setup Guide

Complete setup instructions for developers and contributors.

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/fluxion-protocol/fluxion-sdk.git
cd fluxion-sdk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Installation

```bash
npm run type-check
npm run lint
npm test
```

All three should pass with no errors.

## Development Workflow

### 1. Create Feature Branch

```bash
# For features
git checkout -b feat/feature-name

# For bugfixes
git checkout -b fix/bug-name

# For documentation
git checkout -b docs/update-name
```

### 2. Start Development

```bash
npm run dev  # Runs TypeScript in watch mode
```

In another terminal:

```bash
npm test -- --watch  # Runs tests in watch mode
```

### 3. Make Changes

- Edit files in `src/`
- Add tests in `tests/`
- Update documentation as needed
- Keep to TypeScript strict mode

### 4. Validate Changes

```bash
npm run type-check    # TypeScript validation
npm run lint          # ESLint check
npm run lint:fix      # Auto-fix linting issues
npm run format        # Code formatting
npm test              # Run tests once
npm test:coverage     # Coverage report (95%+ required)
npm run build         # Build distribution
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: description of changes"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `refactor:` - Code restructuring (no functionality change)
- `test:` - Test additions or updates
- `chore:` - Build, dependencies, tooling

### 6. Push and Create PR

```bash
git push origin feat/feature-name
```

Then open a PR on GitHub with:
- Clear title
- Description of changes
- Related issues (if any)
- Test coverage details

## Code Standards

### TypeScript Rules

- ✅ **Strict mode**: All code must pass `tsc --noEmit`
- ✅ **No `any` types**: Zero `any` usage allowed
- ✅ **Explicit returns**: All functions must have explicit return type
- ✅ **Error handling**: All promises must be handled
- ✅ **No console logs**: Use error throwing instead

### Code Style

- 2-space indentation
- Single quotes for strings
- 100 character line width
- Trailing commas in multi-line objects

### File Organization

```
src/
├── client/          # Main client class
├── modules/         # Feature modules
├── wallet/          # Wallet integration
├── rpc/             # Network layer
├── xdr/             # XDR handling
├── types/           # TypeScript types
├── errors/          # Error classes
├── utils/           # Constants and helpers
└── index.ts         # Main export
```

## Testing Requirements

### Coverage Thresholds

- Statements: 95%
- Branches: 90%
- Functions: 95%
- Lines: 95%

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });

  it('should handle errors', () => {
    expect(() => functionUnderTest(invalid)).toThrow(CustomError);
  });
});
```

### Running Tests

```bash
npm test              # Single run
npm test -- --watch   # Watch mode
npm test:coverage     # Coverage report with details
```

## Documentation

### JSDoc Format

```typescript
/**
 * Brief description.
 *
 * Longer description if needed.
 *
 * @param param1 - Description of param1
 * @param param2 - Description of param2
 * @returns Description of return value
 * @throws CustomError if something goes wrong
 * @example
 * ```typescript
 * const result = myFunction('value1', 'value2');
 * console.log(result); // Output
 * ```
 */
export function myFunction(param1: string, param2: string): string {
  // Implementation
  return `${param1}-${param2}`;
}
```

### Markdown Files to Update

When adding features:
- `README.md` - Update API reference section
- `QUICKSTART.md` - Add example usage
- `docs/ARCHITECTURE.md` - Update if design changes
- `CHANGELOG.md` - Note in unreleased section
- Create/update JSDoc comments

## Git Workflow

### Before Pushing

```bash
# Update to latest main
git fetch origin
git rebase origin/main

# Run full validation
npm run type-check
npm run lint
npm test:coverage
npm run build

# Push to your branch
git push origin feat/feature-name
```

### PR Review Checklist

Before opening PR, ensure:
- [ ] All tests pass
- [ ] Coverage is 95%+
- [ ] No linting errors
- [ ] TypeScript strict passes
- [ ] Code formatted with Prettier
- [ ] JSDoc added for public APIs
- [ ] Examples included if applicable
- [ ] Documentation updated
- [ ] Commit messages are clear

## Releasing

### Version Bumps

Use semantic versioning:
- **Major** (1.0.0 → 2.0.0): Breaking API changes
- **Minor** (1.0.0 → 1.1.0): New features, backwards compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes only

### Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit: `git commit -am "chore: release v1.0.1"`
4. Tag: `git tag v1.0.1`
5. Push: `git push origin main --tags`
6. GitHub Actions automatically publishes to npm

## Troubleshooting

### "npm install fails"

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Tests fail randomly"

- Check for timing issues in async tests
- Ensure mocks are properly reset between tests
- Use `beforeEach` for setup

### "Type errors after changes"

```bash
npm run type-check
```

Then fix reported errors. Common issues:
- Missing return type on function
- Using `any` type
- Unhandled promise rejection

### "Linting errors"

```bash
npm run lint:fix  # Auto-fix most issues
npm run format    # Format code style
npm run lint      # Re-check
```

### "Coverage too low"

Add tests for:
- Happy path (main functionality)
- Error cases
- Edge cases
- Different input types

Run coverage report:

```bash
npm test:coverage
```

Check HTML report: `coverage/index.html`

## IDE Setup

### Visual Studio Code

Recommended extensions:
- ESLint
- Prettier
- TypeScript
- Vitest

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Useful Commands

```bash
# Development
npm run dev              # Watch and rebuild
npm test -- --watch     # Watch tests
npm run format          # Auto-format

# Validation
npm run type-check      # Type check only
npm run lint            # Lint check only
npm test:coverage       # Coverage report

# Building
npm run build           # Build dist/
npm run docs            # Generate TypeDoc

# Full validation (run before PR)
npm run type-check && npm run lint && npm test:coverage && npm run build
```

## Environment Variables

No environment variables required for development.

For publishing to npm, you need `NPM_TOKEN` (handled by CI/CD).

## Support

- **Questions**: GitHub Discussions
- **Issues**: GitHub Issues
- **Security**: security@fluxion.org

## Resources

- [Contributing Guide](./CONTRIBUTING.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Security Policy](./SECURITY.md)
- [API Reference](./README.md)

---

Happy coding! 🚀
