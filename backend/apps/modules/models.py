"""
Modèles de l'app Modules
"""
from django.db import models
from django.contrib.auth import get_user_model
from core.models.base import AbstractBaseModel

User = get_user_model()


class Module(AbstractBaseModel):
    """
    Modèle représentant un module OpsFlux

    Un module est une extension installable qui ajoute des fonctionnalités à OpsFlux.
    Il peut définir des modèles, des vues, des APIs, des menus, etc.
    """

    # Identification
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nom du module",
        help_text="Nom technique du module (ex: crm, inventory, accounting)"
    )

    display_name = models.CharField(
        max_length=200,
        verbose_name="Nom d'affichage",
        help_text="Nom convivial du module"
    )

    description = models.TextField(
        blank=True,
        verbose_name="Description",
        help_text="Description détaillée du module"
    )

    # Versioning
    version = models.CharField(
        max_length=20,
        verbose_name="Version",
        help_text="Version du module (ex: 1.0.0)"
    )

    # État
    is_installed = models.BooleanField(
        default=False,
        verbose_name="Installé",
        help_text="Le module est installé"
    )

    is_active = models.BooleanField(
        default=False,
        verbose_name="Actif",
        help_text="Le module est activé"
    )

    is_core = models.BooleanField(
        default=False,
        verbose_name="Module core",
        help_text="Module du système (non désinstallable)"
    )

    # Métadonnées
    author = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Auteur",
        help_text="Auteur du module"
    )

    icon = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Icône",
        help_text="Icône UI5 du module"
    )

    category = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Catégorie",
        help_text="Catégorie du module (CRM, Finance, RH, etc.)"
    )

    # Dépendances
    dependencies = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Dépendances",
        help_text="Liste des modules requis (JSON array)"
    )

    # Licence
    license_key = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Clé de licence",
        help_text="Clé de licence du module"
    )

    license_type = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Type de licence",
        help_text="Type de licence (free, commercial, trial)"
    )

    # Installation
    install_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date d'installation"
    )

    installed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='installed_modules',
        verbose_name="Installé par"
    )

    # Configuration
    config = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Configuration",
        help_text="Configuration spécifique du module (JSON)"
    )

    class Meta:
        verbose_name = "Module"
        verbose_name_plural = "Modules"
        ordering = ['display_name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active', 'is_installed']),
        ]

    def __str__(self):
        return f"{self.display_name} ({self.version})"

    def save(self, *args, **kwargs):
        """Override save pour valider les dépendances"""
        super().save(*args, **kwargs)

    def activate(self):
        """Activer le module"""
        if not self.is_installed:
            raise ValueError("Le module doit être installé avant d'être activé")
        self.is_active = True
        self.save()

    def deactivate(self):
        """Désactiver le module"""
        if self.is_core:
            raise ValueError("Un module core ne peut pas être désactivé")
        self.is_active = False
        self.save()

    def check_dependencies(self):
        """Vérifier que toutes les dépendances sont installées et actives"""
        for dep_name in self.dependencies:
            try:
                dep = Module.objects.get(name=dep_name)
                if not dep.is_installed or not dep.is_active:
                    return False, f"Dépendance {dep_name} non disponible"
            except Module.DoesNotExist:
                return False, f"Dépendance {dep_name} non trouvée"
        return True, "OK"


class ModulePermission(AbstractBaseModel):
    """
    Permissions spécifiques à un module
    Permet aux modules de définir leurs propres permissions
    """

    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name='module_permissions',
        verbose_name="Module"
    )

    codename = models.CharField(
        max_length=100,
        verbose_name="Code",
        help_text="Code de la permission (ex: can_export_data)"
    )

    name = models.CharField(
        max_length=255,
        verbose_name="Nom",
        help_text="Nom descriptif de la permission"
    )

    description = models.TextField(
        blank=True,
        verbose_name="Description"
    )

    class Meta:
        verbose_name = "Permission Module"
        verbose_name_plural = "Permissions Module"
        unique_together = [['module', 'codename']]
        indexes = [
            models.Index(fields=['module', 'codename']),
        ]

    def __str__(self):
        return f"{self.module.name}.{self.codename}"


class ModuleInstallation(AbstractBaseModel):
    """
    Historique des installations/désinstallations de modules
    """

    ACTION_CHOICES = [
        ('install', 'Installation'),
        ('uninstall', 'Désinstallation'),
        ('activate', 'Activation'),
        ('deactivate', 'Désactivation'),
        ('update', 'Mise à jour'),
    ]

    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name='installation_history',
        verbose_name="Module"
    )

    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        verbose_name="Action"
    )

    version = models.CharField(
        max_length=20,
        verbose_name="Version"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='module_actions',
        verbose_name="Utilisateur"
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ('success', 'Succès'),
            ('failed', 'Échec'),
            ('pending', 'En cours'),
        ],
        default='pending',
        verbose_name="Statut"
    )

    error_message = models.TextField(
        blank=True,
        verbose_name="Message d'erreur"
    )

    execution_time = models.FloatField(
        null=True,
        blank=True,
        verbose_name="Temps d'exécution (secondes)"
    )

    class Meta:
        verbose_name = "Installation Module"
        verbose_name_plural = "Installations Module"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['module', '-created_at']),
            models.Index(fields=['action', 'status']),
        ]

    def __str__(self):
        return f"{self.module.name} - {self.action} ({self.status})"
