# ============================================
# OPSFLUX NGINX - DOCKERFILE avec CLAUDE CODE
# ============================================

FROM nginx:1.25-alpine

# Métadonnées
LABEL maintainer="OpsFlux Team <dev@opsflux.io>"
LABEL description="OpsFlux Nginx Reverse Proxy with Claude Code"
LABEL version="1.0.0"

# Variables d'environnement
ENV CLAUDE_CODE_HOME=/opt/claude-code

# Installation Node.js et Claude Code
RUN apk add --no-cache \
    nodejs \
    npm \
    curl \
    vim \
    nano \
    bash \
    git \
    python3 \
    && npm install -g @anthropic-ai/claude-code \
    && mkdir -p ${CLAUDE_CODE_HOME}

# Copie des configurations Nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Création des répertoires nécessaires
RUN mkdir -p /var/cache/nginx /var/log/nginx ${CLAUDE_CODE_HOME}/workspace \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx ${CLAUDE_CODE_HOME}

# Health check page
RUN echo '<!DOCTYPE html><html><head><title>OpsFlux Health</title></head><body><h1>OK</h1></body></html>' \
    > /usr/share/nginx/html/health

# Exposition des ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Commande par défaut
CMD ["nginx", "-g", "daemon off;"]
