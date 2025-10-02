"""
OpsFlux - Configuration Django Développement
Settings pour l'environnement de développement
"""
from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Database - Utilise la config de base (PostgreSQL via docker-compose)

# CORS - Plus permissif en développement
CORS_ALLOW_ALL_ORIGINS = True

# Email Backend - Console en développement
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Debug Toolbar
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ['127.0.0.1', 'localhost']
    
    DEBUG_TOOLBAR_CONFIG = {
        'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG,
    }

# Logging plus verbeux en développement
LOGGING['loggers']['django']['level'] = 'DEBUG'
LOGGING['root']['level'] = 'DEBUG'

# Cache - Utilise Redis mais avec timeout plus court
CACHES['default']['TIMEOUT'] = 60  # 1 minute

# Session - Plus courte en dev
SESSION_COOKIE_AGE = 3600  # 1 heure

# Static files - Pas de whitenoise en dev
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Celery - Mode eager pour debug
CELERY_TASK_ALWAYS_EAGER = False  # True pour tester sans Celery
CELERY_TASK_EAGER_PROPAGATES = True

# DRF - Browsable API activée
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
    'rest_framework.renderers.JSONRenderer',
    'rest_framework.renderers.BrowsableAPIRenderer',
]

# Security - Désactivées en dev
SECURE_SSL_REDIRECT = False
SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# JWT - Plus long en dev
SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'] = timedelta(hours=24)
SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'] = timedelta(days=30)

print("🔧 Mode: DÉVELOPPEMENT")
