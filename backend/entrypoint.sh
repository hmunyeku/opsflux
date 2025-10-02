#!/bin/bash
# ============================================
# OPSFLUX BACKEND - ENTRYPOINT
# ============================================

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  OPSFLUX BACKEND - DÉMARRAGE${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Fonction d'attente pour PostgreSQL
wait_for_postgres() {
    echo -e "${YELLOW}⏳ Attente de PostgreSQL...${NC}"
    
    until pg_isready -h postgres -U ${POSTGRES_USER:-opsflux_user} -d ${POSTGRES_DB:-opsflux} > /dev/null 2>&1; do
        echo -e "${YELLOW}⏳ PostgreSQL non disponible - nouvelle tentative dans 2s...${NC}"
        sleep 2
    done
    
    echo -e "${GREEN}✅ PostgreSQL est prêt !${NC}"
}

# Fonction d'attente pour Redis
wait_for_redis() {
    echo -e "${YELLOW}⏳ Attente de Redis...${NC}"
    
    until nc -z redis 6379 > /dev/null 2>&1; do
        echo -e "${YELLOW}⏳ Redis non disponible - nouvelle tentative dans 2s...${NC}"
        sleep 2
    done
    
    echo -e "${GREEN}✅ Redis est prêt !${NC}"
}

# Fonction de vérification Claude Code
check_claude_code() {
    echo -e "${YELLOW}🤖 Vérification de Claude Code...${NC}"
    
    if command -v claude &> /dev/null; then
        echo -e "${GREEN}✅ Claude Code installé et disponible${NC}"
        claude --version || echo -e "${YELLOW}⚠️  Version non disponible${NC}"
    else
        echo -e "${RED}❌ Claude Code non installé${NC}"
    fi
}

# Attendre les services dépendants
wait_for_postgres
wait_for_redis

# Vérifier Claude Code
check_claude_code

# Appliquer les migrations si en mode développement
if [ "$ENVIRONMENT" = "development" ] || [ "$DEBUG" = "True" ]; then
    echo -e "${YELLOW}📝 Création des migrations Django...${NC}"
    python manage.py makemigrations --noinput
    echo -e "${GREEN}✅ Migrations créées${NC}"

    echo -e "${YELLOW}🔄 Application des migrations Django...${NC}"
    python manage.py migrate --noinput || {
        echo -e "${RED}❌ Erreur lors des migrations${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ Migrations appliquées${NC}"
    
    # Collecter les fichiers statiques
    echo -e "${YELLOW}📦 Collection des fichiers statiques...${NC}"
    python manage.py collectstatic --noinput --clear || {
        echo -e "${YELLOW}⚠️  Attention lors de la collection des statiques${NC}"
    }
    echo -e "${GREEN}✅ Fichiers statiques collectés${NC}"
    
    # Créer les répertoires nécessaires
    echo -e "${YELLOW}📁 Création des répertoires...${NC}"
    mkdir -p logs media staticfiles
    echo -e "${GREEN}✅ Répertoires créés${NC}"
fi

# Vérifier la santé de l'application
echo -e "${YELLOW}🏥 Vérification de la configuration Django...${NC}"
python manage.py check --deploy || {
    echo -e "${YELLOW}⚠️  Avertissements de configuration détectés${NC}"
}

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🚀 DÉMARRAGE DE L'APPLICATION${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📚 Documentation API: http://localhost:8000/api/docs${NC}"
echo -e "${YELLOW}🤖 Claude Code: Tapez 'claude' dans le terminal${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Exécuter la commande passée en paramètre
exec "$@"
