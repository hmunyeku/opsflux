# 📚 SYSTÈME DE CONTEXTE CLAUDE

Ce dossier contient les fichiers de suivi de contexte pour maintenir la continuité entre les sessions de développement avec Claude Code.

---

## 📁 STRUCTURE

```
.claude/
├── README.md              # Ce fichier (documentation système)
├── SESSION_CONTEXT.md     # Contexte session courante (NON tracké Git)
└── settings.local.json    # Configuration Claude locale
```

---

## 📄 FICHIERS RACINE PROJET

### `DEV_LOG.md` (Racine projet)
**Objectif :** Journal de développement permanent

**Contenu :**
- ✅ État actuel du projet
- ✅ Dernières fonctionnalités développées
- ✅ Tâches en cours et à venir
- ✅ Problèmes connus
- ✅ Décisions techniques récentes
- ✅ Historique des sessions précédentes
- ✅ Connaissances acquises
- ✅ Questions pour utilisateur
- ✅ Commandes utiles

**Mise à jour :** À chaque fin de session (manuel ou automatique)
**Tracé Git :** ✅ OUI

---

### `TECHNICAL_DECISIONS.md` (Racine projet)
**Objectif :** Documentation décisions techniques importantes

**Contenu :**
- 🏛️ Architecture globale
- 💻 Stack technique
- 🔒 Sécurité
- 💾 Base de données
- 🎨 Frontend
- 🔧 Backend
- 🐳 Infrastructure
- 📝 Conventions

**Mise à jour :** Quand décision technique majeure
**Tracé Git :** ✅ OUI

---

### `SESSION_CONTEXT.md` (Dossier .claude/)
**Objectif :** Mémoire volatile session en cours

**Contenu :**
- 🎯 État session courante
- ✅ Tâches complétées
- 🚧 Tâches en cours
- 🧠 Décisions immédiates
- 📝 Notes & rappels
- 💬 Conversations importantes
- 🔄 Checklist fin session

**Mise à jour :** En temps réel durant session
**Tracé Git :** ❌ NON (volatile, ignoré)

---

## 🔄 WORKFLOW

### 🚀 Début de session Claude
1. Claude lit `DEV_LOG.md`
2. Claude lit `TECHNICAL_DECISIONS.md`
3. Claude crée/met à jour `SESSION_CONTEXT.md`
4. Claude comprend le contexte et reprend le travail

### 💪 Durant la session
1. Claude met à jour `SESSION_CONTEXT.md` en temps réel
2. Note les tâches, décisions, conversations
3. Suit la progression

### 🏁 Fin de session
1. Claude résume session dans `SESSION_CONTEXT.md`
2. Met à jour `DEV_LOG.md` avec résumé session
3. Ajoute décisions techniques dans `TECHNICAL_DECISIONS.md` si nécessaire
4. Commit si code modifié
5. Nettoie `SESSION_CONTEXT.md` (ou laisse pour debug)

---

## 📖 COMMENT L'UTILISER

### Pour l'Utilisateur

**Début de session :**
```
Utilisateur: "On continue le développement"
Claude: *lit DEV_LOG.md* "Ok, dernière session vous aviez développé Settings.jsx.
         Voulez-vous continuer avec 2FA, Sessions actives, ou autre chose ?"
```

**Si Claude perd contexte :**
```
Utilisateur: "Tu te souviens de notre dernière étape ?"
Claude: *lit DEV_LOG.md* "Oui ! Vous avez développé le système de paramètres
         utilisateur. Prochaines étapes planifiées : 2FA, Sessions, Liste users."
```

**Rappeler décision technique :**
```
Utilisateur: "Pourquoi on utilise UI5 déjà ?"
Claude: *lit TECHNICAL_DECISIONS.md* "UI5 Web Components v2.15.0 car composants
         enterprise-grade SAP avec design Fiori, accessibilité WCAG, et thèmes built-in."
```

### Pour Claude

**Instructions automatiques :**
1. Toujours lire `DEV_LOG.md` si utilisateur demande contexte
2. Consulter `TECHNICAL_DECISIONS.md` avant décision architecture
3. Mettre à jour `SESSION_CONTEXT.md` après chaque tâche
4. En fin de session, résumer dans `DEV_LOG.md`

---

## 🎯 AVANTAGES

### ✅ Continuité entre sessions
- Plus besoin de ré-expliquer tout le projet
- Claude reprend immédiatement le travail
- Zéro perte d'information

### ✅ Traçabilité complète
- Historique décisions techniques
- Apprentissages documentés
- Problèmes et solutions tracés

### ✅ Onboarding simplifié
- Nouveau développeur lit `DEV_LOG.md`
- Comprend immédiatement état projet
- Décisions techniques expliquées

### ✅ Documentation auto-générée
- Documentation se construit naturellement
- Toujours à jour
- Contexte technique complet

---

## 🛠️ MAINTENANCE

### Mise à jour DEV_LOG.md
**Fréquence :** Fin de chaque session
**Qui :** Claude (automatique si possible)
**Format :**
```markdown
## Session [DATE]
**Objectif :** [Description]
**Réalisations :** [Liste]
**Commits :** [Hashes]
**Apprentissages :** [Notes]
```

### Mise à jour TECHNICAL_DECISIONS.md
**Fréquence :** Lors décision technique majeure
**Qui :** Claude + validation utilisateur
**Format :**
```markdown
### [Titre Décision]
**Date :** [Date]
**Décision :** [Description]
**Justification :** [Raisons]
**Alternatives considérées :** [Options]
**Conséquences :** [Impacts]
```

### Nettoyage SESSION_CONTEXT.md
**Fréquence :** Fin de session ou nouvelle session
**Qui :** Claude
**Action :** Reset état ou garder pour debug

---

## 📊 MÉTRIQUES

### Indicateurs de succès
- ✅ Temps reprise contexte < 2 minutes
- ✅ Zéro perte information entre sessions
- ✅ Documentation toujours à jour
- ✅ Décisions techniques tracées
- ✅ Onboarding nouveau dev < 30 min

### Mesures
- Sessions Claude : ~1-2 par jour
- Commits : ~5-10 par session
- Mises à jour DEV_LOG : 1 par session
- Nouvelles décisions techniques : ~2-3 par semaine

---

## 🔮 ÉVOLUTIONS FUTURES

### Court terme
- [ ] Script automatique génération résumé session
- [ ] Template pour nouvelles sessions
- [ ] Validation format Markdown

### Moyen terme
- [ ] Intégration CI/CD (vérif docs à jour)
- [ ] Dashboard métriques développement
- [ ] Export PDF documentation

### Long terme
- [ ] IA analyse patterns développement
- [ ] Suggestions automatiques optimisations
- [ ] Génération diagrammes architecture auto

---

## 📞 SUPPORT

**Questions :** Consulter `CLAUDE.md` (instructions développement)
**Bugs :** Créer issue GitHub
**Améliorations :** Pull request bienvenue

---

**Créé :** 04 Octobre 2025
**Maintenu par :** Équipe Dev + Claude
**Version :** 1.0
