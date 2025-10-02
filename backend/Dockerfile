# ============================================
# OPSFLUX BACKEND - DOCKERFILE avec CLAUDE CODE
# ============================================

ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim-bookworm

# Métadonnées
LABEL maintainer="OpsFlux Team <dev@opsflux.io>"
LABEL description="OpsFlux Backend - Django REST API with Claude Code"
LABEL version="1.0.0"

# Variables d'environnement
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive \
    APP_HOME=/app \
    CLAUDE_CODE_HOME=/opt/claude-code

# Installation des dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    make \
    libpq-dev \
    postgresql-client \
    libjpeg-dev \
    libpng-dev \
    libwebp-dev \
    zlib1g-dev \
    curl \
    wget \
    git \
    vim \
    nano \
    netcat-traditional \
    ca-certificates \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installation de Claude Code globalement
RUN npm install -g @anthropic-ai/claude-code && \
    mkdir -p ${CLAUDE_CODE_HOME}

# Création répertoire application
WORKDIR ${APP_HOME}

# Copie des requirements
COPY requirements.txt requirements-dev.txt ./

# Installation des dépendances Python
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r requirements.txt && \
    pip install -r requirements-dev.txt

# Copie du code
COPY . .

# Création utilisateur non-root AVANT de copier les fichiers
RUN if id 1000 >/dev/null 2>&1; then \
        if ! id -u opsflux >/dev/null 2>&1; then \
            useradd -m -u 1001 opsflux; \
        fi \
    else \
        useradd -m -u 1000 opsflux; \
    fi

# Copie et permissions des scripts
COPY --chown=opsflux:opsflux entrypoint.sh wait-for-it.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/wait-for-it.sh

# Création des répertoires avec bonnes permissions
RUN mkdir -p logs staticfiles media ${CLAUDE_CODE_HOME}/workspace && \
    chown -R opsflux:opsflux ${APP_HOME} ${CLAUDE_CODE_HOME}

USER opsflux

# Configuration Claude Code pour l'utilisateur
RUN mkdir -p ~/.config/claude-code

# Port exposé
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/core/health/ || exit 1

# Point d'entrée
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Commande par défaut
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
