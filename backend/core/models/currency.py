"""
Modèles Currency et CurrencyRate
Gestion multi-devises avec historisation des taux
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from decimal import Decimal
from .base import AbstractBaseModel


class Currency(AbstractBaseModel):
    """
    Modèle Currency - Devises
    Liste des devises supportées avec symboles et paramètres
    """
    
    code = models.CharField(
        _("Code ISO"),
        max_length=3,
        unique=True,
        db_index=True,
        help_text=_("Code devise ISO 4217 (ex: EUR, USD, XAF)")
    )
    
    name = models.CharField(
        _("Nom"),
        max_length=100
    )
    
    symbol = models.CharField(
        _("Symbole"),
        max_length=10,
        help_text=_("Symbole de la devise (ex: €, $, FCFA)")
    )
    
    # Paramètres d'affichage
    decimal_places = models.PositiveSmallIntegerField(
        _("Décimales"),
        default=2,
        help_text=_("Nombre de décimales pour l'affichage")
    )
    
    rounding = models.DecimalField(
        _("Arrondi"),
        max_digits=12,
        decimal_places=6,
        default=Decimal('0.01'),
        help_text=_("Valeur d'arrondi (ex: 0.01 pour centimes)")
    )
    
    # Position du symbole
    SYMBOL_POSITION_CHOICES = [
        ('before', _("Avant")),
        ('after', _("Après")),
    ]
    
    symbol_position = models.CharField(
        _("Position du symbole"),
        max_length=10,
        choices=SYMBOL_POSITION_CHOICES,
        default='after'
    )
    
    # Séparateurs
    decimal_separator = models.CharField(
        _("Séparateur décimal"),
        max_length=1,
        default=','
    )
    
    thousand_separator = models.CharField(
        _("Séparateur milliers"),
        max_length=1,
        default=' '
    )
    
    # Status
    is_active = models.BooleanField(
        _("Active"),
        default=True,
        db_index=True
    )
    
    class Meta:
        verbose_name = _("Devise")
        verbose_name_plural = _("Devises")
        ordering = ['code']
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    def format_amount(self, amount):
        """
        Formate un montant selon les paramètres de la devise
        """
        # Arrondir le montant
        rounded = round(amount / self.rounding) * self.rounding
        
        # Formater avec les décimales
        formatted = f"{rounded:.{self.decimal_places}f}"
        
        # Remplacer le point par le séparateur décimal
        formatted = formatted.replace('.', self.decimal_separator)
        
        # Ajouter les séparateurs de milliers
        parts = formatted.split(self.decimal_separator)
        integer_part = parts[0]
        decimal_part = parts[1] if len(parts) > 1 else ''
        
        # Grouper par 3 chiffres
        integer_with_separator = ''
        for i, digit in enumerate(reversed(integer_part)):
            if i > 0 and i % 3 == 0:
                integer_with_separator = self.thousand_separator + integer_with_separator
            integer_with_separator = digit + integer_with_separator
        
        formatted = integer_with_separator
        if decimal_part:
            formatted += self.decimal_separator + decimal_part
        
        # Ajouter le symbole
        if self.symbol_position == 'before':
            return f"{self.symbol}{formatted}"
        else:
            return f"{formatted} {self.symbol}"


class CurrencyRate(AbstractBaseModel):
    """
    Modèle CurrencyRate - Taux de change
    Historisation des taux de change entre devises
    """
    
    from_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name='rates_from',
        verbose_name=_("Devise source")
    )
    
    to_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name='rates_to',
        verbose_name=_("Devise cible")
    )
    
    rate = models.DecimalField(
        _("Taux"),
        max_digits=20,
        decimal_places=10,
        validators=[MinValueValidator(Decimal('0.0000000001'))],
        help_text=_("1 unité de devise source = X unités de devise cible")
    )
    
    effective_date = models.DateField(
        _("Date d'effet"),
        db_index=True,
        help_text=_("Date à partir de laquelle ce taux est applicable")
    )
    
    # Source du taux
    source = models.CharField(
        _("Source"),
        max_length=100,
        blank=True,
        default="",
        help_text=_("Source du taux (API, Banque, Manuel, etc.)")
    )
    
    is_manual = models.BooleanField(
        _("Taux manuel"),
        default=False,
        help_text=_("Taux saisi manuellement (non automatique)")
    )
    
    class Meta:
        verbose_name = _("Taux de change")
        verbose_name_plural = _("Taux de change")
        ordering = ['-effective_date', 'from_currency', 'to_currency']
        unique_together = [['from_currency', 'to_currency', 'effective_date']]
        indexes = [
            models.Index(fields=['from_currency', 'to_currency', '-effective_date']),
        ]
    
    def __str__(self):
        return f"{self.from_currency.code}/{self.to_currency.code} = {self.rate} ({self.effective_date})"
    
    @staticmethod
    def convert(amount, from_currency, to_currency, date=None):
        """
        Convertit un montant d'une devise à une autre à une date donnée
        """
        from django.utils import timezone
        
        if from_currency == to_currency:
            return amount
        
        if date is None:
            date = timezone.now().date()
        
        # Chercher le taux le plus récent avant ou égal à la date
        rate = CurrencyRate.objects.filter(
            from_currency=from_currency,
            to_currency=to_currency,
            effective_date__lte=date,
            is_deleted=False
        ).order_by('-effective_date').first()
        
        if rate:
            return amount * rate.rate
        
        # Tenter la conversion inverse
        inverse_rate = CurrencyRate.objects.filter(
            from_currency=to_currency,
            to_currency=from_currency,
            effective_date__lte=date,
            is_deleted=False
        ).order_by('-effective_date').first()
        
        if inverse_rate:
            return amount / inverse_rate.rate
        
        raise ValueError(f"Aucun taux de change trouvé pour {from_currency.code} vers {to_currency.code}")
