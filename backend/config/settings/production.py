"""
OpsFlux - Configuration Django Production
Settings pour l'environnement de production
"""
from .base import *

# SECURITY
DEBUG = False

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'opsflux.io,www.opsflux.io,app.opsflux.io,api.opsflux.io').split(',')

# Database - Utilise la config de base avec connection pooling optimisé
DATABASES['default']['CONN_MAX_AGE'] = 600
DATABASES['default']['OPTIONS'] = {
    'connect_timeout': 10,
}

# CORS - Restrictif en production
CORS_ALLOW_ALL_ORIGINS = False
# Filtrer et valider que seules les origines HTTPS sont autorisées
cors_origins = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOWED_ORIGINS = [origin for origin in cors_origins if origin.startswith('https://')]
if not CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS = ['https://app.opsflux.io']  # Fallback sécurisé

# Email Backend - SMTP réel en production
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Security Settings
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS = 31536000  # 1 an
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Session Security
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_AGE = 86400  # 24 heures

# CSRF Security
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'
CSRF_USE_SESSIONS = True

# Static files - Whitenoise pour servir les fichiers statiques
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Cache - Configuration optimisée pour production
CACHES['default']['TIMEOUT'] = 300  # 5 minutes
CACHES['default']['OPTIONS']['MAX_CONNECTIONS'] = 100

# Logging - Moins verbeux en production
LOGGING['loggers']['django']['level'] = 'WARNING'
LOGGING['root']['level'] = 'WARNING'

# Ajouter Sentry si configuré
SENTRY_DSN = os.environ.get('SENTRY_DSN', '')
if SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    from sentry_sdk.integrations.celery import CeleryIntegration
    
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[
            DjangoIntegration(),
            CeleryIntegration(),
        ],
        traces_sample_rate=0.1,
        send_default_pii=False,
        environment='production',
    )

# Celery - Configuration production
CELERY_TASK_ALWAYS_EAGER = False
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True

# DRF - Désactiver browsable API en production
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
    'rest_framework.renderers.JSONRenderer',
]

# Désactiver les opérations risquées
OPSFLUX_CONFIG['ALLOW_DANGEROUS_OPERATIONS'] = False

# Content Security Policy
CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'", "'unsafe-inline'")  # unsafe-inline pour DRF browsable API
CSP_STYLE_SRC = ("'self'", "'unsafe-inline'")
CSP_IMG_SRC = ("'self'", "data:", "https:")
CSP_FONT_SRC = ("'self'", "data:")
CSP_CONNECT_SRC = ("'self'",)
CSP_FRAME_ANCESTORS = ("'none'",)  # Équivalent X-Frame-Options: DENY
CSP_BASE_URI = ("'self'",)
CSP_FORM_ACTION = ("'self'",)

# AWS S3 Configuration (si utilisé)
USE_S3 = os.environ.get('USE_S3', 'False') == 'True'
if USE_S3:
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'eu-west-1')
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }
    AWS_DEFAULT_ACL = 'public-read'
    
    # Static files
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
    
    # Media files
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'

print("🚀 Mode: PRODUCTION")
