#!/bin/bash
# ============================================
# OPSFLUX - SCRIPT DE DÉPLOIEMENT PRODUCTION
# ============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🚀 OPSFLUX - DÉPLOIEMENT PRODUCTION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Vérification de l'environnement
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

if [ "$ENVIRONMENT" != "production" ]; then
    echo -e "${RED}❌ Ce script doit être exécuté en environnement PRODUCTION${NC}"
    echo -e "${YELLOW}💡 Modifiez ENVIRONMENT=production dans .env${NC}"
    exit 1
fi

# Confirmation
echo -e "${YELLOW}⚠️  Vous êtes sur le point de déployer en PRODUCTION${NC}"
read -p "Voulez-vous continuer ? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Déploiement annulé${NC}"
    exit 0
fi

# Backup pré-déploiement
echo -e "${YELLOW}💾 Création d'un backup pré-déploiement...${NC}"
./scripts/backup-db.sh

# Pull des dernières images si production distante
if [ -n "$DOCKER_REGISTRY" ]; then
    echo -e "${YELLOW}📥 Pull des images depuis le registry...${NC}"
    docker-compose pull
fi

# Build des images
echo -e "${YELLOW}🔨 Construction des images...${NC}"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

# Arrêt des services
echo -e "${YELLOW}🛑 Arrêt des services...${NC}"
docker-compose down

# Démarrage des services en mode détaché
echo -e "${YELLOW}🚀 Démarrage des services...${NC}"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Attendre que les services soient prêts
echo -e "${YELLOW}⏳ Attente du démarrage des services...${NC}"
sleep 10

# Migrations
echo -e "${YELLOW}🔄 Application des migrations...${NC}"
docker-compose exec -T backend python manage.py migrate --noinput

# Collecte des fichiers statiques
echo -e "${YELLOW}📦 Collection des fichiers statiques...${NC}"
docker-compose exec -T backend python manage.py collectstatic --noinput --clear

# Vérification santé
echo -e "${YELLOW}🏥 Vérification de la santé des services...${NC}"
./scripts/health-check.sh

if [ $? -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Déploiement réussi !${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📱 Application : https://app.opsflux.io${NC}"
    echo -e "${YELLOW}🔧 API : https://api.opsflux.io${NC}"
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ Erreur lors du déploiement${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
