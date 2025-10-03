# 🗺️ ROADMAP OPSFLUX

**Projet :** OpsFlux - Plateforme Entreprise Intelligente
**Démarrage :** 3 Octobre 2025
**Équipe :** Développement avec assistance IA Claude

---

## 📊 **ÉTAT GLOBAL DU PROJET**

| Phase | État | Progression | Date Début | Date Fin |
|-------|------|-------------|------------|----------|
| **Phase 0 - Infrastructure** | ✅ Terminé | 100% | 02/10/2025 | 03/10/2025 |
| **Phase 1 - Authentification Base** | ✅ Terminé | 100% | 03/10/2025 | 03/10/2025 |
| **Phase 2 - Gestion Utilisateurs** | 🚧 En cours | 0% | 03/10/2025 | - |
| **Phase 3 - Rôles & Permissions** | ⏳ À venir | 0% | - | - |
| **Phase 4 - Audit & Logs** | ⏳ À venir | 0% | - | - |
| **Phase 5 - Groupes** | ⏳ À venir | 0% | - | - |

**Légende :** ✅ Terminé | 🚧 En cours | ⏳ À venir | ⏸️ En pause | ❌ Abandonné

---

## 🎯 **OBJECTIFS STRATEGIQUES**

### Vision Produit
OpsFlux est une plateforme entreprise modulaire et intelligente qui centralise tous les flux métiers d'une organisation avec une architecture extensible et une intelligence artificielle intégrée nativement.

### Objectifs Court Terme (Q4 2025)
- ✅ Infrastructure Docker + Dokploy opérationnelle
- ✅ Authentification JWT fonctionnelle
- 🚧 Système complet de gestion utilisateurs, rôles et permissions
- ⏳ Système d'audit et logs
- ⏳ Premier module métier fonctionnel

### Objectifs Long Terme (2026)
- Marketplace de modules
- Intégration IA multi-providers
- Mode offline avec synchronisation
- Multi-tenant complet
- Conformité RGPD, ISO 27001, SOX

---

## 📦 **FONCTIONNALITÉS DÉVELOPPÉES**

### ✅ **PHASE 0 - INFRASTRUCTURE** (02-03 Oct 2025)

#### Infrastructure Docker
- **Description :** Configuration complète Docker Compose multi-services
- **Services :**
  - PostgreSQL 16 (base de données)
  - Redis 7 (cache et queues)
  - Django Backend (API REST)
  - React Frontend (UI5 Web Components)
  - Celery Worker + Beat (tâches asynchrones)
  - Nginx (reverse proxy)
  - Site web vitrine
- **Volumes :** Persistance données avec volumes nommés
- **Réseaux :** Isolation réseau avec dokploy-network et opsflux_network
- **Healthchecks :** Monitoring santé des services
- **Statut :** ✅ Opérationnel
- **Commit :** `initial setup`

#### Déploiement Dokploy
- **Description :** Configuration déploiement continu via Dokploy
- **Domaine :** opsflux.io
- **SSL :** Let's Encrypt automatique
- **CI/CD :** Push GitHub → Auto-deploy
- **Variables d'environnement :** Gestion centralisée via .env
- **Statut :** ✅ Opérationnel

---

### ✅ **PHASE 1 - AUTHENTIFICATION BASE** (03 Oct 2025)

#### Login JWT
- **Description :** Système d'authentification par tokens JWT
- **Backend :**
  - Endpoint : `POST /api/users/auth/login/`
  - Tokens : Access (15min) + Refresh (7 jours)
  - Hashage : bcrypt
  - Validation : Email + password
- **Frontend :**
  - Page login avec UI5 Web Components
  - Gestion erreurs et loading states
  - Stockage tokens en localStorage
  - Auto-redirection si authentifié
- **Sécurité :**
  - Protection CSRF
  - Rate limiting
  - Validation côté serveur
- **Fichiers :**
  - `backend/apps/users/views.py`
  - `frontend/src/pages/Login.jsx`
- **Statut :** ✅ Fonctionnel
- **Commit :** `67c1c58`

