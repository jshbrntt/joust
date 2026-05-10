#!/usr/bin/env sh
set -e

if [ "$(id -u)" -ne 0 ]; then
    echo "Install must run as root" >&2
    exit 1
fi

PROJECT="${PROJECT:-vscode}"
PROJECT_UID="${UID:-1000}"
PROJECT_GID="${GID:-1000}"
PACKAGES="${PACKAGES:-bash curl git sudo unzip openssh tig libstdc++ libgcc}"

apk add --no-cache $PACKAGES

if ! getent group "$PROJECT" >/dev/null 2>&1; then
    addgroup -g "$PROJECT_GID" "$PROJECT"
fi

if ! id "$PROJECT" >/dev/null 2>&1; then
    adduser -D -u "$PROJECT_UID" -G "$PROJECT" -s /bin/bash "$PROJECT"
fi

echo "$PROJECT ALL=(ALL) NOPASSWD: ALL" > "/etc/sudoers.d/$PROJECT"
chmod 0440 "/etc/sudoers.d/$PROJECT"
