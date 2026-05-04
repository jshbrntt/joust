#!/usr/bin/env bash
set -e

create_persist_files_script() {
    # Resolve $USER in paths option and build persist array entries
    local resolved_paths="${PATHS//\$USER/$USER}"
    local persist_entries=""
    IFS=',' read -ra path_entries <<< "$resolved_paths"
    for entry in "${path_entries[@]}"; do
        persist_entries+="    '${entry}'"$'\n'
    done

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
# If the path does not yet exist, a dangling symlink is created — the application will create the
# file or directory at the mount path naturally when it first writes to the path.
create_symlinks() {
    for path in "\${persist[@]}"; do
        echo "Setting up symlink for: '\${path}'"
        mount_path=\${mount}\${path}
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
