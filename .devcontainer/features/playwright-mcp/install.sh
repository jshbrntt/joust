#!/usr/bin/env sh
set -e

if [ "$(id -u)" -ne 0 ]; then
    echo "Install must run as root" >&2
    exit 1
fi

VERSION="${VERSION:-latest}"
INSTALL_CHROMIUM="${INSTALLCHROMIUM:-true}"

apk add --no-cache nodejs npm

if [ "$INSTALL_CHROMIUM" = "true" ]; then
    apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
    export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
fi

npm install -g "@playwright/mcp@${VERSION}"

if [ "$INSTALL_CHROMIUM" = "true" ]; then
    mkdir -p /usr/local/share/playwright-mcp
    cat > /usr/local/share/playwright-mcp/alpine-chromium.json << 'EOF'
{
  "browser": {
    "browserName": "chromium",
    "launchOptions": {
      "headless": true,
      "executablePath": "/usr/bin/chromium-browser",
      "args": [
        "--no-sandbox",
        "--disable-dev-shm-usage"
      ]
    }
  }
}
EOF

    cat > /usr/local/bin/playwright-mcp-alpine << 'EOF'
#!/usr/bin/env sh
set -e

exec playwright-mcp --config /usr/local/share/playwright-mcp/alpine-chromium.json "$@"
EOF
    chmod +x /usr/local/bin/playwright-mcp-alpine
fi

echo "Installed Playwright MCP"
