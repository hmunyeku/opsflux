"""
OpsFlux Settings Package
Gestion de la configuration selon l'environnement
"""
import os

# Déterminer l'environnement
environment = os.environ.get('ENVIRONMENT', 'development')

# Importer les settings correspondants
if environment == 'production':
    from .production import *
elif environment == 'staging':
    from .production import *  # Staging utilise la même base que production
else:
    from .development import *

# Message de confirmation
print(f"🔧 OpsFlux chargé avec les settings: {environment}")
