"""
Exceptions personnalisées pour OpsFlux
Gestion centralisée des erreurs métier
"""
from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from rest_framework import status
from django.utils.translation import gettext_lazy as _


class OpsFluxException(APIException):
    """Exception de base pour OpsFlux"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Une erreur s'est produite")
    default_code = 'error'


class ValidationError(OpsFluxException):
    """Erreur de validation"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Erreur de validation")
    default_code = 'validation_error'


class BusinessLogicError(OpsFluxException):
    """Erreur de logique métier"""
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_detail = _("Erreur de logique métier")
    default_code = 'business_logic_error'


class ResourceNotFoundError(OpsFluxException):
    """Ressource non trouvée"""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = _("Ressource non trouvée")
    default_code = 'not_found'


class PermissionDeniedError(OpsFluxException):
    """Permission refusée"""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = _("Permission refusée")
    default_code = 'permission_denied'


class AuthenticationError(OpsFluxException):
    """Erreur d'authentification"""
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = _("Authentification requise")
    default_code = 'authentication_error'


class ModuleError(OpsFluxException):
    """Erreur liée aux modules"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Erreur de module")
    default_code = 'module_error'


class AIProviderError(OpsFluxException):
    """Erreur du provider IA"""
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = _("Le service IA est temporairement indisponible")
    default_code = 'ai_provider_error'


class RateLimitExceededError(OpsFluxException):
    """Limite de requêtes dépassée"""
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail = _("Trop de requêtes, veuillez réessayer plus tard")
    default_code = 'rate_limit_exceeded'


class DataIntegrityError(OpsFluxException):
    """Erreur d'intégrité des données"""
    status_code = status.HTTP_409_CONFLICT
    default_detail = _("Conflit de données")
    default_code = 'data_integrity_error'


def custom_exception_handler(exc, context):
    """
    Handler d'exceptions personnalisé pour DRF
    Enrichit les réponses d'erreur avec des informations supplémentaires
    """
    # Appeler le handler par défaut de DRF
    response = exception_handler(exc, context)
    
    if response is not None:
        # Enrichir la réponse avec des informations supplémentaires
        custom_response_data = {
            'success': False,
            'error': {
                'code': getattr(exc, 'default_code', 'error'),
                'message': str(exc),
                'details': response.data,
            }
        }
        
        # Ajouter le timestamp
        from django.utils import timezone
        custom_response_data['timestamp'] = timezone.now().isoformat()
        
        # Ajouter l'URL de la requête
        request = context.get('request')
        if request:
            custom_response_data['path'] = request.path
            custom_response_data['method'] = request.method
        
        response.data = custom_response_data
    
    return response
