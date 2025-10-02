# ============================================
# OPSFLUX FRONTEND - DOCKERFILE
# ============================================
# Updated: 2025-10-02 - Fix ajv dependencies

ARG NODE_VERSION=22
ARG REACT_APP_API_URL=http://72.60.188.156:8000
FROM node:${NODE_VERSION}-bookworm-slim

# Métadonnées
LABEL maintainer="OpsFlux Team <dev@opsflux.io>"
LABEL description="OpsFlux Frontend - React with Claude Code"
LABEL version="1.0.0"

# Variables d'environnement
ARG REACT_APP_API_URL
ENV NODE_ENV=development \
    APP_HOME=/app \
    CLAUDE_CODE_HOME=/opt/claude-code \
    GENERATE_SOURCEMAP=false \
    SKIP_PREFLIGHT_CHECK=true \
    REACT_APP_API_URL=${REACT_APP_API_URL}

# Installation des dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    git \
    vim \
    nano \
    netcat-traditional \
    python3 \
    make \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installation de Claude Code globalement
RUN npm install -g @anthropic-ai/claude-code && \
    mkdir -p ${CLAUDE_CODE_HOME}

# Création répertoire application
WORKDIR ${APP_HOME}

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances Node avec nettoyage
RUN rm -rf node_modules package-lock.json && \
    npm install --legacy-peer-deps && \
    npm cache clean --force

# Copie du code source
COPY . .

# Création des répertoires nécessaires
RUN mkdir -p logs ${CLAUDE_CODE_HOME}/workspace

# Utiliser l'utilisateur 'node' existant
RUN chown -R node:node ${APP_HOME} ${CLAUDE_CODE_HOME}

USER node

# Configuration Claude Code
RUN mkdir -p ~/.config/claude-code

# Port exposé
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Commande par défaut
CMD ["npm", "start"]
