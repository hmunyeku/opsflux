"""
Modèles de base abstraits pour OpsFlux
Tous les modèles du système héritent de ces classes de base
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
import uuid


class AbstractBaseModel(models.Model):
    """
    Modèle de base abstrait pour tous les modèles OpsFlux
    Fournit les champs communs : eID, timestamps, soft delete, audit trail
    """
    
    # UUID pour identification externe (intégrations tierces)
    eid = models.UUIDField(
        _("External ID"),
        unique=True,
        default=uuid.uuid4,
        editable=False,
        db_index=True,
        help_text=_("Identifiant unique pour les intégrations externes")
    )
    
    # Timestamps automatiques
    created_at = models.DateTimeField(
        _("Créé le"),
        auto_now_add=True,
        db_index=True
    )
    
    updated_at = models.DateTimeField(
        _("Modifié le"),
        auto_now=True,
        db_index=True
    )
    
    # Audit Trail
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(app_label)s_%(class)s_created',
        verbose_name=_("Créé par")
    )
    
    updated_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(app_label)s_%(class)s_updated',
        verbose_name=_("Modifié par")
    )
    
    # Soft Delete
    is_deleted = models.BooleanField(
        _("Supprimé"),
        default=False,
        db_index=True,
        help_text=_("Marqué comme supprimé (soft delete)")
    )
    
    deleted_at = models.DateTimeField(
        _("Supprimé le"),
        null=True,
        blank=True
    )
    
    deleted_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(app_label)s_%(class)s_deleted',
        verbose_name=_("Supprimé par")
    )
    
    # Métadonnées additionnelles (JSON flexible)
    metadata = models.JSONField(
        _("Métadonnées"),
        default=dict,
        blank=True,
        help_text=_("Données additionnelles au format JSON")
    )
    
    class Meta:
        abstract = True
        ordering = ['-created_at']
        get_latest_by = 'created_at'
    
    def __str__(self):
        return f"{self.__class__.__name__} - {self.eid}"
    
    def soft_delete(self, user=None):
        """Effectue une suppression logique (soft delete)"""
        from django.utils import timezone
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.deleted_by = user
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by'])
    
    def restore(self):
        """Restaure un objet supprimé logiquement"""
        self.is_deleted = False
        self.deleted_at = None
        self.deleted_by = None
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by'])


class AbstractNamedModel(AbstractBaseModel):
    """
    Modèle abstrait pour les entités nommées
    Ajoute nom, code, description, active
    """
    
    code = models.CharField(
        _("Code"),
        max_length=50,
        unique=True,
        db_index=True,
        help_text=_("Code unique identifiant l'entité")
    )
    
    name = models.CharField(
        _("Nom"),
        max_length=255,
        db_index=True
    )
    
    description = models.TextField(
        _("Description"),
        blank=True,
        default=""
    )
    
    is_active = models.BooleanField(
        _("Actif"),
        default=True,
        db_index=True,
        help_text=_("Indique si l'entité est active")
    )
    
    class Meta:
        abstract = True
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class AbstractAddressModel(models.Model):
    """
    Modèle abstrait pour les adresses
    Peut être utilisé pour adresses de sociétés, clients, etc.
    """
    
    street1 = models.CharField(
        _("Adresse ligne 1"),
        max_length=255,
        blank=True,
        default=""
    )
    
    street2 = models.CharField(
        _("Adresse ligne 2"),
        max_length=255,
        blank=True,
        default=""
    )
    
    city = models.CharField(
        _("Ville"),
        max_length=100,
        blank=True,
        default=""
    )
    
    state = models.CharField(
        _("État/Région"),
        max_length=100,
        blank=True,
        default=""
    )
    
    postal_code = models.CharField(
        _("Code postal"),
        max_length=20,
        blank=True,
        default=""
    )
    
    country = models.CharField(
        _("Pays"),
        max_length=100,
        blank=True,
        default=""
    )
    
    country_code = models.CharField(
        _("Code pays (ISO)"),
        max_length=2,
        blank=True,
        default="",
        help_text=_("Code pays ISO 3166-1 alpha-2")
    )
    
    latitude = models.DecimalField(
        _("Latitude"),
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    
    longitude = models.DecimalField(
        _("Longitude"),
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    
    class Meta:
        abstract = True
    
    def get_full_address(self):
        """Retourne l'adresse complète formatée"""
        parts = [
            self.street1,
            self.street2,
            f"{self.postal_code} {self.city}".strip(),
            self.state,
            self.country
        ]
        return ', '.join(filter(None, parts))


class AbstractPartyModel(AbstractNamedModel, AbstractAddressModel):
    """
    Modèle abstrait pour les parties prenantes (Party)
    Base pour Customer, Supplier, Employee, Partner
    """
    
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
    
    mobile = models.CharField(
        _("Mobile"),
        max_length=20,
        blank=True,
        default=""
    )
    
    website = models.URLField(
        _("Site web"),
        blank=True,
        default=""
    )
    
    # Informations fiscales
    tax_id = models.CharField(
        _("Numéro fiscal"),
        max_length=50,
        blank=True,
        default="",
        help_text=_("Numéro d'identification fiscale")
    )
    
    vat_number = models.CharField(
        _("Numéro TVA"),
        max_length=50,
        blank=True,
        default="",
        help_text=_("Numéro de TVA intracommunautaire")
    )
    
    # Langue et devise préférées
    language = models.CharField(
        _("Langue"),
        max_length=10,
        default="fr",
        help_text=_("Code langue ISO 639-1")
    )
    
    currency = models.ForeignKey(
        'core.Currency',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        verbose_name=_("Devise"),
        help_text=_("Devise préférée pour cette partie")
    )
    
    # Notes
    notes = models.TextField(
        _("Notes"),
        blank=True,
        default=""
    )
    
    class Meta:
        abstract = True
