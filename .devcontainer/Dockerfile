FROM alpine:3.21

ARG BUN_VERSION="1.3.12"

RUN apk add --no-cache \
        bash curl git sudo unzip openssh tig \
        libstdc++ libgcc \
    && addgroup -g 1000 joust \
    && adduser -D -u 1000 -G joust -s /bin/bash joust \
    && echo 'joust ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/joust \
    && chmod 0440 /etc/sudoers.d/joust

RUN ARCH="$(uname -m)" && \
    case "$ARCH" in \
        x86_64) BUN_ARCH="x64" ;; \
        aarch64) BUN_ARCH="aarch64" ;; \
        *) echo "unsupported arch: $ARCH" >&2; exit 1 ;; \
    esac && \
    cd /tmp && \
    curl -fsSLO "https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/bun-linux-${BUN_ARCH}-musl.zip" && \
    unzip -q "bun-linux-${BUN_ARCH}-musl.zip" && \
    mv "bun-linux-${BUN_ARCH}-musl/bun" /usr/local/bin/bun && \
    chmod +x /usr/local/bin/bun && \
    ln -s /usr/local/bin/bun /usr/local/bin/bunx && \
    ln -s /usr/local/bin/bun /usr/local/bin/node && \
    rm -rf "/tmp/bun-linux-${BUN_ARCH}-musl" "/tmp/bun-linux-${BUN_ARCH}-musl.zip"

USER joust

RUN ARCH="$(uname -m)" && \
    case "$ARCH" in \
        x86_64) CLAUDE_PKG="@anthropic-ai/claude-code-linux-x64-musl" ;; \
        aarch64) CLAUDE_PKG="@anthropic-ai/claude-code-linux-arm64-musl" ;; \
        *) echo "unsupported arch: $ARCH" >&2; exit 1 ;; \
    esac && \
    bun install -g @anthropic-ai/claude-code && \
    bun install -g $CLAUDE_PKG && \
    cd /home/joust/.bun/install/global/node_modules/@anthropic-ai/claude-code && \
    bun run install.cjs && \
    mv bin/claude.exe bin/claude && \
    ln -s /home/joust/.bun/install/global/node_modules/@anthropic-ai/claude-code/bin/claude /home/joust/.bun/bin/claude

RUN bun install -g @openai/codex

ENV PATH="/home/joust/.bun/bin:$PATH"

WORKDIR /workspaces/joust
