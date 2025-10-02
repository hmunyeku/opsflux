"""
Serializers DRF pour les modèles Core
"""
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import (
    Company, BusinessUnit, Currency, CurrencyRate,
    Category, Tag, Sequence, Attachment
)


class CompanySerializer(serializers.ModelSerializer):
    """Serializer pour Company"""
    
    business_units_count = serializers.IntegerField(
        source='business_units.count',
        read_only=True
    )
    
    class Meta:
        model = Company
        fields = [
            'id', 'eid', 'code', 'name', 'legal_name', 
            'registration_number', 'tax_id', 'vat_number',
            'email', 'phone', 'website',
            'street1', 'street2', 'city', 'state', 'postal_code', 
            'country', 'country_code',
            'currency', 'language', 'timezone',
            'fiscal_year_start_month', 'fiscal_year_start_day',
            'logo', 'description', 'is_active',
            'business_units_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['eid', 'created_at', 'updated_at']


class BusinessUnitSerializer(serializers.ModelSerializer):
    """Serializer pour BusinessUnit"""
    
    company_name = serializers.CharField(source='company.name', read_only=True)
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    full_path = serializers.CharField(source='get_full_path', read_only=True)
    
    class Meta:
        model = BusinessUnit
        fields = [
            'id', 'eid', 'code', 'name', 'description',
            'company', 'company_name', 'parent', 'parent_name', 'full_path',
            'unit_type', 'email', 'phone',
            'street1', 'street2', 'city', 'state', 'postal_code',
            'country', 'country_code',
            'manager', 'is_cost_center', 'is_profit_center',
            'cost_center_code', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['eid', 'full_path', 'created_at', 'updated_at']


class CurrencySerializer(serializers.ModelSerializer):
    """Serializer pour Currency"""
    
    formatted_example = serializers.SerializerMethodField()
    
    class Meta:
        model = Currency
        fields = [
            'id', 'eid', 'code', 'name', 'symbol',
            'decimal_places', 'rounding', 'symbol_position',
            'decimal_separator', 'thousand_separator',
            'is_active', 'formatted_example',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['eid', 'formatted_example', 'created_at', 'updated_at']
    
    def get_formatted_example(self, obj):
        """Retourne un exemple de formatage"""
        return obj.format_amount(1234567.89)


class CurrencyRateSerializer(serializers.ModelSerializer):
    """Serializer pour CurrencyRate"""
    
    from_currency_code = serializers.CharField(
        source='from_currency.code',
        read_only=True
    )
    to_currency_code = serializers.CharField(
        source='to_currency.code',
        read_only=True
    )
    
    class Meta:
        model = CurrencyRate
        fields = [
            'id', 'eid', 'from_currency', 'from_currency_code',
            'to_currency', 'to_currency_code', 'rate',
            'effective_date', 'source', 'is_manual',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['eid', 'created_at', 'updated_at']


class CategorySerializer(serializers.ModelSerializer):
    """Serializer pour Category"""
    
    full_path = serializers.CharField(source='get_full_path', read_only=True)
    descendants_count = serializers.CharField(
        source='get_descendants_count',
        read_only=True
    )
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    
    class Meta:
        model = Category
        fields = [
            'id', 'eid', 'code', 'name', 'description',
            'parent', 'parent_name', 'full_path',
            'category_type', 'icon', 'color', 'sequence',
            'descendants_count', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'eid', 'full_path', 'descendants_count',
            'created_at', 'updated_at'
        ]


class TagSerializer(serializers.ModelSerializer):
    """Serializer pour Tag"""
    
    class Meta:
        model = Tag
        fields = [
            'id', 'eid', 'code', 'name', 'description',
            'color', 'tag_type', 'usage_count', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['eid', 'usage_count', 'created_at', 'updated_at']


class SequenceSerializer(serializers.ModelSerializer):
    """Serializer pour Sequence"""
    
    example = serializers.CharField(read_only=True)
    
    class Meta:
        model = Sequence
        fields = [
            'id', 'eid', 'code', 'name', 'description',
            'prefix', 'suffix', 'padding', 'current_number',
            'increment', 'reset_frequency', 'last_reset_date',
            'use_date_variables', 'example', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['eid', 'example', 'created_at', 'updated_at']


class AttachmentSerializer(serializers.ModelSerializer):
    """Serializer pour Attachment"""
    
    file_url = serializers.SerializerMethodField()
    human_readable_size = serializers.CharField(
        source='get_human_readable_size',
        read_only=True
    )
    
    class Meta:
        model = Attachment
        fields = [
            'id', 'eid', 'content_type', 'object_id',
            'file', 'file_url', 'original_filename',
            'file_size', 'human_readable_size',
            'mime_type', 'file_extension', 'file_hash',
            'title', 'description', 'attachment_type',
            'is_public', 'download_count',
            'is_scanned', 'scan_result',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'eid', 'file_url', 'file_size', 'human_readable_size',
            'mime_type', 'file_extension', 'file_hash',
            'download_count', 'is_scanned', 'scan_result',
            'created_at', 'updated_at'
        ]
    
    def get_file_url(self, obj):
        """Retourne l'URL complète du fichier"""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
