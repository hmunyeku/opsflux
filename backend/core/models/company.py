"""
Modèles de Company et BusinessUnit
Gestion multi-sociétés et multi-sites
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from .base import AbstractNamedModel, AbstractAddressModel


class Company(AbstractNamedModel, AbstractAddressModel):
    """
    Modèle Company - Entité juridique principale
    Supporte le multi-tenant avec données isolées par société
    """
    
    # Informations légales
    legal_name = models.CharField(
        _("Raison sociale"),
        max_length=255,
        help_text=_("Nom légal complet de la société")
    )
    
    registration_number = models.CharField(
        _("Numéro d'enregistrement"),
        max_length=50,
        blank=True,
        default="",
        help_text=_("SIREN, Company Number, etc.")
    )
    
    tax_id = models.CharField(
        _("Numéro fiscal"),
        max_length=50,
        blank=True,
        default=""
    )
    
    vat_number = models.CharField(
        _("Numéro TVA"),
        max_length=50,
        blank=True,
        default=""
    )
    
    # Contact
    email = models.EmailField(
        _("Email principal"),
        blank=True,
        default=""
    )
    
    phone = models.CharField(
        _("Téléphone"),
        max_length=20,
        blank=True,
        default=""
    )
    
    website = models.URLField(
        _("Site web"),
        blank=True,
        default=""
    )
    
    # Paramètres
    currency = models.ForeignKey(
        'Currency',
        on_delete=models.PROTECT,
        related_name='companies',
        verbose_name=_("Devise principale")
    )
    
    language = models.CharField(
        _("Langue"),
        max_length=10,
        default="fr",
        help_text=_("Code langue ISO 639-1")
    )
    
    timezone = models.CharField(
        _("Fuseau horaire"),
        max_length=50,
        default="UTC"
    )
    
    # Exercice fiscal
    fiscal_year_start_month = models.PositiveSmallIntegerField(
        _("Mois de début d'exercice"),
        default=1,
        help_text=_("1 pour janvier, 2 pour février, etc.")
    )
    
    fiscal_year_start_day = models.PositiveSmallIntegerField(
        _("Jour de début d'exercice"),
        default=1
    )
    
    # Logo
    logo = models.ImageField(
        _("Logo"),
        upload_to='companies/logos/',
        blank=True,
        null=True
    )
    
    class Meta:
        verbose_name = _("Société")
        verbose_name_plural = _("Sociétés")
        ordering = ['name']
    
    def __str__(self):
        return self.name


class BusinessUnit(AbstractNamedModel, AbstractAddressModel):
    """
    Modèle BusinessUnit - Unité opérationnelle / Site
    Permet de gérer plusieurs sites/départements au sein d'une société
    """
    
    # Rattachement
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='business_units',
        verbose_name=_("Société")
    )
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_("Unité parente"),
        help_text=_("Pour créer une hiérarchie d'unités")
    )
    
    # Type d'unité
    UNIT_TYPE_CHOICES = [
        ('headquarters', _("Siège social")),
        ('branch', _("Agence")),
        ('warehouse', _("Entrepôt")),
        ('factory', _("Usine")),
        ('office', _("Bureau")),
        ('department', _("Département")),
        ('other', _("Autre")),
    ]
    
    unit_type = models.CharField(
        _("Type d'unité"),
        max_length=20,
        choices=UNIT_TYPE_CHOICES,
        default='branch'
    )
    
    # Contact
    email = models.EmailField(
        _("Email"),
        blank=True,
        default=""
    )
    
    phone = models.CharField(
        _("Téléphone"),
        max_length=20,
        blank=True,
        default=""
    )
    
    # Responsable
    manager = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_business_units',
        verbose_name=_("Responsable")
    )
    
    # Comptabilité analytique
    is_cost_center = models.BooleanField(
        _("Centre de coûts"),
        default=False,
        help_text=_("Cette unité est un centre de coûts")
    )
    
    is_profit_center = models.BooleanField(
        _("Centre de profit"),
        default=False,
        help_text=_("Cette unité est un centre de profit")
    )
    
    cost_center_code = models.CharField(
        _("Code centre de coûts"),
        max_length=20,
        blank=True,
        default=""
    )
    
    class Meta:
        verbose_name = _("Unité opérationnelle")
        verbose_name_plural = _("Unités opérationnelles")
        ordering = ['company', 'name']
        unique_together = [['company', 'code']]
    
    def __str__(self):
        return f"{self.company.code} - {self.name}"
    
    def get_full_path(self):
        """Retourne le chemin complet hiérarchique"""
        if self.parent:
            return f"{self.parent.get_full_path()} > {self.name}"
        return self.name
