FROM node:20-alpine

WORKDIR /app

# Exposer le port
EXPOSE 3002

# Variables d'environnement
ENV PORT=3002
ENV SKIP_PREFLIGHT_CHECK=true

# Script de démarrage qui installe les dépendances puis lance l'app
CMD sh -c "npm install && npm start"
