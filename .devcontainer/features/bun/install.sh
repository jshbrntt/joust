#!/usr/bin/env sh
set -e

if [ "$(id -u)" -ne 0 ]; then
    echo "Install must run as root" >&2
    exit 1
fi

VERSION="${VERSION:-1.3.12}"
USERNAME="${USER:-vscode}"

apk add --no-cache curl unzip libstdc++ libgcc

ARCH="$(uname -m)"
case "$ARCH" in
    x86_64) BUN_ARCH="x64" ;;
    aarch64) BUN_ARCH="aarch64" ;;
    *)
        echo "unsupported arch: $ARCH" >&2
        exit 1
        ;;
esac

cd /tmp
curl -fsSLO "https://github.com/oven-sh/bun/releases/download/bun-v${VERSION}/bun-linux-${BUN_ARCH}-musl.zip"
unzip -q "bun-linux-${BUN_ARCH}-musl.zip"
mv "bun-linux-${BUN_ARCH}-musl/bun" /usr/local/bin/bun
chmod +x /usr/local/bin/bun
ln -sf /usr/local/bin/bun /usr/local/bin/bunx
rm -rf "/tmp/bun-linux-${BUN_ARCH}-musl" "/tmp/bun-linux-${BUN_ARCH}-musl.zip"

cat > /etc/profile.d/bun.sh << 'EOF'
export PATH="$HOME/.bun/bin:$PATH"
EOF

if [ "$USERNAME" != "root" ] && [ -d "/home/$USERNAME" ]; then
    touch "/home/$USERNAME/.bashrc"
    if ! grep -q 'HOME/.bun/bin' "/home/$USERNAME/.bashrc"; then
        cat >> "/home/$USERNAME/.bashrc" << 'EOF'
export PATH="$HOME/.bun/bin:$PATH"
EOF
    fi
    chown "$USERNAME:$USERNAME" "/home/$USERNAME/.bashrc"
fi

echo "Installed $(bun --version)"
