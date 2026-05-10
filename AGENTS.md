# Codex Notes

## Build Environment

- Do not run `make DEV=1 build`, `make DEV=1 clean`, or other `DEV=1` targets from the host unless the user explicitly asks for a host-only invocation.
- The host environment does not have the ROM build toolchain on `PATH` (`asl`, `p2bin`, `asm6809`, and `zip` are not available there).
- Use the Docker wrapper from the top-level `Makefile` for build verification:
  - `make build` builds the Docker environment.
  - `make rom` runs the ROM build inside the Docker environment.
- Inside the Docker Compose `env` service, `DEV=1` is set by `docker-compose.dev.yaml`, so commands inside the container can call `make build`, `make clean`, etc. directly.

## Sandbox

- In this workspace, the default command sandbox may fail because `bubblewrap` is unavailable. If a read-only or build command fails with that sandbox error, rerun the same command with escalation instead of changing the command strategy.

## Devcontainer

- When changing devcontainer configuration, prompt the user to rebuild the devcontainer and resume the Codex session so the running environment matches the checked-in configuration.
- Persist tool and service configuration through project files or devcontainer setup files rather than only editing generated files inside a running devcontainer.
