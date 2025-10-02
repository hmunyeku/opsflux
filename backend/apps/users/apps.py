"""
Configuration de l'application Users
"""
from django.apps import AppConfig


class UsersConfig(AppConfig):
    """Configuration de l'app Users"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
    verbose_name = 'Utilisateurs & Permissions'
    
    def ready(self):
        """Méthode appelée au démarrage"""
        # Import des signaux
        import apps.users.signals  # noqa
        
        print("✅ Users App chargée")
