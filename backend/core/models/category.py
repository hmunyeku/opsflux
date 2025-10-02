"""
Modèles Category et Tag
Système de catégorisation hiérarchique et tags flexibles
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey
from .base import AbstractNamedModel


class Category(MPTTModel, AbstractNamedModel):
    """
    Modèle Category - Catégories hiérarchiques
    Utilise MPTT pour des arbres hiérarchiques performants
    """
    
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_("Catégorie parente")
    )
    
    # Type de catégorie (pour différencier les usages)
    category_type = models.CharField(
        _("Type de catégorie"),
        max_length=50,
        db_index=True,
        help_text=_("Type: product, document, task, etc.")
    )
    
    # Icône (optionnel)
    icon = models.CharField(
        _("Icône"),
        max_length=50,
        blank=True,
        default="",
        help_text=_("Nom de l'icône (ex: fa-folder)")
    )
    
    # Couleur (optionnel)
    color = models.CharField(
        _("Couleur"),
        max_length=7,
        blank=True,
        default="",
        help_text=_("Code couleur hexadécimal (ex: #FF5733)")
    )
    
    # Ordre d'affichage
    sequence = models.PositiveIntegerField(
        _("Séquence"),
        default=10,
        help_text=_("Ordre d'affichage (plus petit = plus haut)")
    )
    
    class MPTTMeta:
        order_insertion_by = ['sequence', 'name']
    
    class Meta:
        verbose_name = _("Catégorie")
        verbose_name_plural = _("Catégories")
        ordering = ['category_type', 'sequence', 'name']
        unique_together = [['category_type', 'code']]
        indexes = [
            models.Index(fields=['category_type', 'is_active']),
        ]
    
    def __str__(self):
        return self.get_full_path()
    
    def get_full_path(self, separator=' > '):
        """
        Retourne le chemin complet hiérarchique
        Ex: "Produits > Électronique > Smartphones"
        """
        ancestors = self.get_ancestors(include_self=True)
        return separator.join([cat.name for cat in ancestors])
    
    def get_descendants_count(self):
        """Compte le nombre de descendants"""
        return self.get_descendant_count()


class Tag(AbstractNamedModel):
    """
    Modèle Tag - Tags flexibles
    Système de tags non hiérarchique pour catégorisation flexible
    """
    
    # Couleur du tag
    color = models.CharField(
        _("Couleur"),
        max_length=7,
        default="#6C757D",
        help_text=_("Code couleur hexadécimal")
    )
    
    # Type de tag (optionnel pour grouper les tags)
    tag_type = models.CharField(
        _("Type de tag"),
        max_length=50,
        blank=True,
        default="",
        db_index=True,
        help_text=_("Pour grouper les tags (ex: priority, status)")
    )
    
    # Compteur d'utilisation
    usage_count = models.PositiveIntegerField(
        _("Nombre d'utilisations"),
        default=0,
        help_text=_("Nombre de fois que ce tag est utilisé")
    )
    
    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")
        ordering = ['-usage_count', 'name']
        unique_together = [['tag_type', 'code']]
    
    def __str__(self):
        return self.name
    
    def increment_usage(self):
        """Incrémente le compteur d'utilisation"""
        self.usage_count += 1
        self.save(update_fields=['usage_count'])
    
    def decrement_usage(self):
        """Décrémente le compteur d'utilisation"""
        if self.usage_count > 0:
            self.usage_count -= 1
            self.save(update_fields=['usage_count'])
