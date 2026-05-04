#!/usr/bin/env bash
set -e

VERSION="${VERSION:-"latest"}"
REPO="wagoodman/dive"

# Resolve "latest" to an actual version tag
if [ "$VERSION" = "latest" ]; then
    VERSION="$(curl -sfL -o /dev/null -w '%{url_effective}' "https://github.com/${REPO}/releases/latest" | grep -oE '[^/v]+$')"
fi

# Strip leading 'v' if present
VERSION="${VERSION#v}"

if [ -z "$VERSION" ]; then
    echo "ERROR: Failed to resolve dive version."
    exit 1
fi

ARCH="$(uname -m)"
case "$ARCH" in
    x86_64)  ARCH="amd64" ;;
    aarch64) ARCH="arm64" ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

URL="https://github.com/${REPO}/releases/download/v${VERSION}/dive_${VERSION}_linux_${ARCH}.tar.gz"

echo "Downloading dive v${VERSION} for linux/${ARCH}..."
curl -sfL "$URL" | tar xzf - -C /usr/local/bin dive

chmod +x /usr/local/bin/dive

echo "Installed dive $(dive --version)"
