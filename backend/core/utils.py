"""
Utilitaires communs pour OpsFlux
Fonctions helpers réutilisables dans tout le projet
"""
from django.utils import timezone
from django.core.cache import cache
from django.conf import settings
import hashlib
import uuid
import re
from datetime import datetime, timedelta
from typing import Any, Optional, Dict, List


def generate_unique_code(prefix: str = "", length: int = 8) -> str:
    """
    Génère un code unique
    
    Args:
        prefix: Préfixe optionnel
        length: Longueur du code (sans préfixe)
    
    Returns:
        Code unique
    """
    import secrets
    import string
    
    characters = string.ascii_uppercase + string.digits
    code = ''.join(secrets.choice(characters) for _ in range(length))
    
    return f"{prefix}{code}" if prefix else code


def get_client_ip(request) -> str:
    """
    Récupère l'IP réelle du client en tenant compte des proxies
    
    Args:
        request: Objet request Django
    
    Returns:
        Adresse IP du client
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def sanitize_filename(filename: str) -> str:
    """
    Nettoie un nom de fichier pour le sécuriser
    
    Args:
        filename: Nom de fichier à nettoyer
    
    Returns:
        Nom de fichier sécurisé
    """
    import os
    
    # Séparer nom et extension
    name, ext = os.path.splitext(filename)
    
    # Nettoyer le nom (garder seulement alphanumériques, espaces, tirets, underscores)
    clean_name = re.sub(r'[^\w\s-]', '', name).strip()
    clean_name = re.sub(r'[-\s]+', '-', clean_name)
    
    # Limiter la longueur
    max_length = 200
    if len(clean_name) > max_length:
        clean_name = clean_name[:max_length]
    
    return f"{clean_name}{ext.lower()}"


def calculate_file_hash(file_obj, algorithm='sha256') -> str:
    """
    Calcule le hash d'un fichier
    
    Args:
        file_obj: Objet fichier Django
        algorithm: Algorithme de hash (md5, sha1, sha256)
    
    Returns:
        Hash hexadécimal du fichier
    """
    hash_obj = hashlib.new(algorithm)
    
    # Lire le fichier par chunks pour optimiser la mémoire
    for chunk in file_obj.chunks():
        hash_obj.update(chunk)
    
    # Reset file pointer
    file_obj.seek(0)
    
    return hash_obj.hexdigest()


def cache_key_generator(*args, **kwargs) -> str:
    """
    Génère une clé de cache unique basée sur les arguments
    
    Returns:
        Clé de cache
    """
    import json
    
    # Créer une représentation unique des arguments
    key_parts = [str(arg) for arg in args]
    key_parts.extend([f"{k}={v}" for k, v in sorted(kwargs.items())])
    
    key_string = ':'.join(key_parts)
    
    # Hash pour éviter les clés trop longues
    return hashlib.md5(key_string.encode()).hexdigest()


def get_or_create_cached(cache_key: str, callable_func, timeout: int = 300):
    """
    Récupère depuis le cache ou exécute la fonction et met en cache
    
    Args:
        cache_key: Clé de cache
        callable_func: Fonction à exécuter si cache miss
        timeout: Durée de cache en secondes
    
    Returns:
        Résultat depuis cache ou fonction
    """
    result = cache.get(cache_key)
    
    if result is None:
        result = callable_func()
        cache.set(cache_key, result, timeout)
    
    return result


def parse_date_range(date_range_str: str) -> tuple:
    """
    Parse une chaîne de date range en tuple (start, end)
    Supporte: "today", "yesterday", "this_week", "last_week", "this_month", etc.
    
    Args:
        date_range_str: String représentant une période
    
    Returns:
        Tuple (start_date, end_date)
    """
    today = timezone.now().date()
    
    if date_range_str == 'today':
        return today, today
    
    elif date_range_str == 'yesterday':
        yesterday = today - timedelta(days=1)
        return yesterday, yesterday
    
    elif date_range_str == 'this_week':
        start = today - timedelta(days=today.weekday())
        end = start + timedelta(days=6)
        return start, end
    
    elif date_range_str == 'last_week':
        start = today - timedelta(days=today.weekday() + 7)
        end = start + timedelta(days=6)
        return start, end
    
    elif date_range_str == 'this_month':
        start = today.replace(day=1)
        if today.month == 12:
            end = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            end = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
        return start, end
    
    elif date_range_str == 'last_month':
        first_day = today.replace(day=1)
        end = first_day - timedelta(days=1)
        start = end.replace(day=1)
        return start, end
    
    elif date_range_str == 'this_year':
        start = today.replace(month=1, day=1)
        end = today.replace(month=12, day=31)
        return start, end
    
    else:
        # Par défaut, retourner aujourd'hui
        return today, today


def format_number(number: float, decimal_places: int = 2, 
                  thousand_separator: str = ' ', 
                  decimal_separator: str = ',') -> str:
    """
    Formate un nombre avec séparateurs personnalisés
    
    Args:
        number: Nombre à formater
        decimal_places: Nombre de décimales
        thousand_separator: Séparateur de milliers
        decimal_separator: Séparateur décimal
    
    Returns:
        Nombre formaté
    """
    # Arrondir
    rounded = round(number, decimal_places)
    
    # Formater avec décimales
    formatted = f"{rounded:.{decimal_places}f}"
    
    # Séparer partie entière et décimale
    parts = formatted.split('.')
    integer_part = parts[0]
    decimal_part = parts[1] if len(parts) > 1 else ''
    
    # Ajouter séparateurs de milliers
    integer_with_separator = ''
    for i, digit in enumerate(reversed(integer_part)):
        if i > 0 and i % 3 == 0:
            integer_with_separator = thousand_separator + integer_with_separator
        integer_with_separator = digit + integer_with_separator
    
    # Reconstituer
    if decimal_part:
        return f"{integer_with_separator}{decimal_separator}{decimal_part}"
    else:
        return integer_with_separator


def slugify_unique(text: str, model_class, field_name: str = 'slug') -> str:
    """
    Génère un slug unique pour un modèle
    
    Args:
        text: Texte à slugifier
        model_class: Classe du modèle
        field_name: Nom du champ slug
    
    Returns:
        Slug unique
    """
    from django.utils.text import slugify
    
    slug = slugify(text)
    unique_slug = slug
    counter = 1
    
    while model_class.objects.filter(**{field_name: unique_slug}).exists():
        unique_slug = f"{slug}-{counter}"
        counter += 1
    
    return unique_slug


def send_notification(user, title: str, message: str, 
                     notification_type: str = 'info',
                     priority: str = 'normal',
                     metadata: Dict = None):
    """
    Envoie une notification à un utilisateur
    À implémenter avec le système de notifications
    
    Args:
        user: Utilisateur destinataire
        title: Titre de la notification
        message: Message de la notification
        notification_type: Type (info, success, warning, error)
        priority: Priorité (low, normal, high, urgent)
        metadata: Données additionnelles
    """
    # TODO: Implémenter avec le système de notifications
    pass


def truncate_text(text: str, max_length: int = 100, 
                  suffix: str = '...') -> str:
    """
    Tronque un texte à une longueur maximale
    
    Args:
        text: Texte à tronquer
        max_length: Longueur maximale
        suffix: Suffixe à ajouter si tronqué
    
    Returns:
        Texte tronqué
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix


class Timer:
    """
    Context manager pour mesurer le temps d'exécution
    
    Usage:
        with Timer() as t:
            # Code à mesurer
            pass
        print(f"Durée: {t.elapsed}s")
    """
    
    def __init__(self):
        self.start_time = None
        self.end_time = None
        self.elapsed = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, *args):
        self.end_time = time.time()
        self.elapsed = self.end_time - self.start_time
