"""
WSGI config for OpsFlux project.
Expose l'application WSGI callable en tant que variable module-level nommée ``application``.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

application = get_wsgi_application()
