#!/usr/bin/env sh
set -e

if [ "$(id -u)" -ne 0 ]; then
    echo "Install must run as root" >&2
    exit 1
fi

VERSION="${VERSION:-latest}"

apk add --no-cache bubblewrap ca-certificates curl git tar

ARCH="$(uname -m)"
case "$ARCH" in
    x86_64) CODEX_ARCH="x86_64" ;;
    aarch64) CODEX_ARCH="aarch64" ;;
    *)
        echo "unsupported arch: $ARCH" >&2
        exit 1
        ;;
esac

ASSET="codex-${CODEX_ARCH}-unknown-linux-musl.tar.gz"
if [ "$VERSION" = "latest" ]; then
    URL="https://github.com/openai/codex/releases/latest/download/${ASSET}"
else
    URL="https://github.com/openai/codex/releases/download/${VERSION}/${ASSET}"
fi

cd /tmp
curl -fsSLo codex.tar.gz "$URL"
tar -xzf codex.tar.gz
mv "codex-${CODEX_ARCH}-unknown-linux-musl" /usr/local/bin/codex
chmod +x /usr/local/bin/codex
rm -f codex.tar.gz

echo "Installed $(codex --version)"
