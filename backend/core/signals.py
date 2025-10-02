"""
Signaux Django pour OpsFlux Core
Automatisation des tâches lors de certains événements
"""
from django.db.models.signals import pre_save, post_save, post_delete, pre_delete
from django.dispatch import receiver
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@receiver(pre_save)
def auto_set_audit_fields(sender, instance, **kwargs):
    """
    Signal pour remplir automatiquement les champs d'audit
    created_by et updated_by
    """
    from core.models.base import AbstractBaseModel
    
    # Vérifier que le modèle hérite d'AbstractBaseModel
    if not isinstance(instance, AbstractBaseModel):
        return
    
    # Récupérer l'utilisateur depuis le middleware
    from threading import current_thread
    request = getattr(current_thread(), 'request', None)
    
    if request and hasattr(request, 'user') and request.user.is_authenticated:
        # Création : set created_by
        if instance.pk is None and not instance.created_by_id:
            instance.created_by = request.user
        
        # Mise à jour : set updated_by
        instance.updated_by = request.user


@receiver(pre_delete)
def soft_delete_protection(sender, instance, **kwargs):
    """
    Protège contre la suppression physique si soft delete activé
    """
    from core.models.base import AbstractBaseModel
    from django.conf import settings
    
    if not isinstance(instance, AbstractBaseModel):
        return
    
    # Si l'audit trail est activé et que l'objet n'est pas déjà soft deleted
    if settings.OPSFLUX_CONFIG.get('AUDIT_TRAIL_ENABLED', True):
        if not instance.is_deleted:
            logger.warning(
                f"Tentative de suppression physique de {sender.__name__} "
                f"(id={instance.pk}) sans soft delete préalable"
            )


@receiver(post_save, sender='core.Attachment')
def scan_attachment_for_viruses(sender, instance, created, **kwargs):
    """
    Déclenche un scan antivirus après l'upload d'un fichier
    """
    if created and not instance.is_scanned:
        # TODO: Implémenter le scan antivirus avec ClamAV ou service externe
        # Pour l'instant, on marque comme scanné
        from django.db.models import F
        sender.objects.filter(pk=instance.pk).update(
            is_scanned=True,
            scan_result='not_implemented'
        )
        logger.info(f"Fichier {instance.original_filename} scanné (simulation)")


@receiver(post_save, sender='core.CurrencyRate')
def invalidate_currency_cache(sender, instance, **kwargs):
    """
    Invalide le cache des taux de change après mise à jour
    """
    from django.core.cache import cache
    
    cache_keys = [
        f"currency_rate_{instance.from_currency_id}_{instance.to_currency_id}",
        f"currency_rates_{instance.from_currency_id}",
        f"currency_rates_{instance.to_currency_id}",
    ]
    
    cache.delete_many(cache_keys)
    logger.info(f"Cache taux de change invalidé pour {instance}")


@receiver(post_save, sender='core.Sequence')
def log_sequence_update(sender, instance, created, **kwargs):
    """
    Log les modifications de séquences pour audit
    """
    if created:
        logger.info(f"Nouvelle séquence créée: {instance.name} ({instance.code})")
    else:
        logger.info(
            f"Séquence mise à jour: {instance.name} "
            f"(numéro actuel: {instance.current_number})"
        )


@receiver(post_delete)
def log_deletion(sender, instance, **kwargs):
    """
    Log toutes les suppressions pour audit
    """
    from core.models.base import AbstractBaseModel
    
    if isinstance(instance, AbstractBaseModel):
        logger.warning(
            f"Suppression physique de {sender.__name__} "
            f"(eID={instance.eid})"
        )


@receiver(post_save, sender='core.Category')
def rebuild_category_tree(sender, instance, **kwargs):
    """
    Reconstruit l'arbre MPTT après modification d'une catégorie
    """
    try:
        sender.objects.rebuild()
    except Exception as e:
        logger.error(f"Erreur reconstruction arbre catégories: {e}")


@receiver(post_save, sender='core.Tag')
@receiver(post_delete, sender='core.Tag')
def update_tag_cloud_cache(sender, instance, **kwargs):
    """
    Met à jour le cache du nuage de tags
    """
    from django.core.cache import cache
    
    cache_key = f"tag_cloud_{instance.tag_type or 'all'}"
    cache.delete(cache_key)
