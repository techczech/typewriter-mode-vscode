# Repository Guidelines

## Project Structure & Module Organization
- `extension.js` contains the VS Code extension entry points (`activate`, `deactivate`) and the `TypewriterAutoScroll` class.
- `package.json` defines extension metadata, contributes commands/settings, and npm scripts.
- `images/` holds extension assets (icon, etc.).
- `test/` contains the VS Code test harness (`runTest.js`) and Mocha suites in `test/suite/`.
- `vsc-extension-quickstart.md` documents basic VS Code extension setup.

## Build, Test, and Development Commands
- `npm install`: install dev dependencies.
- `npm run lint`: run ESLint (StandardJS rules).
- `npm test`: run the VS Code extension tests via `node ./test/runTest.js` (includes `pretest` lint).
- `npx --yes @vscode/vsce package`: build a `.vsix` for local installs.

## Coding Style & Naming Conventions
- JavaScript (CommonJS) style follows StandardJS via ESLint (no semicolons, 2-space indentation).
- Use camelCase for functions and variables (`changeOffset`, `toggleEnable`).
- Keep settings/commands aligned with the `typewriterAutoScroll.*` namespace in `package.json`.

## Testing Guidelines
- Frameworks: Mocha + VS Code test runner (`vscode-test`).
- Tests live under `test/suite/` and use `*.test.js` naming.
- Run all tests with `npm test`; keep tests deterministic and editor-safe.

## Commit & Pull Request Guidelines
- Recent commit messages are short and direct (e.g., `Fixed horizontal scroll`, version tags like `1.1.3`). Follow the same concise style.
- PRs should include: a brief description, the user-facing behavior change, and any settings/command updates. Include screenshots or GIFs if UI behavior changes (status bar, scrolling behavior).

## Configuration Notes
- Settings live under `typewriterAutoScroll.enable` and `typewriterAutoScroll.offset` in `package.json`; update defaults and descriptions there when changing behavior.

## Antigravity Install (Local Machines)
- Build a VSIX from the repo: `npx --yes @vscode/vsce package`.
- Install into Antigravity using the generated filename, for example: `/Applications/Antigravity.app/Contents/Resources/app/bin/antigravity --install-extension ./typewriter-auto-scroll-<version>.vsix`.
- Extensions are stored at `~/.antigravity/extensions/` for verification or cleanup.
