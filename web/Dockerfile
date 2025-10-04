FROM node:20-alpine

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 3002

# Variables d'environnement
ENV PORT=3002
ENV SKIP_PREFLIGHT_CHECK=true

# Commande de démarrage
CMD ["npm", "start"]
