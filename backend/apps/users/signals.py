"""
Signaux pour l'app Users
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in
from .models import User, Role, Permission
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def user_created_handler(sender, instance, created, **kwargs):
    """Actions après création d'un utilisateur"""
    if created:
        logger.info(f"Nouvel utilisateur créé: {instance.username} ({instance.email})")
        
        # TODO: Envoyer email de bienvenue
        # TODO: Créer des préférences par défaut
        # TODO: Assigner rôle par défaut si configuré


@receiver(user_logged_in)
def user_logged_in_handler(sender, request, user, **kwargs):
    """Actions après connexion d'un utilisateur"""
    from core.utils import get_client_ip
    
    ip = get_client_ip(request)
    logger.info(f"Connexion utilisateur: {user.username} depuis {ip}")
    
    # Mettre à jour last_login_ip
    user.last_login_ip = ip
    user.save(update_fields=['last_login_ip'])


@receiver(post_save, sender=Role)
def role_updated_handler(sender, instance, created, **kwargs):
    """Log les modifications de rôles"""
    if created:
        logger.info(f"Nouveau rôle créé: {instance.name} ({instance.code})")
    else:
        logger.info(f"Rôle mis à jour: {instance.name} ({instance.code})")


@receiver(post_save, sender=Permission)
def permission_updated_handler(sender, instance, created, **kwargs):
    """Log les modifications de permissions"""
    if created:
        logger.info(f"Nouvelle permission créée: {instance.code}")
