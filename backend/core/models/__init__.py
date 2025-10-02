"""
OpsFlux Core Models
Modèles de base héritables pour tout le système
"""
from .base import (
    AbstractBaseModel,
    AbstractNamedModel,
    AbstractAddressModel,
    AbstractPartyModel,
)
from .company import Company, BusinessUnit
from .currency import Currency, CurrencyRate
from .category import Category, Tag
from .sequence import Sequence
from .attachment import Attachment

__all__ = [
    # Base Models
    'AbstractBaseModel',
    'AbstractNamedModel',
    'AbstractAddressModel',
    'AbstractPartyModel',
    
    # Company Models
    'Company',
    'BusinessUnit',
    
    # Currency Models
    'Currency',
    'CurrencyRate',
    
    # Category Models
    'Category',
    'Tag',
    
    # System Models
    'Sequence',
    'Attachment',
]