#### Dashboard Base
- **Description :** Interface principale après connexion
- **Fonctionnalités :**
  - ShellBar avec profil utilisateur
  - Navigation latérale
  - Bouton déconnexion (ShellBarItem)
  - Cartes statistiques
  - Actions rapides
- **Protection :** Route privée (PrivateRoute)
- **UI5 Components :**
  - ShellBar, ShellBarItem
  - SideNavigation, SideNavigationItem
  - Card, CardHeader
  - Avatar, Button, Icon
- **Fichiers :**
  - `frontend/src/pages/Dashboard.jsx`
  - `frontend/src/App.js`
- **Statut :** ✅ Fonctionnel
- **Commit :** `f101b59`

#### Corrections Compatibilité UI5
- **Description :** Résolution conflits React vs Web Components
- **Problèmes résolus :**
  - ❌ "Converting circular structure to JSON" → Composants natifs (span/div)
  - ❌ "shellbarItem.fireClickEvent is not a function" → ShellBarItem
  - ❌ Bouton Submit non fonctionnel → onClick au lieu de type="submit"
  - ❌ URL API incorrecte → `/api/users/auth/login/`
- **Apprentissage :**
  - UI5 Web Components != React Components
  - ShellBar n'accepte que ShellBarItem comme enfants
  - Éviter composant Text dans structures UI5
  - Utiliser composants HTML natifs quand possible
- **Statut :** ✅ Résolu
- **Commit :** `67c1c58`

---

## 🚧 **PHASE 2 - GESTION UTILISATEURS** (En cours)

### Objectifs
- [ ] Mon profil (consultation + édition)
- [ ] Changement mot de passe
- [ ] Gestion photo de profil
- [ ] Préférences utilisateur
- [ ] 2FA (SMS + App mobile)
- [ ] Sessions actives
- [ ] Liste utilisateurs (admin)
- [ ] CRUD utilisateurs
- [ ] Activation/Désactivation comptes
- [ ] Validation email obligatoire

### Spécifications Validées
- **2FA :** SMS + Application mobile (Google Authenticator, Authy)
- **Validation email :** Obligatoire pour tous les comptes
- **Notifications :** Email + Push navigateur (via système core)
- **Multi-langue :** Prévu pour plus tard
- **LDAP/AD :** Synchronisation prévue pour plus tard

---

## ⏳ **PHASE 3 - RÔLES & PERMISSIONS** (À venir)

### Objectifs
- [ ] Modèle de permissions granulaires
- [ ] CRUD rôles
- [ ] Rôles système prédéfinis
- [ ] Assignation rôles aux utilisateurs
- [ ] Vérification permissions (decorator backend)
- [ ] Cache permissions (Redis)
- [ ] Interface gestion permissions

### Structure Permissions
Format : `<module>.<action>.<scope>`
- Niveaux : `all`, `team`, `own`, `any`
- Exemples : `users.view.all`, `users.edit.own`, `roles.create.any`

---

## ⏳ **PHASE 4 - AUDIT & LOGS** (À venir)

### Objectifs
- [ ] Audit trail complet
- [ ] Logs authentification
- [ ] Logs actions CRUD
- [ ] Diff avant/après
- [ ] Interface consultation logs
- [ ] Filtres avancés
- [ ] Export logs
- [ ] Statistiques
- [ ] Alertes configurables
- [ ] Rétention : 90 jours par défaut
- [ ] Archivage automatique

---

## ⏳ **PHASE 5 - GROUPES** (À venir)

### Objectifs
- [ ] CRUD groupes
- [ ] Groupes hiérarchiques
- [ ] Assignation membres
- [ ] Héritage permissions via groupes
- [ ] Synchronisation LDAP/AD (phase ultérieure)

---

## 🔧 **STACK TECHNIQUE**

### Backend
- **Framework :** Django 5.0 + Django REST Framework
- **Base de données :** PostgreSQL 16
- **Cache :** Redis 7
- **Tasks async :** Celery + Beat
- **Auth :** JWT (djangorestframework-simplejwt)
- **API Doc :** drf-spectacular (OpenAPI/Swagger)

