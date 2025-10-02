#!/bin/bash
# ============================================
# OPSFLUX - SCRIPT DE BACKUP BASE DE DONNÉES
# ============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups/database"
CONTAINER_NAME="opsflux_postgres"

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

POSTGRES_USER=${POSTGRES_USER:-opsflux_user}
POSTGRES_DB=${POSTGRES_DB:-opsflux}
BACKUP_FILE="${BACKUP_DIR}/opsflux_backup_${TIMESTAMP}.sql"
BACKUP_COMPRESSED="${BACKUP_FILE}.gz"

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  💾 BACKUP BASE DE DONNÉES OPSFLUX${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Vérifier que le container existe
if ! docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}❌ Le container ${CONTAINER_NAME} n'existe pas${NC}"
    exit 1
fi

# Vérifier que le container est en cours d'exécution
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}❌ Le container ${CONTAINER_NAME} n'est pas démarré${NC}"
    exit 1
fi

# Créer le répertoire de backup s'il n'existe pas
mkdir -p ${BACKUP_DIR}

echo -e "${YELLOW}🔄 Démarrage du backup...${NC}"
echo -e "${YELLOW}   Base de données: ${POSTGRES_DB}${NC}"
echo -e "${YELLOW}   Utilisateur: ${POSTGRES_USER}${NC}"
echo -e "${YELLOW}   Fichier: ${BACKUP_COMPRESSED}${NC}"

# Effectuer le backup
docker exec -t ${CONTAINER_NAME} pg_dump -U ${POSTGRES_USER} -d ${POSTGRES_DB} --clean --if-exists > ${BACKUP_FILE}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup créé avec succès${NC}"
    
    # Compresser le backup
    echo -e "${YELLOW}🗜️  Compression du backup...${NC}"
    gzip ${BACKUP_FILE}
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backup compressé avec succès${NC}"
        
        # Afficher la taille du fichier
        SIZE=$(du -h ${BACKUP_COMPRESSED} | cut -f1)
        echo -e "${GREEN}   Taille: ${SIZE}${NC}"
    else
        echo -e "${RED}❌ Erreur lors de la compression${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Erreur lors du backup${NC}"
    exit 1
fi

# Nettoyage des anciens backups (garder les 30 derniers jours)
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}
echo -e "${YELLOW}🧹 Nettoyage des backups de plus de ${RETENTION_DAYS} jours...${NC}"
find ${BACKUP_DIR} -name "opsflux_backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Backup terminé avec succès !${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
