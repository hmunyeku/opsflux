"""
Middleware personnalisés pour OpsFlux
Audit trail, logging des requêtes, etc.
"""
from django.utils.deprecation import MiddlewareMixin
from django.utils import timezone
from django.contrib.auth.models import AnonymousUser
import logging
import json
import time

logger = logging.getLogger(__name__)


class AuditTrailMiddleware(MiddlewareMixin):
    """
    Middleware pour l'audit trail automatique
    Enregistre automatiquement created_by et updated_by
    """
    
    def process_request(self, request):
        """Stocke l'utilisateur dans le thread local"""
        from django.db.models import signals
        from django.apps import apps
        
        if hasattr(request, 'user') and request.user.is_authenticated:
            # Stocker l'utilisateur dans les signaux
            request._audit_user = request.user
    
    def process_response(self, request, response):
        """Nettoie le thread local"""
        if hasattr(request, '_audit_user'):
            delattr(request, '_audit_user')
        return response


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware pour logger toutes les requêtes
    Enregistre méthode, path, user, IP, temps de réponse
    """
    
    def process_request(self, request):
        """Enregistre le début de la requête"""
        request._request_start_time = time.time()
    
    def process_response(self, request, response):
        """Enregistre la fin de la requête avec metrics"""
        if hasattr(request, '_request_start_time'):
            duration = time.time() - request._request_start_time
            
            # Extraire les informations
            user = getattr(request, 'user', None)
            user_str = str(user) if user and not isinstance(user, AnonymousUser) else 'Anonymous'
            
            # IP du client
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            
            # Logger les informations
            log_data = {
                'method': request.method,
                'path': request.path,
                'user': user_str,
                'ip': ip,
                'status_code': response.status_code,
                'duration_ms': round(duration * 1000, 2),
                'user_agent': request.META.get('HTTP_USER_AGENT', '')[:200],
            }
            
            # Logger selon le niveau
            if response.status_code >= 500:
                logger.error(f"Request failed: {json.dumps(log_data)}")
            elif response.status_code >= 400:
                logger.warning(f"Request warning: {json.dumps(log_data)}")
            else:
                logger.info(f"Request completed: {json.dumps(log_data)}")
        
        return response


class TimezoneMiddleware(MiddlewareMixin):
    """
    Middleware pour activer le timezone de l'utilisateur
    """
    
    def process_request(self, request):
        """Active le timezone de l'utilisateur si disponible"""
        import pytz
        
        if hasattr(request, 'user') and request.user.is_authenticated:
            # Récupérer le timezone de l'utilisateur
            user_timezone = getattr(request.user, 'timezone', None)
            if user_timezone:
                try:
                    timezone.activate(pytz.timezone(user_timezone))
                except:
                    pass
        else:
            timezone.deactivate()


class APIVersionMiddleware(MiddlewareMixin):
    """
    Middleware pour gérer les versions d'API
    Ajoute la version de l'API dans les headers de réponse
    """
    
    def process_response(self, request, response):
        """Ajoute les headers de version"""
        from django.conf import settings
        
        response['X-API-Version'] = settings.OPSFLUX_CONFIG.get('VERSION', '1.0.0')
        response['X-OpsFlux-Version'] = settings.OPSFLUX_CONFIG.get('VERSION', '1.0.0')
        
        return response


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware pour ajouter des headers de sécurité supplémentaires
    """
    
    def process_response(self, request, response):
        """Ajoute les headers de sécurité"""
        # Déjà géré par les settings Django, mais on peut ajouter plus
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Content Security Policy (à adapter selon vos besoins)
        # response['Content-Security-Policy'] = "default-src 'self'"
        
        return response
