"""
Configuration de l'application Core
Fonctionnalités centrales et modèles de base pour OpsFlux
"""
from django.apps import AppConfig


class CoreConfig(AppConfig):
    """Configuration de l'application Core"""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    verbose_name = 'OpsFlux Core'
    
    def ready(self):
        """
        Méthode appelée quand Django démarre
        Utilisée pour enregistrer les signaux, etc.
        """
        # Import des signaux
        import core.signals  # noqa
        
        print("✅ Core App chargée")
