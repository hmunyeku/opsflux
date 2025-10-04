"""
Modèles User étendu avec système de permissions
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from core.models.base import AbstractBaseModel
import uuid


class User(AbstractUser):
    """
    Modèle User personnalisé
    Étend AbstractUser avec des champs supplémentaires
    """
    
    # UUID externe pour intégrations
    eid = models.UUIDField(
        _("External ID"),
        unique=True,
        default=uuid.uuid4,
        editable=False,
        db_index=True
    )
    
    # Remplacer email unique
    email = models.EmailField(
        _("Email"),
        unique=True,
        error_messages={
            'unique': _("Un utilisateur avec cet email existe déjà."),
        },
    )
    
    # Informations additionnelles
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
    
    avatar = models.ImageField(
        _("Avatar"),
        upload_to='users/avatars/',
        blank=True,
        null=True
    )
    
    # Entreprise et unité
    company = models.ForeignKey(
        'core.Company',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users',
        verbose_name=_("Société")
    )
    
    business_unit = models.ForeignKey(
        'core.BusinessUnit',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users',
        verbose_name=_("Unité opérationnelle")
    )
    
    # Manager hiérarchique
    manager = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subordinates',
        verbose_name=_("Manager")
    )
    
    # Préférences
    language = models.CharField(
        _("Langue"),
        max_length=10,
        default="fr"
    )
    
    timezone = models.CharField(
        _("Fuseau horaire"),
        max_length=50,
        default="UTC"
    )
    
    theme = models.CharField(
        _("Thème"),
        max_length=20,
        choices=[
            ('light', _("Clair")),
            ('dark', _("Sombre")),
            ('auto', _("Automatique")),
        ],
        default='auto'
    )
    
    # Préférences notifications
    email_notifications = models.BooleanField(
        _("Notifications email"),
        default=True
    )
    
    push_notifications = models.BooleanField(
        _("Notifications push"),
        default=True
    )
    
    # Type d'authentification
    AUTH_TYPE_CHOICES = [
        ('native', _("Native OpsFlux")),
        ('ldap', _("LDAP/Active Directory")),
        ('sso', _("SSO")),
        ('oauth2', _("OAuth2")),
    ]
    
    auth_type = models.CharField(
        _("Type d'authentification"),
        max_length=20,
        choices=AUTH_TYPE_CHOICES,
        default='native'
    )
    
    # Identifiant externe (LDAP, SSO, etc.)
    external_id = models.CharField(
        _("Identifiant externe"),
        max_length=255,
        blank=True,
        default="",
        db_index=True
    )
    
    # Statut
    is_archived = models.BooleanField(
        _("Archivé"),
        default=False,
        help_text=_("Utilisateur archivé (inactif)")
    )
    
    # Métadonnées
    metadata = models.JSONField(
        _("Métadonnées"),
        default=dict,
        blank=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(_("Créé le"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Modifié le"), auto_now=True)
    last_login_ip = models.GenericIPAddressField(
        _("Dernière IP de connexion"),
        null=True,
        blank=True
    )
    
    class Meta:
        verbose_name = _("Utilisateur")
        verbose_name_plural = _("Utilisateurs")
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return self.get_full_name() or self.username
    
    def get_display_name(self):
        """Retourne le nom d'affichage"""
        full_name = self.get_full_name()
        return full_name if full_name else self.username
    
    def get_avatar_url(self):
        """Retourne l'URL de l'avatar ou une image par défaut"""
        if self.avatar:
            return self.avatar.url
        return f"https://ui-avatars.com/api/?name={self.get_display_name()}&background=random"


class Role(AbstractBaseModel):
    """
    Modèle Role - Rôles des utilisateurs
    Système de permissions basé sur les rôles (RBAC)
    """
    
    name = models.CharField(
        _("Nom"),
        max_length=100,
        unique=True
    )
    
    code = models.CharField(
        _("Code"),
        max_length=50,
        unique=True,
        db_index=True
    )
    
    description = models.TextField(
        _("Description"),
        blank=True,
        default=""
    )
    
    # Permissions
    permissions = models.ManyToManyField(
        'Permission',
        blank=True,
        related_name='roles',
        verbose_name=_("Permissions")
    )
    
    # Niveau hiérarchique (pour héritage permissions)
    level = models.PositiveIntegerField(
        _("Niveau"),
        default=0,
        help_text=_("Niveau hiérarchique (plus élevé = plus de permissions)")
    )
    
    # Rôle système (non modifiable/supprimable)
    is_system = models.BooleanField(
        _("Rôle système"),
        default=False
    )
    
    is_active = models.BooleanField(
        _("Actif"),
        default=True
    )
    
    class Meta:
        verbose_name = _("Rôle")
        verbose_name_plural = _("Rôles")
        ordering = ['-level', 'name']
    
    def __str__(self):
        return self.name


