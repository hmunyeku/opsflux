"""
Modèle Sequence
Gestion des séquences et numérotation automatique
"""
from django.db import models, transaction
from django.utils.translation import gettext_lazy as _
from .base import AbstractNamedModel


class Sequence(AbstractNamedModel):
    """
    Modèle Sequence - Génération de numéros séquentiels
    Pour factures, commandes, documents, etc.
    """
    
    # Préfixe
    prefix = models.CharField(
        _("Préfixe"),
        max_length=20,
        blank=True,
        default="",
        help_text=_("Préfixe avant le numéro (ex: INV-)")
    )
    
    # Suffixe
    suffix = models.CharField(
        _("Suffixe"),
        max_length=20,
        blank=True,
        default="",
        help_text=_("Suffixe après le numéro (ex: -2024)")
    )
    
    # Padding (nombre de zéros)
    padding = models.PositiveSmallIntegerField(
        _("Padding"),
        default=5,
        help_text=_("Nombre de chiffres (ex: 5 = 00001)")
    )
    
    # Numéro actuel
    current_number = models.PositiveBigIntegerField(
        _("Numéro actuel"),
        default=0,
        help_text=_("Dernier numéro généré")
    )
    
    # Incrément
    increment = models.PositiveIntegerField(
        _("Incrément"),
        default=1,
        help_text=_("Valeur d'incrémentation")
    )
    
    # Réinitialisation
    RESET_CHOICES = [
        ('never', _("Jamais")),
        ('yearly', _("Annuelle")),
        ('monthly', _("Mensuelle")),
        ('daily', _("Quotidienne")),
    ]
    
    reset_frequency = models.CharField(
        _("Fréquence de réinitialisation"),
        max_length=20,
        choices=RESET_CHOICES,
        default='never'
    )
    
    last_reset_date = models.DateField(
        _("Dernière réinitialisation"),
        null=True,
        blank=True
    )
    
    # Variables de substitution dans préfixe/suffixe
    # {YYYY} = année, {MM} = mois, {DD} = jour
    use_date_variables = models.BooleanField(
        _("Utiliser variables de date"),
        default=True,
        help_text=_("Remplacer {YYYY}, {MM}, {DD} dans préfixe/suffixe")
    )
    
    # Exemple de numéro généré
    @property
    def example(self):
        """Génère un exemple de numéro"""
        from datetime import date
        today = date.today()
        
        prefix = self.prefix
        suffix = self.suffix
        
        if self.use_date_variables:
            prefix = prefix.replace('{YYYY}', str(today.year))
            prefix = prefix.replace('{MM}', f"{today.month:02d}")
            prefix = prefix.replace('{DD}', f"{today.day:02d}")
            suffix = suffix.replace('{YYYY}', str(today.year))
            suffix = suffix.replace('{MM}', f"{today.month:02d}")
            suffix = suffix.replace('{DD}', f"{today.day:02d}")
        
        number = str(self.current_number + 1).zfill(self.padding)
        return f"{prefix}{number}{suffix}"
    
    class Meta:
        verbose_name = _("Séquence")
        verbose_name_plural = _("Séquences")
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.example})"
    
    @transaction.atomic
    def get_next_number(self):
        """
        Génère et retourne le prochain numéro de la séquence
        Thread-safe avec verrouillage de la ligne
        """
        from datetime import date
        
        # Verrouiller la ligne pour éviter les doublons
        seq = Sequence.objects.select_for_update().get(pk=self.pk)
        
        # Vérifier si réinitialisation nécessaire
        today = date.today()
        should_reset = False
        
        if seq.reset_frequency != 'never' and seq.last_reset_date:
            if seq.reset_frequency == 'yearly':
                should_reset = today.year > seq.last_reset_date.year
            elif seq.reset_frequency == 'monthly':
                should_reset = (today.year > seq.last_reset_date.year or 
                               (today.year == seq.last_reset_date.year and 
                                today.month > seq.last_reset_date.month))
            elif seq.reset_frequency == 'daily':
                should_reset = today > seq.last_reset_date
        
        if should_reset:
            seq.current_number = 0
            seq.last_reset_date = today
        
        # Incrémenter
        seq.current_number += seq.increment
        seq.save(update_fields=['current_number', 'last_reset_date'])
        
        # Générer le numéro formaté
        prefix = seq.prefix
        suffix = seq.suffix
        
        if seq.use_date_variables:
            prefix = prefix.replace('{YYYY}', str(today.year))
            prefix = prefix.replace('{MM}', f"{today.month:02d}")
            prefix = prefix.replace('{DD}', f"{today.day:02d}")
            suffix = suffix.replace('{YYYY}', str(today.year))
            suffix = suffix.replace('{MM}', f"{today.month:02d}")
            suffix = suffix.replace('{DD}', f"{today.day:02d}")
        
        number = str(seq.current_number).zfill(seq.padding)
        return f"{prefix}{number}{suffix}"
    
    def reset_sequence(self, start_number=0):
        """Réinitialise la séquence à un numéro donné"""
        from datetime import date
        self.current_number = start_number
        self.last_reset_date = date.today()
        self.save(update_fields=['current_number', 'last_reset_date'])
