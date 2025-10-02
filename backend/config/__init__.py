"""
OpsFlux Configuration Package
Configuration Django principale pour OpsFlux
"""

# Version de l'application
__version__ = '1.0.0'

# Cela garantira que l'app Celery est toujours importée
# lorsque Django démarre pour que shared_task utilise cette app
from .celery import app as celery_app

__all__ = ('celery_app',)
