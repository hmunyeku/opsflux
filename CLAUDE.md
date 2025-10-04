## **PROMPT MAÎTRE OPSFLUX**

```markdown
# PROJET OPSFLUX - ERP MODULAIRE INTELLIGENT

Tu dois :
PAS d'ARTEFACT, CODE DIRECTEMENT
- Fournir du **code production-ready** immédiatement exécutable
- Guider étape par étape avec une **roadmap claire**
- Proposer systématiquement les **3 prochaines actions** à effectuer
- **INTERROGER L'UTILISATEUR** en cas de doute ou d'ambiguïté
- Maintenir une **cohérence architecturale** totale
- **VÉRIFIER LA COHÉRENCE** Backend/Frontend/Web à chaque itération
- Assurer la **traçabilité complète** via audit trail
- Préparer toutes les fonctionnalités pour **l'intégration IA**
- Structurer les données pour **Business Intelligence**
- Ne **JAMAIS perdre** de fonctionnalités entre les versions
- **VALIDER LES 3 COMPOSANTS** (backend, frontend, web) à chaque développement
- Respecter les **standards de conformité** (RGPD, ISO 27001, SOX, etc.)


## ARCHITECTURE GLOBALE

OpsFlux/
├── frontend/       # React + UI5 Web Components (lastest version is v2.15.0 please look at https://ui5.github.io/webcomponents/)
├── backend/        # Django REST API
├── modules/        # Modules installables
├── web/           # Pages publiques en React + UI5 Web Components (lastest version is v2.15.0 please look at https://ui5.github.io/webcomponents/)
├── scripts/       # Scripts administration CLI
├── backups/       # Archives
└── logs/          # Journaux

Chaque module suit la même architecture.


## SERVEURS VIRTUELS (Apache/Nginx)
- app.DOMAIN → Frontend application
- server.DOMAIN → Admin backend  
- api.DOMAIN → API Swagger (auth requise)
- admin.DOMAIN → Webmin
- www.DOMAIN → Dossier web public

## STACK TECHNIQUE
- **Backend**: Django + DRF (100% API REST)
- **Frontend**: React + UI5 Web Components (consomme API)
- **BD**: PostgreSQL avec champ eID (external ID) sur chaque table
- **IA**: Multi-providers (OpenAI, Claude, Mixtral, Meta, Ollama)
- **Principe**: Backend gère TOUTE la logique, frontend interchangeable

## FONCTIONNALITÉS CORE (à implémenter)

### 1. GESTION UTILISATEURS
- Users, Groups, Roles, Permissions
- Préférences utilisateur
- Auth: Native, SSO, LDAP/AD, OAuth2

### 2. GESTION MODULES
- Download, install, activate, deactivate, uninstall
- Vérification licences et dépendances
- Descripteur module (metadata.json, install.sql, uninstall.sql)
- Migrations automatiques
- Gestion compatibilité inter-modules

### 3. MODÈLES DE BASE (héritables)
- Company/Organization (multi-sociétés, fiscalité, devises)
- BusinessUnit/Department (centres coûts/profit, sites)
- Party abstrait → Customer, Supplier, Employee, Partner
- Address, Currency (avec historisation taux)
- Calendar/Time, UnitOfMeasure, Sequence/Counter
- Category et Tag (hiérarchiques, imbriqués)
- Bookmarks, Licenses

### 4. SYSTÈME IA INTÉGRÉ
- Apprentissage habitudes utilisateur
- Text prediction, NLP, Computer Vision
- Predictive Analytics, Conversational AI
- Recommendation Systems, Optimization
- Knowledge Graphs, Generative AI, Process Mining
- Configuration provider (OpenAI/Claude/Mixtral/Meta/Ollama)

### 5. SERVICES TRANSVERSAUX
- **FileManager**: Gestion centralisée fichiers
- **Import/Export**: JSON, CSV, Excel
- **NotificationService**: Priorités, ancienneté
- **EmailQueue**: Historisation, file d'attente
- **TranslationService**: i18n centralisé
- **HookSystem**: Hooks et triggers événementiels
- **APIManager**: Tokens, JWT, Swagger auto
- **MenuManager**: Menus dynamiques
- **TaskScheduler**: Cron jobs
- **ErrorLogger**: Erreurs core + modules
- **URLShortener**: Service raccourcisseur
- **ConfigManager**: Configuration via UI

### 6. BASE DE DONNÉES
- Migrations Django
- Champ eID obligatoire (liaison systèmes externes)
- Audit trail complet
- Soft delete

IA Integration:
  - Wrapper multi-provider obligatoire
  - Providers: OpenAI, Claude, Mistral, Ollama, Custom
  - Hooks IA sur chaque fonctionnalité
  - Pipeline de traitement NLP
  - Computer Vision pour documents/images
  - Predictive Analytics
  - Recommendation Engine
  - Anomaly Detection
  - Natural Language Interface
  - Voice commands
  - Sentiment Analysis

Business Intelligence:
  - Data Warehouse structure
  - ETL pipelines automatiques
  - Real-time analytics
  - Dashboard builder drag&drop
  - Rapports prédictifs
  - KPIs automatisés
  - Machine Learning pipelines
  - Data quality monitoring

### Vision Produit
**OpsFlux** est une plateforme ERP révolutionnaire entreprise qui :
- Centralise **TOUS** les flux métiers d'une entreprise
- **Architecture modulaire** avec modules métiers extensibles et marketplace
- Fonctionne **100% offline** avec synchronisation intelligente PWA
- Intelligence artificielle **intégrée nativement** dans chaque module
- S'intègre avec les systèmes existants via **external_id** et webhooks
- Supporte le **multi-tenant** et **multi-site** natif
- Respecte les standards **entreprise** (SSO, LDAP, SAML, audit complet)
- **Apprend et s'améliore** continuellement via ML
- Fournit des **insights prédictifs** et prescriptifs
- Support **multi-devise** avec conversion temps réel
- **Conformité** totale (RGPD, HIPAA, PCI DSS, ISO 27001, SOX)

## ARCHITECTURE MODULE

module_name/
├── frontend/      # Components React du module
├── backend/       # Models, views, serializers
├── metadata.json  # Descripteur module
├── install.py     # Script installation
├── uninstall.py   # Script désinstallation
└── migrations/    # Migrations spécifiques


Un module peut :
- Hériter des modèles core
- Ajouter hooks, menus, tâches, APIs
- Déclarer dépendances obligatoires
- Étendre la configuration

## PHASE DE DÉVELOPPEMENT ACTUELLE
[À SPÉCIFIER : Architecture | Core Auth | Core Models | Core IA | Core Services | Module Test]

## TÂCHE DEMANDÉE
[DÉCRIRE PRÉCISÉMENT CE QU'IL FAUT DÉVELOPPER]

## CONTRAINTES CRITIQUES
1. **TOUT** paramétrable via UI (zéro hardcode)
2. Backend = logique complète, Frontend = présentation pure
3. Code production-ready, commenté en français
4. Tests unitaires pour chaque composant
5. API REST documentée (OpenAPI/Swagger)
6. Extensibilité maximale pour modules futurs

## LIVRABLE ATTENDU
Fournis le code en plusieurs parties si nécessaire (indiquer PARTIE X/Y).
Si limite mémoire atteinte, génère un contexte de continuité avec :
- État du développement
- Fichiers créés/modifiés
- Décisions techniques prises
- Prochaines étapes

Commence par [TÂCHE SPÉCIFIQUE].


### Infrastructure
- **Serveur**: Dokploy
- **Domaine**: opsflux.io
- **SSL**: Let's Encrypt + HSM pour secrets
- **Backup**: Quotidien avec rétention 30 jours + cross-region
- **IA Backend**: GPU cluster pour modèles ML
- **CDN**: CloudFlare pour médias et assets
- **Monitoring**: 24/7 avec alerting intelligent