class Permission(AbstractBaseModel):
    """
    Modèle Permission - Permissions granulaires
    Format: app.action_resource (ex: users.create_user, invoices.delete_invoice)
    """
    
    name = models.CharField(
        _("Nom"),
        max_length=100
    )
    
    code = models.CharField(
        _("Code"),
        max_length=100,
        unique=True,
        db_index=True,
        help_text=_("Format: app.action_resource")
    )
    
    description = models.TextField(
        _("Description"),
        blank=True,
        default=""
    )
    
    # Catégorie (pour grouper les permissions)
    category = models.CharField(
        _("Catégorie"),
        max_length=50,
        db_index=True,
        help_text=_("Module ou fonctionnalité")
    )
    
    # Type d'action
    ACTION_CHOICES = [
        ('create', _("Créer")),
        ('read', _("Lire")),
        ('update', _("Modifier")),
        ('delete', _("Supprimer")),
        ('export', _("Exporter")),
        ('import', _("Importer")),
        ('execute', _("Exécuter")),
        ('manage', _("Gérer")),
    ]
    
    action = models.CharField(
        _("Action"),
        max_length=20,
        choices=ACTION_CHOICES
    )
    
    resource = models.CharField(
        _("Ressource"),
        max_length=50,
        help_text=_("Type de ressource concernée")
    )
    
    is_system = models.BooleanField(
        _("Permission système"),
        default=False
    )
    
    class Meta:
        verbose_name = _("Permission")
        verbose_name_plural = _("Permissions")
        ordering = ['category', 'resource', 'action']
    
    def __str__(self):
        return f"{self.category}.{self.action}_{self.resource}"


class UserRole(models.Model):
    """
    Modèle de liaison User-Role avec contexte
    Permet d'attribuer des rôles avec portée (company, business_unit)
    """
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_roles',
        verbose_name=_("Utilisateur")
    )
    
    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name='user_assignments',
        verbose_name=_("Rôle")
    )
    
    # Contexte d'application du rôle
    company = models.ForeignKey(
        'core.Company',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='role_assignments',
        verbose_name=_("Société"),
        help_text=_("Limiter le rôle à cette société")
    )
    
    business_unit = models.ForeignKey(
        'core.BusinessUnit',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='role_assignments',
        verbose_name=_("Unité opérationnelle"),
        help_text=_("Limiter le rôle à cette unité")
    )
    
    # Période de validité
    valid_from = models.DateField(
        _("Valide à partir de"),
        null=True,
        blank=True
    )
    
    valid_to = models.DateField(
        _("Valide jusqu'au"),
        null=True,
        blank=True
    )
    
    is_active = models.BooleanField(
        _("Actif"),
        default=True
    )
    
    created_at = models.DateTimeField(_("Créé le"), auto_now_add=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='role_assignments_created',
        verbose_name=_("Créé par")
    )
    
    class Meta:
        verbose_name = _("Attribution de rôle")
        verbose_name_plural = _("Attributions de rôles")
        unique_together = [['user', 'role', 'company', 'business_unit']]
    
    def __str__(self):
        return f"{self.user} - {self.role}"


