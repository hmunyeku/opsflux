#!/bin/bash
# ============================================
# OPSFLUX - SCRIPT DE VÉRIFICATION SANTÉ
# ============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🏥 OPSFLUX - VÉRIFICATION SANTÉ DES SERVICES${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

check_service() {
    local service_name=$1
    local container_name=$2
    local check_command=$3
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    echo -e "${YELLOW}🔍 Vérification de ${service_name}...${NC}"
    
    # Vérifier si le container existe
    if ! docker ps -a --format '{{.Names}}' | grep -q "^${container_name}$"; then
        echo -e "${RED}   ❌ Container ${container_name} n'existe pas${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
    
    # Vérifier si le container est en cours d'exécution
    if ! docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        echo -e "${RED}   ❌ Container ${container_name} n'est pas démarré${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
    
    # Exécuter la commande de vérification
    if eval "$check_command" > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ ${service_name} est opérationnel${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}   ❌ ${service_name} ne répond pas correctement${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Vérification PostgreSQL
check_service \
    "PostgreSQL" \
    "opsflux_postgres" \
    "docker exec opsflux_postgres pg_isready -U opsflux_user"

# Vérification Redis
check_service \
    "Redis" \
    "opsflux_redis" \
    "docker exec opsflux_redis redis-cli ping"

# Vérification Backend Django
check_service \
    "Backend Django" \
    "opsflux_backend" \
    "curl -f http://localhost:8000/api/health/"

# Vérification Frontend React
check_service \
    "Frontend React" \
    "opsflux_frontend" \
    "curl -f http://localhost:3000/"

# Vérification Celery Worker
check_service \
    "Celery Worker" \
    "opsflux_celery_worker" \
    "docker exec opsflux_celery_worker celery -A config inspect ping"

# Vérification Celery Beat
check_service \
    "Celery Beat" \
    "opsflux_celery_beat" \
    "docker ps --filter name=opsflux_celery_beat --filter status=running"

# Vérification Nginx
check_service \
    "Nginx" \
    "opsflux_nginx" \
    "curl -f http://localhost/health"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  📊 RÉSUMÉ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Total des vérifications : ${TOTAL_CHECKS}${NC}"
echo -e "${GREEN}Services opérationnels  : ${PASSED_CHECKS}${NC}"
echo -e "${RED}Services défaillants    : ${FAILED_CHECKS}${NC}"

# Vérification Claude Code
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🤖 CLAUDE CODE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Vérifier Claude Code dans Backend
echo -e "${YELLOW}Backend :${NC}"
docker exec opsflux_backend which claude > /dev/null 2>&1 && \
    echo -e "${GREEN}   ✅ Claude Code installé${NC}" || \
    echo -e "${RED}   ❌ Claude Code non installé${NC}"

# Vérifier Claude Code dans Frontend
echo -e "${YELLOW}Frontend :${NC}"
docker exec opsflux_frontend which claude > /dev/null 2>&1 && \
    echo -e "${GREEN}   ✅ Claude Code installé${NC}" || \
    echo -e "${RED}   ❌ Claude Code non installé${NC}"

# Vérifier Claude Code dans Nginx
echo -e "${YELLOW}Nginx :${NC}"
docker exec opsflux_nginx which claude > /dev/null 2>&1 && \
    echo -e "${GREEN}   ✅ Claude Code installé${NC}" || \
    echo -e "${RED}   ❌ Claude Code non installé${NC}"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ${FAILED_CHECKS} -eq 0 ]; then
    echo -e "${GREEN}✅ Tous les services sont opérationnels !${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${RED}❌ Certains services sont défaillants${NC}"
    echo -e "${YELLOW}💡 Consultez les logs avec 'make logs'${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
