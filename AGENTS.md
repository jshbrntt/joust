# Codex Notes

## Build Environment

- The devcontainer is the canonical build environment. Build-critical tools are installed by `.devcontainer/Dockerfile`.
- After dependency changes, run `bun install` manually before project scripts.
- Use Bun package scripts for verification:
  - `bun run doctor` checks required tools and submodule/source sentinels.
  - `bun run rom:verify` rebuilds ROM artifacts, downloads originals if needed, and verifies hashes.
  - `bun run mame:build` builds browser MAME output.
  - `bun run mame:serve` builds and serves browser MAME.
- Project-owned Make/Picard/Docker Compose wrappers have been removed. Do not add new Make targets for project orchestration; use TypeScript scripts executed by Bun.

## Devcontainer

- When changing devcontainer configuration, prompt the user to rebuild the devcontainer and resume the Codex session so the running environment matches the checked-in configuration.
- Persist tool and service configuration through project files or devcontainer setup files rather than only editing generated files inside a running devcontainer.
