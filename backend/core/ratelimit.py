"""
OpsFlux - Rate Limiting Middleware et Décorateurs
"""
from functools import wraps
from django_ratelimit.decorators import ratelimit
from rest_framework.response import Response
from rest_framework import status


def api_ratelimit(group=None, key='ip', rate='100/h', method='ALL'):
    """
    Décorateur pour appliquer rate limiting sur les vues API

    Args:
        group: Nom du groupe pour rate limiting (optionnel)
        key: Clé de rate limiting ('ip', 'user', 'header:x-api-key', etc.)
        rate: Limite (format: 'nombre/période', ex: '100/h', '10/m')
        method: Méthodes HTTP concernées ('ALL', 'GET', 'POST', etc.)

    Exemples:
        @api_ratelimit(rate='5/m', method='POST')  # Login, registration
        @api_ratelimit(rate='100/h')  # Endpoints normaux
        @api_ratelimit(key='user', rate='1000/h')  # Par utilisateur authentifié
    """
    def decorator(view_func):
        @wraps(view_func)
        @ratelimit(group=group, key=key, rate=rate, method=method)
        def wrapped_view(request, *args, **kwargs):
            # Si rate limit dépassé
            if getattr(request, 'limited', False):
                return Response(
                    {
                        'error': 'Rate limit exceeded',
                        'detail': f'Trop de requêtes. Limite: {rate}',
                        'retry_after': 60  # secondes
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            return view_func(request, *args, **kwargs)
        return wrapped_view
    return decorator


# Limites prédéfinies pour différents types d'endpoints
class RateLimits:
    """Limites de rate limiting prédéfinies"""

    # Authentification (strict)
    AUTH_LOGIN = '5/m'        # 5 tentatives de login par minute
    AUTH_REGISTER = '3/h'     # 3 inscriptions par heure
    AUTH_PASSWORD_RESET = '3/h'

    # API publique
    PUBLIC_READ = '100/h'     # Lecture publique
    PUBLIC_WRITE = '30/h'     # Écriture publique

    # API authentifiée
    AUTHENTICATED_READ = '1000/h'   # Lecture authentifiée
    AUTHENTICATED_WRITE = '300/h'   # Écriture authentifiée

    # API admin
    ADMIN_OPERATIONS = '500/h'

    # Uploads
    FILE_UPLOAD = '20/h'

    # Export/Import
    EXPORT = '10/h'
    IMPORT = '5/h'

    # IA/ML endpoints
    AI_QUERY = '50/h'
    AI_TRAINING = '5/d'
