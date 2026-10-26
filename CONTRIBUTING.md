# Contributing

Thank you for contributing to 3D RGB Frontend.

## Getting started

1. Read [README.md](README.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
2. Use Node.js 20+ and install dependencies with `npm ci`.
3. Copy `.env.example` to `.env.local` and configure the Laravel API. Never commit credentials.
4. Create a focused branch from the current default branch; do not push directly to `main`.
5. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. For E2E changes, install browsers with `npx playwright install` and run `npm run test:e2e` against a configured API.
6. Open a pull request using the template, explaining the change, verification, screenshots for UI changes, and any breaking behavior.

## Development guidelines

- Keep the Next.js storefront consistent with the existing Laravel API contracts and UI parity described in the README.
- Do not include real customer data, secrets, production environment files, or copyrighted 3D assets without permission.
- Keep changes small, document new environment variables, and update tests when behavior changes.
- Report security vulnerabilities privately as described in [SECURITY.md](SECURITY.md), not in public issues.

Maintainers review contributions; submitting a pull request does not guarantee acceptance.
