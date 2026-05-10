#!/usr/bin/env bash
set -e

create_persist_files_script() {
    # Resolve $USER in paths option and build typed persist array entries.
    local resolved_paths="${PATHS//\$USER/$USER}"
    local persist_entries=""
    IFS=',' read -ra path_entries <<< "$resolved_paths"
    for entry in "${path_entries[@]}"; do
        entry="${entry#"${entry%%[![:space:]]*}"}"
        entry="${entry%"${entry##*[![:space:]]}"}"
        if [ -z "$entry" ]; then
            continue
        fi
        case "$entry" in
            file:*|directory:*) ;;
            *)
                echo "Invalid persist-files entry: '$entry'" >&2
                echo "Entries must be formatted as 'file:/absolute/path' or 'directory:/absolute/path'." >&2
                exit 1
                ;;
        esac
        local path="${entry#*:}"
        if [ -z "$path" ] || [ "${path#/}" = "$path" ]; then
            echo "Persist path must be absolute: '$path'" >&2
            exit 1
        fi
        persist_entries+="    $(printf '%q' "$entry")"$'\n'
    done
    if [ -z "$persist_entries" ]; then
        echo "At least one persist-files entry is required." >&2
        echo "Entries must be formatted as 'file:/absolute/path' or 'directory:/absolute/path'." >&2
        exit 1
    fi

    tee /usr/local/bin/persist-files.sh << EOF
#!/usr/bin/env bash
set -e

mount='/mnt/persist-files'
persist=(
${persist_entries})

fix_permissions() {
    sudo chown -R \$(id -u):\$(id -g) \${mount}
}

# Setup symlinks for files and directories that should be persisted between devcontainer rebuilds.
# If the path does not yet exist, the requested file or directory is stubbed in the mount first.
create_symlinks() {
    for entry in "\${persist[@]}"; do
        type="\${entry%%:*}"
        path="\${entry#*:}"
        if [ -z "\${path}" ] || [ "\${path}" = "\${entry}" ]; then
            echo "Invalid persist-files entry: '\${entry}'" >&2
            echo "Entries must be formatted as 'file:/absolute/path' or 'directory:/absolute/path'." >&2
            exit 1
        fi
        if [ "\${path#/}" = "\${path}" ]; then
            echo "Persist path must be absolute: '\${path}'" >&2
            exit 1
        fi

        echo "Setting up \${type} symlink for: '\${path}'"
        mount_path="\${mount}\${path}"
        # Ensure the parent directories exist on both sides
        mkdir -p "\$(dirname "\${path}")"
        mkdir -p "\$(dirname "\${mount_path}")"
        # If path exists but is not a symlink, move it into the mount before symlinking
        if [ -e "\${path}" ] && [ ! -L "\${path}" ]; then
            if [ -e "\${mount_path}" ]; then
                echo "'\${mount_path}' already exists, removing conflict: '\${path}'"
                rm -rf "\${path}"
            else
                echo "'\${path}' exists, moving to: '\${mount_path}'"
                mv "\${path}" "\${mount_path}"
            fi
        fi
        if [ ! -e "\${mount_path}" ]; then
            case "\${type}" in
                directory)
                    echo "Creating persisted directory stub: '\${mount_path}'"
                    mkdir -p "\${mount_path}"
                    ;;
                file)
                    echo "Creating persisted file stub: '\${mount_path}'"
                    touch "\${mount_path}"
                    ;;
                *)
                    echo "Invalid persist-files type: '\${type}'" >&2
                    echo "Type must be 'file' or 'directory'." >&2
                    exit 1
                    ;;
            esac
        fi
        echo "Creating symlink: '\${path}' -> '\${mount_path}'"
        echo ""
        ln -nsf "\${mount_path}" "\${path}"
    done
}

fix_permissions
create_symlinks
EOF
}

update_bashrc() {
    tee -a /home/$USER/.bashrc << 'EOF'
PATH="$PATH:~/.local/bin"
EOF
}

fix_permissions() {
    chown $USER:$GROUP /home/$USER/.bashrc
    chown $USER:$GROUP /usr/local/bin/persist-files.sh
    chmod +x /usr/local/bin/persist-files.sh
}

create_persist_files_script
update_bashrc
fix_permissions
