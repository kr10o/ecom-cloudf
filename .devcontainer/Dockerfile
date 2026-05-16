# Use a stable Node.js 20 base image
FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install global CLI tools: Cloudflare Wrangler, GitHub CLI, and PNPM
RUN npm install -g pnpm@latest wrangler@latest

# Install direnv for shell initialization & secrets architecture
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends direnv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Add direnv hook to bashrc to establish direnv integration within the Ephemeral Container[cite: 3]
RUN echo 'eval "$(direnv hook bash)"' >> /home/node/.bashrc

# Ensure the PNPM store directory exists and is accessible
RUN mkdir -p /home/node/.local/share/pnpm/store/v3 \
    && chown -R node:node /home/node/.local/share/pnpm