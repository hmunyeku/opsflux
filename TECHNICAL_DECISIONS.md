# 🏗️ DÉCISIONS TECHNIQUES OPSFLUX

**Ce document trace toutes les décisions techniques importantes et leur justification.**

---

## 📋 INDEX

1. [Architecture Globale](#architecture-globale)
2. [Stack Technique](#stack-technique)
3. [Sécurité](#sécurité)
4. [Base de Données](#base-de-données)
5. [Frontend](#frontend)
6. [Backend](#backend)
7. [Infrastructure](#infrastructure)
8. [Conventions](#conventions)

---

## 🏛️ ARCHITECTURE GLOBALE

### Séparation Backend/Frontend Stricte
**Date :** 02 Oct 2025
**Décision :** Backend = 100% API REST, Frontend = Consommateur pur

**Justification :**
- ✅ Frontend interchangeable (mobile, desktop, web)
- ✅ Scalabilité indépendante
- ✅ Tests plus faciles
- ✅ Équipes peuvent travailler en parallèle
- ✅ Réutilisation API pour intégrations tierces

**Conséquences :**
- ⚠️ Pas de rendu côté serveur (SSR)
- ⚠️ Nécessite gestion CORS stricte
- ⚠️ Authentification via tokens (pas sessions)

**Alternatives considérées :**
- ❌ Monolithe Django avec templates → Rigide, difficile à tester
- ❌ Next.js SSR → Couplage trop fort, complexité accrue

---

### Architecture Modulaire
**Date :** 02 Oct 2025
**Décision :** Système de modules installables/désactivables

**Justification :**
- ✅ Extensibilité maximale
- ✅ Marketplace future
- ✅ Client paie uniquement modules utilisés
- ✅ Isolation des bugs
- ✅ Déploiements partiels possibles

**Structure module :**
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
├── install.py
└── uninstall.py
```

**Contraintes :**
- Chaque module doit déclarer ses dépendances
- Migrations gérées par module
- Hooks pour lifecycle events

---

## 💻 STACK TECHNIQUE

### Backend: Django REST Framework
**Date :** 02 Oct 2025
**Version :** Django 5.0 + DRF 3.14

**Justification :**
- ✅ Maturité et stabilité
- ✅ ORM puissant
- ✅ Admin Django pour debug
- ✅ Écosystème riche (Celery, Redis, etc.)
- ✅ Sécurité built-in (CSRF, XSS, SQL injection)
- ✅ Documentation excellente

**Alternatives considérées :**
- ❌ FastAPI → Manque maturité pour gros projets
- ❌ Flask → Trop minimaliste, beaucoup de code boilerplate
- ❌ Node.js/Express → Typage faible, moins structuré

---

### Frontend: React + UI5 Web Components
**Date :** 02 Oct 2025
**React :** v18
**UI5 :** v2.15.0

**Justification :**
- ✅ UI5 = Composants enterprise-grade SAP
- ✅ Design cohérent Fiori
- ✅ Accessibilité (WCAG 2.1)
- ✅ Thèmes built-in (clair/sombre)
- ✅ i18n natif
- ✅ React = Écosystème mature

**Alternatives considérées :**
- ❌ Vue.js → Moins adapté grandes applications
- ❌ Angular → Trop complexe, courbe apprentissage élevée
- ❌ Material-UI → Moins enterprise-grade que UI5

**Points d'attention :**
- ⚠️ UI5 Web Components ≠ React Components
- ⚠️ Événements gérés différemment
- ⚠️ Certains composants ont contraintes strictes (ex: ShellBar)

---

### Base de Données: PostgreSQL 16
**Date :** 02 Oct 2025

**Justification :**
- ✅ ACID complet
- ✅ JSONB pour données non structurées
- ✅ Full-text search natif
- ✅ Extensions (PostGIS, pgvector pour IA)
- ✅ Performances excellentes
- ✅ Open source

**Alternatives considérées :**
- ❌ MySQL → Moins de fonctionnalités avancées
- ❌ MongoDB → Pas de transactions ACID multi-documents
- ❌ SQLite → Pas adapté multi-utilisateurs

---

### Cache & Queues: Redis 7
**Date :** 02 Oct 2025

**Justification :**
- ✅ Cache haute performance
- ✅ Pub/Sub pour temps réel
- ✅ Broker Celery
- ✅ Sessions utilisateurs
- ✅ Rate limiting

**Usage :**
- Cache API responses
- Sessions actives
- Queue Celery tasks
- WebSocket pub/sub (futur)

---

### Tâches Asynchrones: Celery + Beat
**Date :** 02 Oct 2025

**Justification :**
- ✅ Tâches longues en background
- ✅ Scheduling (Beat)
- ✅ Retry automatique
- ✅ Monitoring (Flower)

**Cas d'usage :**
- Envoi emails
- Génération rapports
- Import/Export fichiers
- Synchronisation systèmes externes
- Backup automatique

---

## 🔒 SÉCURITÉ

### Authentification: JWT Stateless
**Date :** 03 Oct 2025

**Justification :**
- ✅ Stateless = Scalabilité horizontale
- ✅ Pas de stockage session serveur
- ✅ Adapté API REST
- ✅ Support mobile natif

**Configuration :**
- Access token : 15 minutes
- Refresh token : 7 jours
- Algorithm : HS256
- Rotation clés : Tous les 30 jours (prévu)

**Sécurité :**
- ✅ HTTPS obligatoire production
- ✅ Tokens en httpOnly cookies (prévu)
- ✅ CSRF protection
- ✅ Rate limiting login

**Alternatives considérées :**
- ❌ Sessions Django → Pas stateless, problème scaling
- ❌ OAuth2 pure → Trop complexe pour usage interne

---

### Hashage Passwords: bcrypt
**Date :** 03 Oct 2025
**Coût :** 12 rounds

**Justification :**
- ✅ Résistant brute force
- ✅ Salt automatique
- ✅ Standard industrie
- ✅ Adaptatif (augmentation coût futur)

**Alternatives considérées :**
- ❌ MD5/SHA1 → Cassables facilement
- ❌ Argon2 → Moins mature Python
- ⚠️ PBKDF2 → Par défaut Django mais bcrypt meilleur

---

### Rate Limiting
**Date :** 03 Oct 2025

**Limites définies :**
- Login : 5 tentatives / 15 min
- Change password : 3 tentatives / heure
- API générale : 1000 req / heure
- Upload fichiers : 10 / heure

**Implémentation :** Django-ratelimit + Redis

---

## 💾 BASE DE DONNÉES

### Champ `external_id` (eID) Obligatoire
**Date :** 02 Oct 2025

**Justification :**
- ✅ Intégration systèmes externes
- ✅ Synchronisation bidirectionnelle
- ✅ Import/Export données
- ✅ Migration depuis autres ERP

**Contrainte :**
- Tous les modèles principaux doivent avoir `external_id`
- Unique par modèle
- Indexé pour performances
- Nullable (généré si absent)

---

### Soft Delete Partout
**Date :** 02 Oct 2025

**Justification :**
- ✅ Audit trail complet
- ✅ Récupération données
- ✅ Conformité RGPD (droit à l'oubli avec hard delete après)
- ✅ Évite pertes accidentelles

**Implémentation :**
```python
class BaseModel(models.Model):
    deleted_at = models.DateTimeField(null=True, blank=True)

    def delete(self, hard=False):
        if hard:
            super().delete()
        else:
            self.deleted_at = timezone.now()
            self.save()
```

---

### Audit Trail Complet
**Date :** 02 Oct 2025

**Justification :**
- ✅ Conformité (SOX, ISO 27001)
- ✅ Traçabilité modifications
- ✅ Détection fraudes
- ✅ Debug facilité

**Champs trackés :**
- `created_at`, `updated_at`
- `created_by`, `updated_by`
- `deleted_at`, `deleted_by`
- Diff avant/après (JSON)

---

## 🎨 FRONTEND

### Pas de Logique Métier Frontend
**Date :** 02 Oct 2025

**Justification :**
- ✅ Sécurité (validation serveur = source vérité)
- ✅ Réutilisabilité (mobile, desktop)
- ✅ Tests simplifiés
- ✅ Maintenance facilitée

**Conséquence :**
- Frontend = Présentation + UX uniquement
- Toute validation critique côté backend
- Frontend peut dupliquer validation pour UX

---

### Gestion État: Context API (pour l'instant)
**Date :** 03 Oct 2025

**Justification :**
- ✅ Built-in React
- ✅ Suffisant pour taille actuelle
- ✅ Pas de dépendance externe

**Migration prévue vers Redux si :**
- Application dépasse 50 composants
- État devient trop complexe
- Performance impactée

---

### Stockage Tokens: localStorage
**Date :** 03 Oct 2025
**Temporaire :** Migration vers httpOnly cookies prévue

**Justification actuelle :**
- ✅ Simple à implémenter
- ✅ Fonctionne SPA
- ⚠️ Vulnérable XSS

**Migration prévue :**
- Tokens en httpOnly cookies
- CSRF protection renforcée
- SameSite=Strict

---

## 🔧 BACKEND

### API REST 100% (pas GraphQL)
**Date :** 02 Oct 2025

**Justification :**
- ✅ Plus simple à implémenter
- ✅ Plus simple à débugger
- ✅ Meilleur support outils (Postman, Swagger)
- ✅ Cache HTTP natif

**Alternatives considérées :**
- ❌ GraphQL → Over-engineering pour besoin actuel
- ❌ gRPC → Pas adapté web browser

---

### Documentation API: OpenAPI/Swagger
**Date :** 02 Oct 2025
**Outil :** drf-spectacular

**Justification :**
- ✅ Génération automatique depuis code
- ✅ UI interactive (Swagger UI)
- ✅ Génération clients SDK
- ✅ Standard industrie

**URL :** `/api/schema/swagger-ui/`

---

### Serialization: DRF Serializers
**Date :** 02 Oct 2025

**Justification :**
- ✅ Validation built-in
- ✅ Relations complexes gérées
- ✅ Customisation facile
- ✅ Intégration parfaite DRF

**Alternatives considérées :**
- ❌ Marshmallow → Redondant avec DRF
- ❌ Pydantic → Pas d'intégration Django ORM

---

## 🐳 INFRASTRUCTURE

### Conteneurisation: Docker Compose
**Date :** 02 Oct 2025

**Justification :**
- ✅ Environnements identiques (dev/prod)
- ✅ Isolation services
- ✅ Scalabilité facile
- ✅ Déploiement simplifié

**Services :**
- PostgreSQL 16
- Redis 7
- Backend Django
- Frontend React
- Celery Worker + Beat
- Nginx
- Web vitrine

---

### Reverse Proxy: Nginx
**Date :** 02 Oct 2025

**Justification :**
- ✅ Performances excellentes
- ✅ SSL/TLS termination
- ✅ Load balancing (futur)
- ✅ Compression gzip
- ✅ Cache statique

**Configuration :**
- `app.opsflux.io` → Frontend
- `api.opsflux.io` → Backend API
- `server.opsflux.io` → Admin backend
- `www.opsflux.io` → Site vitrine

---

### Déploiement: Dokploy
**Date :** 02 Oct 2025

**Justification :**
- ✅ CI/CD automatique
- ✅ Gestion certificats SSL
- ✅ Interface UI simple
- ✅ Logs centralisés
- ✅ Rollback facile

**Workflow :**
1. Git push → GitHub
2. Webhook → Dokploy
3. Build images Docker
4. Deploy containers
5. Health checks
6. Rollback si échec

---

## 📝 CONVENTIONS

### Code
**Date :** 02 Oct 2025

**Règles :**
- Code commenté en français
- Variables/fonctions en anglais
- PEP 8 pour Python
- ESLint + Prettier pour JS/React
- Type hints Python (progressif)

**Justification :**
- ✅ Équipe francophone
- ✅ Variables anglais = Standard international
- ✅ Maintenabilité long terme

---

### Git Commits
**Date :** 02 Oct 2025

**Format :**
```
Scope: Description courte

Description longue (optionnelle)

Fonctionnalités:
- Bullet points

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Scopes :**
- Backend, Frontend, Web, Infra, Docs, Fix, Refactor

**Justification :**
- ✅ Historique clair
- ✅ Transparence collaboration IA
- ✅ Traçabilité

---

### Tests
**Date :** 02 Oct 2025
**État :** À implémenter

**Stratégie prévue :**
- Tests unitaires : 80% couverture minimum
- Tests intégration : Endpoints API
- Tests E2E : Parcours utilisateur critiques
- CI : Tests automatiques sur push

**Outils :**
- Backend : pytest + pytest-django
- Frontend : Jest + React Testing Library
- E2E : Playwright (prévu)

---

## 🔄 RÉVISIONS PRÉVUES

### Court Terme
- [ ] Migration tokens vers httpOnly cookies
- [ ] Implémentation tests unitaires
- [ ] Type hints Python complets

### Moyen Terme
- [ ] Évaluation Redux vs Context API
- [ ] WebSockets pour temps réel
- [ ] Cache stratégies avancées

### Long Terme
- [ ] Microservices (si scaling nécessaire)
- [ ] Kubernetes (si multi-tenant)
- [ ] GraphQL (si clients mobiles complexes)

---

**Dernière mise à jour :** 04 Octobre 2025
**Maintenu par :** Équipe Dev + Claude
**Version :** 1.0
