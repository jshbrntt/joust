#!/bin/sh
set -e

if [ "$(id -u)" -ne 0 ]; then
    echo "Install must run as root" >&2
    exit 1
fi

USERNAME="${_REMOTE_USER:-$(id -un 1000 2>/dev/null || echo root)}"

apk add --no-cache docker-engine docker-cli docker-cli-compose iptables

addgroup -S docker 2>/dev/null || true
if [ "$USERNAME" != "root" ]; then
    addgroup "$USERNAME" docker
fi

cat > /usr/local/share/docker-init.sh << 'EOF'
#!/bin/sh
set -e

if [ "$(id -u)" -ne 0 ]; then
    SUDO="sudo"
else
    SUDO=""
fi

$SUDO sh -c '
    if [ -f /sys/fs/cgroup/cgroup.controllers ]; then
        mkdir -p /sys/fs/cgroup/init
        xargs -rn1 < /sys/fs/cgroup/cgroup.procs > /sys/fs/cgroup/init/cgroup.procs 2>/dev/null || :
        sed -e "s/ / +/g" -e "s/^/+/" < /sys/fs/cgroup/cgroup.controllers > /sys/fs/cgroup/cgroup.subtree_control 2>/dev/null || :
    fi
    find /run /var/run -iname "docker*.pid" -delete 2>/dev/null || :
    if ! pgrep -x dockerd > /dev/null 2>&1; then
        ( dockerd > /tmp/dockerd.log 2>&1 ) &
    fi
'

exec "$@"
EOF

chmod +x /usr/local/share/docker-init.sh
