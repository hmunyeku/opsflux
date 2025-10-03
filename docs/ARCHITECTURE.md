# 🏗️ ARCHITECTURE OPSFLUX

## Vue d'ensemble

OpsFlux suit une architecture **API-First** avec séparation stricte backend/frontend et une approche modulaire extensible.

---

## 📐 Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                        UTILISATEURS                          │
│                    (Web Browser / Mobile)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      NGINX (Reverse Proxy)                   │
│                     SSL/TLS Termination                      │
└──────┬────────────────────────────┬─────────────────────────┘
       │                            │
       ▼                            ▼
┌─────────────────┐        ┌──────────────────────────┐
│  FRONTEND       │        │  BACKEND API             │
│  (React + UI5)  │───────▶│  (Django + DRF)          │
│  Port 3001      │  HTTP  │  Port 8000               │
└─────────────────┘        └──────────┬───────────────┘
                                      │
              ┌───────────────────────┼───────────────────┐
              │                       │                   │
              ▼                       ▼                   ▼
      ┌──────────────┐      ┌─────────────┐     ┌──────────────┐
      │ PostgreSQL   │      │   Redis     │     │ Celery       │
      │ (Database)   │      │   (Cache)   │     │ Worker/Beat  │
      │ Port 5432    │      │  Port 6379  │     │              │
      └──────────────┘      └─────────────┘     └──────────────┘
```

---

## 🔧 Composants

### Backend (Django)

**Responsabilités :**
- Logique métier complète
- Gestion authentification/autorisations
- Validation données
- Accès base de données
- Tâches asynchrones
- Audit trail
- API REST documentation

**Structure :**
```
backend/
├── config/
│   ├── settings/
│   │   ├── base.py           # Configuration commune
│   │   ├── development.py    # Config dev
│   │   └── production.py     # Config prod
│   ├── urls.py               # Routes principales
│   └── wsgi.py / asgi.py     # Serveur
├── apps/
│   ├── core/                 # Fonctionnalités core
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── permissions.py
│   │   ├── middleware.py
│   │   └── utils.py
│   └── users/                # Gestion utilisateurs
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       └── permissions.py
└── modules/                  # Modules métiers (futur)
```

### Frontend (React)

**Responsabilités :**
- Présentation uniquement
- Consommation API
- Gestion état local (formulaires, navigation)
- Validation côté client (UX)
- Routing

**Structure :**
```
frontend/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── pages/              # Pages principales
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── components/         # Composants réutilisables
│   ├── services/           # Appels API
│   ├── hooks/              # React hooks custom
│   ├── context/            # Context API
│   ├── utils/              # Utilitaires
│   ├── App.js
│   └── index.js
└── package.json
```

### Database (PostgreSQL)

**Choix :**
- Robustesse entreprise
- Support JSON (pour flexibilité)
- Transactions ACID
- Performances excellentes
- Extensions (PostGIS, etc.)

**Conventions :**
- Champ `eid` (external_id) sur chaque table
- Soft delete (`is_deleted`, `deleted_at`)
- Audit fields (`created_at`, `updated_at`, `created_by`, `updated_by`)
- Timestamps avec timezone

### Cache (Redis)

**Utilisation :**
- Sessions utilisateurs
- Cache permissions
- Cache requêtes fréquentes
- Queue Celery
- Rate limiting

### Tasks (Celery)

**Utilisation :**
- Envoi emails
- Génération rapports
- Traitements lourds
- Synchronisations externes
- Nettoyages périodiques

---

## 🔐 Sécurité

### Authentification
- JWT (Access + Refresh tokens)
- Expiration courte (15min access)
- Refresh sécurisé (7 jours)
- Révocation possible

### Autorisations
- RBAC (Role-Based Access Control)
- Permissions granulaires
- Vérification à chaque requête
- Cache avec invalidation

### Protection
- HTTPS obligatoire
- CORS configuré
- CSRF protection
- Rate limiting
- SQL Injection (ORM Django)
- XSS (sanitization)

---

## 📊 Flux de Données

### Authentification
```
User → Frontend → POST /api/users/auth/login/
                → Backend (validate credentials)
                → PostgreSQL (check user)
                → Backend (generate JWT)
                → Frontend (store tokens)
                → Redirect Dashboard
```

### Requête Authentifiée
```
User → Frontend (add Authorization: Bearer {token})
     → Backend (verify JWT)
     → Backend (check permissions)
     → Backend (execute logic)
     → PostgreSQL (query data)
     → Backend (serialize response)
     → Frontend (display data)
```

### Audit Trail
```
Action → Middleware (capture request)
       → Execute action
       → Middleware (capture response)
       → AuditLog (save to DB)
       → [Optional] Alert if suspicious
```

---

## 🔄 CI/CD

```
Developer → Git Push → GitHub
                     → Webhook Dokploy
                     → Pull latest code
                     → Build Docker images
                     → Run migrations
                     → Restart services
                     → Health checks
                     → Deploy complete ✓
```

---

## 📈 Scalabilité

### Horizontale
- Backend : Multiple instances derrière load balancer
- Frontend : CDN pour assets statiques
- Database : Read replicas
- Redis : Cluster mode
- Celery : Multiple workers

### Verticale
- Database : Augmenter RAM/CPU
- Backend : Augmenter workers Gunicorn
- Redis : Augmenter mémoire

---

## 🔌 Extensibilité

### Modules
Chaque module suit la même structure :
```
module_name/
├── backend/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── frontend/
│   └── components/
├── metadata.json
└── migrations/
```

### Hooks & Triggers
Le système core fournit :
- Pre/Post save hooks
- Pre/Post delete hooks
- Custom signals
- Event bus (Redis pub/sub)

---

**Dernière mise à jour :** 03 Octobre 2025
