"""
URLs de l'API Core
Endpoints pour les fonctionnalités de base
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'core'

# Router pour les ViewSets
router = DefaultRouter()
router.register(r'companies', views.CompanyViewSet, basename='company')
router.register(r'business-units', views.BusinessUnitViewSet, basename='businessunit')
router.register(r'currencies', views.CurrencyViewSet, basename='currency')
router.register(r'currency-rates', views.CurrencyRateViewSet, basename='currencyrate')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'tags', views.TagViewSet, basename='tag')
router.register(r'sequences', views.SequenceViewSet, basename='sequence')
router.register(r'attachments', views.AttachmentViewSet, basename='attachment')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Health check endpoint
    path('health/', views.health_check, name='health'),
    
    # System info endpoint
    path('info/', views.system_info, name='info'),
    
    # Currency conversion endpoint
    path('currency/convert/', views.currency_convert, name='currency-convert'),
    
    # Sequence generation endpoint
    path('sequences/<int:pk>/next/', views.get_next_sequence_number, name='sequence-next'),
]
