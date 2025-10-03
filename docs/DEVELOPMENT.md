# 💻 GUIDE DÉVELOPPEMENT OPSFLUX

## 🚀 Démarrage Rapide

### Prérequis
- Docker 20+ et Docker Compose
- Git
- Accès au serveur Dokploy
- Éditeur : VSCode recommandé

### Installation Locale

```bash
# Cloner le repo
git clone https://github.com/hmunyeku/opsflux.git
cd opsflux

# Copier le .env
cp .env.example .env

# Éditer les variables
nano .env

# Lancer les services
docker compose up -d

# Vérifier l'état
docker compose ps

# Créer un superuser
docker exec opsflux_backend python manage.py createsuperuser

# Accéder à l'application
# Frontend : http://localhost:3001
# Backend : http://localhost:8000
# API Docs : http://localhost:8000/api/docs/
```

---

## 📁 Structure Projet

```
opsflux/
├── backend/                 # Django API
├── frontend/                # React UI
├── web/                     # Site vitrine
├── docs/                    # Documentation
├── scripts/                 # Scripts utilitaires
├── docker-compose.yml       # Configuration Docker
├── .env                     # Variables d'environnement
├── ROADMAP.md              # Roadmap projet
└── README.md               # Documentation principale
```

---

## 🔧 Développement Backend

### Créer une nouvelle app Django

```bash
docker exec opsflux_backend python manage.py startapp nom_app apps/nom_app
```

### Créer des migrations

```bash
docker exec opsflux_backend python manage.py makemigrations
docker exec opsflux_backend python manage.py migrate
```

### Shell Django

```bash
docker exec -it opsflux_backend python manage.py shell
```

### Tests

```bash
docker exec opsflux_backend python manage.py test
```

### Convention Nommage

**Models :**
```python
class User(BaseModel):  # PascalCase, singulier
    """Docstring en français"""
    first_name = models.CharField()  # snake_case
```

**Serializers :**
```python
class UserSerializer(serializers.ModelSerializer):
    """Docstring en français"""
    pass
```

**Views :**
```python
class UserViewSet(viewsets.ModelViewSet):
    """Docstring en français"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
```

---

## 🎨 Développement Frontend

### Installer des dépendances

```bash
docker exec opsflux_frontend npm install package-name
```

### Structure Composant React

```jsx
import React, { useState, useEffect } from 'react';
import { Button, Card } from '@ui5/webcomponents-react';

/**
 * Composant description
 */
const MonComposant = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  const handleAction = () => {
    // Handler logic
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MonComposant;
```

### Appel API

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getUsers = async () => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`${API_URL}/api/users/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
```

### UI5 Web Components

**Utilisation correcte :**
```jsx
// ✅ BON
<ShellBar>
  <ShellBarItem icon="log" text="Logout" onClick={handleLogout} />
</ShellBar>

// ❌ MAUVAIS - Ne met pas de Button dans ShellBar
<ShellBar>
  <Button onClick={handleLogout}>Logout</Button>
</ShellBar>
```

---

## 🗄️ Base de Données

### Accéder à PostgreSQL

```bash
docker exec -it opsflux_postgres psql -U opsflux_user -d opsflux
```

### Backup

```bash
docker exec opsflux_postgres pg_dump -U opsflux_user opsflux > backup.sql
```

### Restore

```bash
docker exec -i opsflux_postgres psql -U opsflux_user opsflux < backup.sql
```

---

## 📝 Documentation du Code

### Backend (Python)

```python
def ma_fonction(param1: str, param2: int) -> dict:
    """
    Description courte de la fonction.

    Args:
        param1 (str): Description du paramètre 1
        param2 (int): Description du paramètre 2

    Returns:
        dict: Description du retour

    Raises:
        ValueError: Quand le paramètre est invalide

    Examples:
        >>> ma_fonction("test", 10)
        {'result': 'success'}
    """
    pass
```

### Frontend (JavaScript)

```javascript
/**
 * Description de la fonction
 * @param {string} param1 - Description
 * @param {number} param2 - Description
 * @returns {Promise<Object>} Description du retour
 */
async function maFonction(param1, param2) {
  // Implementation
}
```

---

## 🧪 Tests

### Backend - Tests Unitaires

```python
from django.test import TestCase
from apps.users.models import User

class UserModelTest(TestCase):
    """Tests pour le modèle User"""

    def setUp(self):
        """Configuration avant chaque test"""
        self.user = User.objects.create(
            username='test',
            email='test@example.com'
        )

    def test_user_creation(self):
        """Test création utilisateur"""
        self.assertEqual(self.user.username, 'test')
        self.assertTrue(self.user.is_active)
```

### Frontend - Tests Composants

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('affiche le formulaire de login', () => {
  render(<Login />);
  const usernameInput = screen.getByPlaceholderText(/nom d'utilisateur/i);
  expect(usernameInput).toBeInTheDocument();
});
```

---

## 🔄 Workflow Git

### Branches

- `main` : Production
- `develop` : Développement (si nécessaire)
- `feature/nom-feature` : Nouvelles fonctionnalités
- `fix/nom-bug` : Corrections de bugs

### Commits

**Format :**
```
Type: Description courte

Description détaillée si nécessaire
- Point 1
- Point 2

Fixes #123
```

**Types :**
- `Feat` : Nouvelle fonctionnalité
- `Fix` : Correction de bug
- `Refactor` : Refactoring
- `Docs` : Documentation
- `Test` : Tests
- `Chore` : Maintenance

**Exemples :**
```bash
git commit -m "Feat: Ajout gestion profil utilisateur"
git commit -m "Fix: Correction erreur login avec email invalide"
git commit -m "Refactor: Optimisation requêtes base de données"
```

---

## 🐛 Debugging

### Backend Logs

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f backend

# Dernières 100 lignes
docker compose logs --tail=100 backend
```

### Frontend Logs

```bash
docker compose logs -f frontend
```

### Shell dans un conteneur

```bash
docker exec -it opsflux_backend bash
docker exec -it opsflux_frontend sh
```

---

## ⚡ Optimisation

### Backend
- Utiliser `select_related()` et `prefetch_related()`
- Indexer les champs souvent requêtés
- Paginer les résultats
- Cache Redis pour données fréquentes

### Frontend
- Lazy loading des composants
- Mémoization (useMemo, useCallback)
- Debounce sur recherches
- Optimisation images

---

## 📚 Ressources

### Documentation
- Django : https://docs.djangoproject.com/
- DRF : https://www.django-rest-framework.org/
- React : https://react.dev/
- UI5 Web Components : https://sap.github.io/ui5-webcomponents-react/

### Outils
- Postman/Insomnia : Test API
- React DevTools : Debug React
- Django Debug Toolbar : Debug Django

---

**Dernière mise à jour :** 03 Octobre 2025
