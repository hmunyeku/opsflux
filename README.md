```markdown
# 🚀 OPSFLUX - ERP Modulaire Intelligent

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)
[![Claude Code](https://img.shields.io/badge/Claude-Code-8B5CF6.svg)](https://docs.claude.com/)

OpsFlux est une plateforme ERP révolutionnaire qui centralise tous les flux métiers d'une entreprise avec une architecture modulaire extensible et une intelligence artificielle intégrée nativement via **Claude Code**.

---

## ✨ Fonctionnalités Principales

- 🧩 **Architecture Modulaire** - Modules métiers extensibles et marketplace
- 🤖 **IA Native avec Claude Code** - Développement assisté par IA dans chaque container
- 📱 **Progressive Web App** - Fonctionne 100% offline avec synchronisation
- 🔒 **Sécurité Enterprise** - SSO, LDAP, SAML, audit complet, RGPD
- 🌍 **Multi-tenant & Multi-site** - Gestion de plusieurs organisations
- 💱 **Multi-devise** - Conversion temps réel et historisation
- 📊 **Business Intelligence** - Analytics, prédictions, KPIs automatisés
- 🔗 **Intégrations** - API REST, Webhooks, external_id pour systèmes tiers

---

## 🏗️ Architecture

```
OpsFlux/
├── backend/        # Django REST API + Claude Code
├── frontend/       # React + UI5 Web Components + Claude Code
├── nginx/          # Reverse Proxy + Claude Code
├── postgres/       # Base de données PostgreSQL
├── redis/          # Cache et message broker
├── modules/        # Modules métiers installables
└── scripts/        # Scripts administration
```

### Stack Technique

| Composant | Technologie |
|-----------|-------------|
| **Backend** | Django 5.0 + Django REST Framework |
| **Frontend** | React 18 + UI5 Web Components |
| **Base de données** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Task Queue** | Celery + Redis |
| **Reverse Proxy** | Nginx |
| **Containerisation** | Docker + Docker Compose |
| **IA Development** | Claude Code (Anthropic) |

---

## 🚀 Installation Rapide

### Prérequis

- Docker 24+ et Docker Compose 2.20+
- Clé API Anthropic pour Claude Code
- 8 GB RAM minimum
- 20 GB espace disque

### Installation en 3 étapes

```bash
# 1. Cloner le repository
git clone https://github.com/votre-org/opsflux.git
cd opsflux

# 2. Initialiser et configurer
make init
# Éditer .env et configurer ANTHROPIC_API_KEY

# 3. Lancer l'installation complète
make quick-start
```

Votre plateforme est prête ! 🎉

- 📱 **Frontend**: http://localhost:3000
- 🔧 **Backend**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/api/docs
- 👤 **Admin**: http://localhost:8000/admin

---

## 🤖 Utiliser Claude Code

Claude Code est intégré dans **tous les containers** pour un développement assisté par IA.

### Lancer Claude Code

```bash
# Dans le container backend
make claude-backend

# Dans le container frontend
make claude-frontend

# Dans le container nginx
make claude-nginx

# Vérifier l'installation dans tous les containers
make claude-status
```

### Exemples d'utilisation

```bash
# Backend: Créer un nouveau modèle Django
$ make claude-backend
> Create a Django model for Product with fields: name, price, category

# Frontend: Créer un composant React
$ make claude-frontend
> Create a React component for displaying product list with filters

# Nginx: Optimiser la configuration
$ make claude-nginx
> Optimize nginx configuration for better performance
```

### Configuration Claude Code

La clé API est configurée automatiquement via la variable d'environnement `ANTHROPIC_API_KEY` dans `.env`.

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-api03-votre-cle-ici
```

---

## 📖 Commandes Make Disponibles

### Commandes Générales

| Commande | Description |
|----------|-------------|
| `make help` | Affiche toutes les commandes disponibles |
| `make init` | Initialise le projet (première fois) |
| `make build` | Construit les images Docker |
| `make up` | Démarre tous les services |
| `make down` | Arrête tous les services |
| `make restart` | Redémarre tous les services |
| `make logs` | Affiche les logs en temps réel |

### Commandes Claude Code

| Commande | Description |
|----------|-------------|
| `make claude-backend` | Lance Claude Code dans le backend |
| `make claude-frontend` | Lance Claude Code dans le frontend |
| `make claude-nginx` | Lance Claude Code dans nginx |
| `make claude-status` | Vérifie l'installation de Claude Code |

### Commandes Django

| Commande | Description |
|----------|-------------|
| `make migrate` | Applique les migrations |
| `make makemigrations` | Crée de nouvelles migrations |
| `make superuser` | Crée un superutilisateur |
| `make shell-django` | Ouvre le shell Django |

### Commandes Développement

| Commande | Description |
|----------|-------------|
| `make test` | Lance les tests |
| `make lint` | Vérifie le code |
| `make format` | Formate le code |
| `make shell-backend` | Shell dans le container backend |
| `make shell-frontend` | Shell dans le container frontend |

### Backup & Maintenance

| Commande | Description |
|----------|-------------|
| `make backup-db` | Sauvegarde la base de données |
| `make restore-db` | Restaure la base de données |
| `make clean` | Nettoie les fichiers temporaires |
| `make prune` | Nettoie Docker complètement |

---

## 🔧 Configuration

### Variables d'Environnement

Copiez `.env.example` vers `.env` et configurez:

```bash
# Obligatoire
ANTHROPIC_API_KEY=sk-ant-api03-votre-cle-ici
SECRET_KEY=votre-secret-key-django
POSTGRES_PASSWORD=votre-mot-de-passe-postgres

# Optionnel
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Ports par Défaut

- **Frontend**: 3000
- **Backend**: 8000
- **PostgreSQL**: 5432
- **Redis**: 6379
- **Nginx HTTP**: 80
- **Nginx HTTPS**: 443
- **PgAdmin**: 5050 (dev uniquement)

---

## 📚 Documentation

- [Guide d'Installation Détaillé](docs/installation.md)
- [Architecture Technique](docs/architecture.md)
- [Développement de Modules](docs/modules.md)
- [Guide Claude Code](docs/claude-code.md)
- [API Documentation](http://localhost:8000/api/docs)
- [Contribution](CONTRIBUTING.md)

---

## 🧪 Tests

```bash
# Tests unitaires
make test

# Tests avec coverage
make test-coverage

# Tests frontend
make shell-frontend
npm test
```

---

## 🛡️ Sécurité

OpsFlux respecte les standards de sécurité enterprise:

- ✅ RGPD compliant
- ✅ ISO 27001
- ✅ SOX
- ✅ HIPAA ready
- ✅ PCI DSS compatible

Voir [SECURITY.md](SECURITY.md) pour plus de détails.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 Licence

Copyright © 2024 OpsFlux Team. Tous droits réservés.

---

## 🆘 Support

- 📧 Email: support@opsflux.io
- 💬 Discord: [Rejoindre](https://discord.gg/opsflux)
- 📖 Documentation: [docs.opsflux.io](https://docs.opsflux.io)
- 🐛 Issues: [GitHub Issues](https://github.com/votre-org/opsflux/issues)

---

**Développé avec ❤️ par l'équipe OpsFlux, propulsé par Claude Code 🤖**
```
