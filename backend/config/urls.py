"""
OpsFlux - Configuration des URLs principales
Routage des URLs pour toute l'application
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # Admin Django
    path('admin/', admin.site.urls),
    
    # API Authentication
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API Core
    path('api/core/', include('core.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/modules/', include('apps.modules.urls')),
    path('api/ai/', include('apps.ai.urls')),
    path('api/services/', include('apps.services.urls')),
]

# Configuration personnalisée de l'admin
admin.site.site_header = "OpsFlux Administration"
admin.site.site_title = "OpsFlux Admin"
admin.site.index_title = "Bienvenue sur OpsFlux Administration"

# URLs pour les fichiers statiques et médias en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Debug Toolbar
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
