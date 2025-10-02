#!/bin/bash
# ============================================
# OPSFLUX - SCRIPT DE RESTAURATION BASE DE DONNÉES
# ============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups/database"
CONTAINER_NAME="opsflux_postgres"

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

POSTGRES_USER=${POSTGRES_USER:-opsflux_user}
POSTGRES_DB=${POSTGRES_DB:-opsflux}

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  🔄 RESTAURATION BASE DE DONNÉES OPSFLUX${NC}"
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

# Lister les backups disponibles
echo -e "${YELLOW}📋 Backups disponibles :${NC}"
ls -lht ${BACKUP_DIR}/*.sql.gz 2>/dev/null | head -10 || {
    echo -e "${RED}❌ Aucun backup trouvé dans ${BACKUP_DIR}${NC}"
    exit 1
}

echo ""
echo -e "${YELLOW}📝 Entrez le nom du fichier de backup à restaurer :${NC}"
read -r BACKUP_FILE

# Vérifier que le fichier existe
if [ ! -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo -e "${RED}❌ Le fichier ${BACKUP_FILE} n'existe pas${NC}"
    exit 1
fi

# Confirmation
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${RED}⚠️  ATTENTION : Cette opération va ÉCRASER la base de données actuelle !${NC}"
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}   Base de données: ${POSTGRES_DB}${NC}"
echo -e "${YELLOW}   Backup: ${BACKUP_FILE}${NC}"
echo ""
read -p "Êtes-vous sûr de vouloir continuer ? (tapez 'OUI' en majuscules) : " -r
echo

if [ "$REPLY" != "OUI" ]; then
    echo -e "${YELLOW}❌ Restauration annulée${NC}"
    exit 0
fi

# Créer un backup de sécurité avant restauration
echo -e "${YELLOW}🔒 Création d'un backup de sécurité...${NC}"
SAFETY_BACKUP="./backups/database/safety_backup_$(date +%Y%m%d_%H%M%S).sql"
docker exec -t ${CONTAINER_NAME} pg_dump -U ${POSTGRES_USER} -d ${POSTGRES_DB} --clean --if-exists > ${SAFETY_BACKUP}
gzip ${SAFETY_BACKUP}
echo -e "${GREEN}✅ Backup de sécurité créé : ${SAFETY_BACKUP}.gz${NC}"

# Décompresser le backup si nécessaire
TEMP_FILE="/tmp/opsflux_restore_$(date +%s).sql"
if [[ ${BACKUP_FILE} == *.gz ]]; then
    echo -e "${YELLOW}📦 Décompression du backup...${NC}"
    gunzip -c "${BACKUP_DIR}/${BACKUP_FILE}" > ${TEMP_FILE}
else
    cp "${BACKUP_DIR}/${BACKUP_FILE}" ${TEMP_FILE}
fi

# Arrêter le backend pour éviter les connexions actives
echo -e "${YELLOW}🛑 Arrêt du backend...${NC}"
docker-compose stop backend celery_worker celery_beat || true

# Attendre que les connexions se ferment
sleep 3

# Terminer les connexions actives
echo -e "${YELLOW}🔌 Fermeture des connexions actives...${NC}"
docker exec -t ${CONTAINER_NAME} psql -U ${POSTGRES_USER} -d postgres -c \
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${POSTGRES_DB}' AND pid <> pg_backend_pid();" \
    2>/dev/null || true

# Restaurer la base de données
echo -e "${YELLOW}🔄 Restauration en cours...${NC}"
cat ${TEMP_FILE} | docker exec -i ${CONTAINER_NAME} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Restauration réussie${NC}"
    
    # Nettoyer le fichier temporaire
    rm -f ${TEMP_FILE}
    
    # Redémarrer le backend
    echo -e "${YELLOW}🚀 Redémarrage du backend...${NC}"
    docker-compose up -d backend celery_worker celery_beat
    
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Base de données restaurée avec succès !${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
else
    echo -e "${RED}❌ Erreur lors de la restauration${NC}"
    echo -e "${YELLOW}💡 Le backup de sécurité est disponible : ${SAFETY_BACKUP}.gz${NC}"
    rm -f ${TEMP_FILE}
    exit 1
fi