### Frontend
- **Framework :** React 18
- **UI Library :** SAP UI5 Web Components
- **Routing :** React Router 6
- **HTTP Client :** Axios / Fetch API
- **Build :** Create React App (Webpack)

### Infrastructure
- **Conteneurisation :** Docker + Docker Compose
- **Orchestration :** Dokploy
- **Proxy :** Nginx
- **SSL :** Let's Encrypt
- **CI/CD :** GitHub → Dokploy auto-deploy

---

## 📈 **MÉTRIQUES**

### Temps Développement
- **Phase 0 :** 6 heures (infrastructure)
- **Phase 1 :** 8 heures (auth + corrections)
- **Total :** 14 heures

### Commits
- **Total :** 4 commits
- **Dernier :** `f101b59` - Nettoyage Dashboard

### Services
- **Total :** 8 services Docker
- **Healthy :** 5/8 (63%)
- **Fonctionnels :** 8/8 (100%)

---

## 🐛 **PROBLÈMES CONNUS**

### Healthchecks Docker
- **Services concernés :** Backend, Celery Worker, Celery Beat, Web
- **État :** Unhealthy mais fonctionnels
- **Impact :** Aucun (problème cosmétique)
- **Priorité :** Basse
- **Action :** À corriger lors de l'optimisation

### PostgreSQL Password
- **Problème :** Mot de passe avec caractères spéciaux (`/`, `=`)
- **Impact :** Potentielles erreurs lors de réinitialisations
- **État :** Workaround en place
- **Action :** À corriger dans variables Dokploy

---

## 📝 **DÉCISIONS TECHNIQUES**

### Architecture
- ✅ Backend = Logique métier complète
- ✅ Frontend = Présentation pure (consomme API)
- ✅ API REST 100% (pas de logique dans templates)
- ✅ JWT stateless pour auth
- ✅ Soft delete sur tous les modèles

### Conventions Code
- ✅ Code commenté en français
- ✅ Variables/fonctions en anglais
- ✅ Commits en français, professionnels
- ✅ Messages de commit : format standard (pas de mention IA)

### Sécurité
- ✅ HTTPS obligatoire (production)
- ✅ CORS configuré strictement
- ✅ Validation données côté backend ET frontend
- ✅ Hashage bcrypt (coût 12)
- ✅ Rate limiting sur endpoints sensibles

---

## 🔜 **PROCHAINES ÉTAPES**

### Immédiat (Cette semaine)
1. 📝 Créer la documentation technique complète
2. 🔨 Développer backend gestion utilisateurs
3. 🎨 Développer frontend "Mon profil"
4. 🔐 Implémenter 2FA (SMS + App)
5. ✅ Tests unitaires backend

### Court terme (2 semaines)
1. CRUD utilisateurs complet
2. Système rôles et permissions
3. Audit logs
4. Groupes utilisateurs
5. Documentation API complète

### Moyen terme (1 mois)
1. Premier module métier
2. Système de notifications (hooks & triggers)
3. Tableau de bord analytics
4. Tests end-to-end
5. Optimisation performances

---

## 📚 **DOCUMENTATION**

### Disponible
- ✅ README.md (overview projet)
- ✅ CLAUDE.md (instructions développement)
- ✅ ROADMAP.md (ce document)

### À créer
- ⏳ ARCHITECTURE.md (diagrammes + explications)
- ⏳ API.md (documentation endpoints)
- ⏳ DEPLOYMENT.md (guide déploiement)
- ⏳ DEVELOPMENT.md (guide contributeurs)
- ⏳ SECURITY.md (politiques sécurité)

---

## 🤝 **CONTRIBUTEURS**

- **Product Owner :** @hmunyeku
- **Développement :** @hmunyeku + Claude (Anthropic)
- **Infrastructure :** Dokploy

---

**Dernière mise à jour :** 03 Octobre 2025
**Version ROADMAP :** 1.0