class UIPreference(AbstractBaseModel):
    """
    Modèle UIPreference - Préférences d'interface utilisateur
    Contrôle quels éléments UI sont visibles pour chaque utilisateur
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='ui_preferences',
        verbose_name=_("Utilisateur")
    )

    # Préférences générales UI
    compact_mode = models.BooleanField(
        _("Mode compact"),
        default=False,
        help_text=_("Affichage compact de l'interface")
    )

    sidebar_collapsed = models.BooleanField(
        _("Barre latérale réduite"),
        default=False
    )

    show_tooltips = models.BooleanField(
        _("Afficher les infobulles"),
        default=True
    )

    # Éléments visibles dans la ShellBar
    show_search = models.BooleanField(
        _("Afficher la recherche"),
        default=True
    )

    show_notifications = models.BooleanField(
        _("Afficher les notifications"),
        default=True
    )

    show_help = models.BooleanField(
        _("Afficher l'aide"),
        default=True
    )

    # Éléments visibles dans la navigation
    visible_menu_items = models.JSONField(
        _("Éléments de menu visibles"),
        default=list,
        blank=True,
        help_text=_("Liste des codes d'éléments de menu à afficher")
    )

    # Préférences du tableau de bord
    dashboard_layout = models.JSONField(
        _("Disposition du tableau de bord"),
        default=dict,
        blank=True,
        help_text=_("Configuration des widgets et leur position")
    )

    # Préférences des tableaux
    default_page_size = models.PositiveIntegerField(
        _("Taille de page par défaut"),
        default=20,
        help_text=_("Nombre d'éléments par page dans les tableaux")
    )

    # Raccourcis personnalisés
    custom_shortcuts = models.JSONField(
        _("Raccourcis personnalisés"),
        default=list,
        blank=True,
        help_text=_("Raccourcis clavier personnalisés")
    )

    # Widgets favoris
    favorite_widgets = models.JSONField(
        _("Widgets favoris"),
        default=list,
        blank=True,
        help_text=_("Liste des widgets à afficher en priorité")
    )

    # Page d'accueil par défaut
    home_page = models.CharField(
        _("Page d'accueil"),
        max_length=100,
        default="/dashboard",
        help_text=_("URL de la page d'accueil par défaut")
    )

    class Meta:
        verbose_name = _("Préférence d'interface")
        verbose_name_plural = _("Préférences d'interface")

    def __str__(self):
        return f"Préférences UI - {self.user}"


class MenuItem(AbstractBaseModel):
    """
    Modèle MenuItem - Éléments de menu configurables
    Système de navigation dynamique avec permissions
    """

    code = models.CharField(
        _("Code"),
        max_length=50,
        unique=True,
        db_index=True
    )

    label = models.CharField(
        _("Libellé"),
        max_length=100
    )

    icon = models.CharField(
        _("Icône"),
        max_length=50,
        blank=True,
        default="",
        help_text=_("Nom de l'icône UI5")
    )

    path = models.CharField(
        _("Chemin"),
        max_length=200,
        blank=True,
        default="",
        help_text=_("URL ou route")
    )

    # Hiérarchie
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_("Parent")
    )

    order = models.PositiveIntegerField(
        _("Ordre"),
        default=0
    )

    # Design
    DESIGN_CHOICES = [
        ('Default', _("Par défaut")),
        ('Action', _("Action")),
    ]

    design = models.CharField(
        _("Design"),
        max_length=20,
        choices=DESIGN_CHOICES,
        default='Default'
    )

    # Type d'élément
    TYPE_CHOICES = [
        ('item', _("Élément normal")),
        ('fixed', _("Élément fixe")),
        ('separator', _("Séparateur")),
    ]

    item_type = models.CharField(
        _("Type"),
        max_length=20,
        choices=TYPE_CHOICES,
        default='item'
    )

    # Permissions requises
    required_permissions = models.ManyToManyField(
        'Permission',
        blank=True,
        related_name='menu_items',
        verbose_name=_("Permissions requises"),
        help_text=_("Permissions nécessaires pour voir cet élément")
    )

    # Disponibilité
    is_active = models.BooleanField(
        _("Actif"),
        default=True
    )

    is_system = models.BooleanField(
        _("Élément système"),
        default=False,
        help_text=_("Élément système non modifiable")
    )

    # Module associé
    module = models.ForeignKey(
        'modules.Module',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='menu_items',
        verbose_name=_("Module"),
        help_text=_("Module qui fournit cet élément")
    )

    class Meta:
        verbose_name = _("Élément de menu")
        verbose_name_plural = _("Éléments de menu")
        ordering = ['order', 'label']

    def __str__(self):
        return f"{self.code} - {self.label}"

    def has_permission(self, user):
        """Vérifie si l'utilisateur a les permissions pour voir cet élément"""
        if not self.required_permissions.exists():
            return True

        # Récupérer toutes les permissions de l'utilisateur via ses rôles
        user_permissions = Permission.objects.filter(
            roles__user_assignments__user=user,
            roles__user_assignments__is_active=True
        ).distinct()

        # L'utilisateur doit avoir TOUTES les permissions requises
        required_perm_ids = set(self.required_permissions.values_list('id', flat=True))
        user_perm_ids = set(user_permissions.values_list('id', flat=True))

        return required_perm_ids.issubset(user_perm_ids)
