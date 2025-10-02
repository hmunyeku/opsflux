#!/bin/bash
# ============================================
# OPSFLUX - SCRIPT D'INITIALISATION PROJET
# ============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🚀 OPSFLUX - INITIALISATION PROJET${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Vérification Docker
echo -e "${YELLOW}🔍 Vérification de Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker et Docker Compose sont installés${NC}"

# Création du fichier .env si inexistant
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Création du fichier .env...${NC}"
    cp .env.example .env
    
    # Génération d'une SECRET_KEY aléatoire
    SECRET_KEY=$(openssl rand -base64 48 | tr -d "=+/" | cut -c1-50)
    sed -i "s/SECRET_KEY=.*/SECRET_KEY=${SECRET_KEY}/" .env
    
    # Génération d'un mot de passe PostgreSQL aléatoire
    POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    sed -i "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=${POSTGRES_PASSWORD}/" .env
    
    echo -e "${GREEN}✅ Fichier .env créé avec des secrets générés${NC}"
    echo -e "${YELLOW}⚠️  N'oubliez pas de configurer ANTHROPIC_API_KEY dans .env${NC}"
else
    echo -e "${GREEN}✅ Fichier .env existe déjà${NC}"
fi

# Création des répertoires nécessaires
echo -e "${YELLOW}📁 Création des répertoires...${NC}"
mkdir -p logs/{backend,frontend,nginx,postgres}
mkdir -p backups/{database,media}
mkdir -p postgres/backup
mkdir -p nginx/ssl
mkdir -p backend/{staticfiles,media}

echo -e "${GREEN}✅ Répertoires créés${NC}"

# Permissions des scripts
echo -e "${YELLOW}🔐 Configuration des permissions...${NC}"
chmod +x scripts/*.sh
chmod +x backend/entrypoint.sh
chmod +x backend/wait-for-it.sh

echo -e "${GREEN}✅ Permissions configurées${NC}"

# Vérification de la clé API Anthropic
echo -e "${YELLOW}🔑 Vérification de la clé API Anthropic...${NC}"
if grep -q "ANTHROPIC_API_KEY=sk-ant-" .env 2>/dev/null; then
    echo -e "${GREEN}✅ Clé API Anthropic configurée${NC}"
else
    echo -e "${RED}❌ Clé API Anthropic non configurée${NC}"
    echo -e "${YELLOW}📌 Veuillez éditer .env et ajouter votre ANTHROPIC_API_KEY${NC}"
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Initialisation terminée avec succès !${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📋 Prochaines étapes :${NC}"
echo -e "${YELLOW}  1. Éditez le fichier .env et configurez ANTHROPIC_API_KEY${NC}"
echo -e "${YELLOW}  2. Lancez 'make build' pour construire les images${NC}"
echo -e "${YELLOW}  3. Lancez 'make up' pour démarrer les services${NC}"
echo -e "${YELLOW}  4. Lancez 'make migrate' pour appliquer les migrations${NC}"
echo -e "${YELLOW}  5. Lancez 'make superuser' pour créer un administrateur${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
