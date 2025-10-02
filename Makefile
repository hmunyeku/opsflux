# ============================================
# OPSFLUX - MAKEFILE avec CLAUDE CODE
# ============================================

.PHONY: help init build up down restart logs shell claude-backend claude-frontend claude-nginx clean test backup

# Variables
COMPOSE = docker-compose
COMPOSE_DEV = docker-compose --profile dev
BACKEND_CONTAINER = opsflux_backend
FRONTEND_CONTAINER = opsflux_frontend
NGINX_CONTAINER = opsflux_nginx
POSTGRES_CONTAINER = opsflux_postgres

# Couleurs pour l'affichage
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

help: ## Affiche l'aide
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)  OPSFLUX - Commandes disponibles$(NC)"
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-25s$(NC) %s\n", $$1, $$2}'
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"

init: ## Initialise le projet (première installation)
	@echo "$(GREEN)🚀 Initialisation du projet OpsFlux...$(NC)"
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(YELLOW)⚠️  Fichier .env créé. Veuillez configurer ANTHROPIC_API_KEY !$(NC)"; \
	fi
	@mkdir -p logs/{backend,frontend,nginx,postgres}
	@mkdir -p backups/{database,media}
	@mkdir -p postgres/backup nginx/ssl
	@chmod +x scripts/*.sh backend/entrypoint.sh backend/wait-for-it.sh
	@echo "$(GREEN)✅ Initialisation terminée$(NC)"
	@echo "$(YELLOW)🔑 N'oubliez pas de configurer votre ANTHROPIC_API_KEY dans .env$(NC)"

build: ## Construit les images Docker
	@echo "$(GREEN)🔨 Construction des images Docker...$(NC)"
	$(COMPOSE) build --parallel

build-no-cache: ## Construit les images sans cache
	@echo "$(GREEN)🔨 Construction des images sans cache...$(NC)"
	$(COMPOSE) build --no-cache --parallel

up: ## Démarre tous les services
	@echo "$(GREEN)🚀 Démarrage des services OpsFlux...$(NC)"
	$(COMPOSE) up -d
	@echo "$(GREEN)✅ Services démarrés$(NC)"
	@echo "$(YELLOW)📱 Frontend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)🔧 Backend: http://localhost:8000$(NC)"
	@echo "$(YELLOW)📚 API Docs: http://localhost:8000/api/docs$(NC)"

up-dev: ## Démarre tous les services incluant PgAdmin
	@echo "$(GREEN)🚀 Démarrage des services OpsFlux (mode développement)...$(NC)"
	$(COMPOSE_DEV) up -d
	@echo "$(GREEN)✅ Services démarrés$(NC)"
	@echo "$(YELLOW)📱 Frontend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)🔧 Backend: http://localhost:8000$(NC)"
	@echo "$(YELLOW)📚 API Docs: http://localhost:8000/api/docs$(NC)"
	@echo "$(YELLOW)🗄️  PgAdmin: http://localhost:5050$(NC)"

down: ## Arrête tous les services
	@echo "$(RED)🛑 Arrêt des services...$(NC)"
	$(COMPOSE) down

down-volumes: ## Arrête et supprime tous les volumes
	@echo "$(RED)🛑 Arrêt des services et suppression des volumes...$(NC)"
	$(COMPOSE) down -v

restart: down up ## Redémarre tous les services

logs: ## Affiche les logs de tous les services
	$(COMPOSE) logs -f

logs-backend: ## Affiche les logs du backend
	$(COMPOSE) logs -f backend

logs-frontend: ## Affiche les logs du frontend
	$(COMPOSE) logs -f frontend

logs-nginx: ## Affiche les logs de nginx
	$(COMPOSE) logs -f nginx

shell-backend: ## Ouvre un shell dans le container backend
	@echo "$(GREEN)🐚 Shell Backend...$(NC)"
	$(COMPOSE) exec backend /bin/bash

shell-frontend: ## Ouvre un shell dans le container frontend
	@echo "$(GREEN)🐚 Shell Frontend...$(NC)"
	$(COMPOSE) exec frontend /bin/bash

shell-nginx: ## Ouvre un shell dans le container nginx
	@echo "$(GREEN)🐚 Shell Nginx...$(NC)"
	$(COMPOSE) exec nginx /bin/bash

shell-db: ## Ouvre un shell PostgreSQL
	@echo "$(GREEN)🐚 Shell PostgreSQL...$(NC)"
	$(COMPOSE) exec postgres psql -U opsflux_user -d opsflux

# ============================================
# COMMANDES CLAUDE CODE
# ============================================

claude-backend: ## Lance Claude Code dans le container backend
	@echo "$(GREEN)🤖 Lancement de Claude Code dans Backend...$(NC)"
	@echo "$(YELLOW)Utilisez 'exit' ou Ctrl+D pour quitter$(NC)"
	$(COMPOSE) exec backend claude

claude-frontend: ## Lance Claude Code dans le container frontend
	@echo "$(GREEN)🤖 Lancement de Claude Code dans Frontend...$(NC)"
	@echo "$(YELLOW)Utilisez 'exit' ou Ctrl+D pour quitter$(NC)"
	$(COMPOSE) exec frontend claude

claude-nginx: ## Lance Claude Code dans le container nginx
	@echo "$(GREEN)🤖 Lancement de Claude Code dans Nginx...$(NC)"
	@echo "$(YELLOW)Utilisez 'exit' ou Ctrl+D pour quitter$(NC)"
	$(COMPOSE) exec nginx claude

claude-celery: ## Lance Claude Code dans le container celery
	@echo "$(GREEN)🤖 Lancement de Claude Code dans Celery Worker...$(NC)"
	@echo "$(YELLOW)Utilisez 'exit' ou Ctrl+D pour quitter$(NC)"
	$(COMPOSE) exec celery_worker claude

claude-status: ## Vérifie si Claude Code est installé dans tous les containers
	@echo "$(GREEN)🔍 Vérification Claude Code...$(NC)"
	@echo "$(YELLOW)Backend:$(NC)"
	@$(COMPOSE) exec backend which claude || echo "$(RED)❌ Non installé$(NC)"
	@echo "$(YELLOW)Frontend:$(NC)"
	@$(COMPOSE) exec frontend which claude || echo "$(RED)❌ Non installé$(NC)"
	@echo "$(YELLOW)Nginx:$(NC)"
	@$(COMPOSE) exec nginx which claude || echo "$(RED)❌ Non installé$(NC)"

# ============================================
# COMMANDES DJANGO
# ============================================

migrate: ## Applique les migrations Django
	@echo "$(GREEN)🔄 Application des migrations...$(NC)"
	$(COMPOSE) exec backend python manage.py migrate

makemigrations: ## Crée les migrations Django
	@echo "$(GREEN)📝 Création des migrations...$(NC)"
	$(COMPOSE) exec backend python manage.py makemigrations

superuser: ## Crée un superutilisateur Django
	@echo "$(GREEN)👤 Création d'un superutilisateur...$(NC)"
	$(COMPOSE) exec backend python manage.py createsuperuser

collectstatic: ## Collecte les fichiers statiques
	@echo "$(GREEN)📦 Collecte des fichiers statiques...$(NC)"
	$(COMPOSE) exec backend python manage.py collectstatic --noinput

shell-django: ## Ouvre le shell Django
	@echo "$(GREEN)🐍 Shell Django...$(NC)"
	$(COMPOSE) exec backend python manage.py shell

# ============================================
# TESTS
# ============================================

test: ## Lance les tests backend
	@echo "$(GREEN)🧪 Lancement des tests...$(NC)"
	$(COMPOSE) exec backend pytest

test-coverage: ## Lance les tests avec coverage
	@echo "$(GREEN)🧪 Lancement des tests avec coverage...$(NC)"
	$(COMPOSE) exec backend pytest --cov=. --cov-report=html

lint: ## Vérifie le code avec flake8 et black
	@echo "$(GREEN)🔍 Vérification du code...$(NC)"
	$(COMPOSE) exec backend black --check .
	$(COMPOSE) exec backend flake8 .

format: ## Formate le code avec black
	@echo "$(GREEN)✨ Formatage du code...$(NC)"
	$(COMPOSE) exec backend black .

# ============================================
# BACKUP & RESTORE
# ============================================

backup-db: ## Sauvegarde la base de données
	@echo "$(GREEN)💾 Sauvegarde de la base de données...$(NC)"
	@./scripts/backup-db.sh

restore-db: ## Restaure la base de données
	@echo "$(YELLOW)⚠️  Cette opération va écraser la base actuelle !$(NC)"
	@read -p "Êtes-vous sûr ? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		./scripts/restore-db.sh; \
	fi

# ============================================
# NETTOYAGE
# ============================================

clean: ## Nettoie les fichiers temporaires
	@echo "$(GREEN)🧹 Nettoyage...$(NC)"
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name ".DS_Store" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true

clean-logs: ## Supprime tous les logs
	@echo "$(RED)🗑️  Suppression des logs...$(NC)"
	rm -rf logs/*/*.log

prune: ## Nettoie Docker (images, volumes non utilisés)
	@echo "$(RED)🗑️  Nettoyage Docker...$(NC)"
	docker system prune -af --volumes

# ============================================
# STATUS & MONITORING
# ============================================

status: ## Affiche le statut des services
	@echo "$(GREEN)📊 Statut des services OpsFlux$(NC)"
	@$(COMPOSE) ps

health: ## Vérifie la santé des services
	@echo "$(GREEN)🏥 Vérification de la santé des services...$(NC)"
	@./scripts/health-check.sh

stats: ## Affiche les statistiques des containers
	@echo "$(GREEN)📈 Statistiques des containers$(NC)"
	docker stats --no-stream

# ============================================
# INSTALLATION RAPIDE
# ============================================

quick-start: init build up migrate superuser ## Installation complète et démarrage
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)✅ OpsFlux est prêt !$(NC)"
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(YELLOW)📱 Frontend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)🔧 Backend: http://localhost:8000$(NC)"
	@echo "$(YELLOW)📚 API Docs: http://localhost:8000/api/docs$(NC)"
	@echo "$(YELLOW)👤 Admin: http://localhost:8000/admin$(NC)"
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
