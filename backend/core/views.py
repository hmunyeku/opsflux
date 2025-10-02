"""
Views (ViewSets) pour l'API Core
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from django.utils import timezone
from django.db.models import Q
from decimal import Decimal
import sys

from .models import (
    Company, BusinessUnit, Currency, CurrencyRate,
    Category, Tag, Sequence, Attachment
)
from .serializers import (
    CompanySerializer, BusinessUnitSerializer,
    CurrencySerializer, CurrencyRateSerializer,
    CategorySerializer, TagSerializer,
    SequenceSerializer, AttachmentSerializer
)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Endpoint de health check
    Vérifie que l'application est opérationnelle
    En production, limite les informations exposées
    """
    from django.db import connection

    try:
        # Vérifier la connexion à la base de données
        connection.ensure_connection()
        db_status = 'ok'
    except Exception as e:
        db_status = 'error' if not settings.DEBUG else f'error: {str(e)}'

    response_data = {
        'status': 'ok',
        'timestamp': timezone.now().isoformat(),
        'database': db_status,
    }

    # N'exposer la version qu'en développement
    if settings.DEBUG:
        response_data['version'] = settings.OPSFLUX_CONFIG.get('VERSION', '1.0.0')

    return Response(response_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def system_info(request):
    """
    Retourne les informations système
    """
    return Response({
        'version': settings.OPSFLUX_CONFIG.get('VERSION', '1.0.0'),
        'environment': settings.DEBUG and 'development' or 'production',
        'python_version': sys.version,
        'django_version': settings.DJANGO_VERSION if hasattr(settings, 'DJANGO_VERSION') else 'N/A',
        'timestamp': timezone.now().isoformat(),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def currency_convert(request):
    """
    Convertit un montant d'une devise à une autre
    
    Body: {
        "amount": 100,
        "from_currency": "EUR",
        "to_currency": "USD",
        "date": "2024-01-01"  # optionnel
    }
    """
    amount = request.data.get('amount')
    from_currency_code = request.data.get('from_currency')
    to_currency_code = request.data.get('to_currency')
    date_str = request.data.get('date')
    
    if not all([amount, from_currency_code, to_currency_code]):
        return Response({
            'error': 'Paramètres manquants: amount, from_currency, to_currency requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        amount = Decimal(str(amount))
        from_currency = Currency.objects.get(code=from_currency_code)
        to_currency = Currency.objects.get(code=to_currency_code)
        
        date = None
        if date_str:
            from datetime import datetime
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        converted_amount = CurrencyRate.convert(
            amount, from_currency, to_currency, date
        )
        
        return Response({
            'original_amount': float(amount),
            'from_currency': from_currency_code,
            'to_currency': to_currency_code,
            'converted_amount': float(converted_amount),
            'formatted': to_currency.format_amount(converted_amount),
            'date': date.isoformat() if date else timezone.now().date().isoformat(),
        })
    
    except Currency.DoesNotExist:
        return Response({
            'error': 'Devise non trouvée'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except ValueError as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_next_sequence_number(request, pk):
    """
    Génère et retourne le prochain numéro d'une séquence
    """
    try:
        sequence = Sequence.objects.get(pk=pk)
        next_number = sequence.get_next_number()
        
        return Response({
            'sequence_code': sequence.code,
            'next_number': next_number,
        })
    
    except Sequence.DoesNotExist:
        return Response({
            'error': 'Séquence non trouvée'
        }, status=status.HTTP_404_NOT_FOUND)


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet pour Company"""
    queryset = Company.objects.filter(is_deleted=False)
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'currency']
    search_fields = ['code', 'name', 'legal_name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class BusinessUnitViewSet(viewsets.ModelViewSet):
    """ViewSet pour BusinessUnit"""
    queryset = BusinessUnit.objects.filter(is_deleted=False).select_related(
        'company', 'parent', 'manager'
    )
    serializer_class = BusinessUnitSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['company', 'unit_type', 'is_active', 'parent']
    search_fields = ['code', 'name']
    ordering_fields = ['name', 'created_at']
    ordering = ['company', 'name']


class CurrencyViewSet(viewsets.ModelViewSet):
    """ViewSet pour Currency"""
    queryset = Currency.objects.filter(is_deleted=False)
    serializer_class = CurrencySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name']
    ordering = ['code']


class CurrencyRateViewSet(viewsets.ModelViewSet):
    """ViewSet pour CurrencyRate"""
    queryset = CurrencyRate.objects.filter(is_deleted=False).select_related(
        'from_currency', 'to_currency'
    )
    serializer_class = CurrencyRateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['from_currency', 'to_currency', 'effective_date', 'is_manual']
    ordering_fields = ['effective_date', 'created_at']
    ordering = ['-effective_date']


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet pour Category"""
    queryset = Category.objects.filter(is_deleted=False)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category_type', 'parent', 'is_active']
    search_fields = ['code', 'name']
    ordering_fields = ['sequence', 'name']
    ordering = ['category_type', 'sequence', 'name']


class TagViewSet(viewsets.ModelViewSet):
    """ViewSet pour Tag"""
    queryset = Tag.objects.filter(is_deleted=False)
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tag_type', 'is_active']
    search_fields = ['code', 'name']
    ordering_fields = ['usage_count', 'name']
    ordering = ['-usage_count', 'name']


class SequenceViewSet(viewsets.ModelViewSet):
    """ViewSet pour Sequence"""
    queryset = Sequence.objects.filter(is_deleted=False)
    serializer_class = SequenceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'reset_frequency']
    search_fields = ['code', 'name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    @action(detail=True, methods=['post'])
    def reset(self, request, pk=None):
        """Reset une séquence"""
        sequence = self.get_object()
        start_number = request.data.get('start_number', 0)
        sequence.reset_sequence(start_number)
        
        return Response({
            'message': f'Séquence {sequence.code} réinitialisée à {start_number}',
            'current_number': sequence.current_number,
        })


class AttachmentViewSet(viewsets.ModelViewSet):
    """ViewSet pour Attachment"""
    queryset = Attachment.objects.filter(is_deleted=False)
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['content_type', 'attachment_type', 'is_public']
    search_fields = ['original_filename', 'title', 'description']
    ordering_fields = ['created_at', 'file_size', 'download_count']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        """Incrémente le compteur de téléchargements"""
        attachment = self.get_object()
        attachment.increment_download_count()
        
        return Response({
            'message': 'Download count incremented',
            'download_count': attachment.download_count,
        })
