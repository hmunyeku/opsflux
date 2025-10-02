"""
Modèle Attachment
Gestion centralisée des fichiers joints
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.validators import FileExtensionValidator
from .base import AbstractBaseModel
import os
import hashlib


def attachment_upload_path(instance, filename):
    """
    Génère le chemin d'upload pour les fichiers
    Format: attachments/{year}/{month}/{model}/{id}/{hash}_{filename}
    """
    from datetime import datetime
    now = datetime.now()
    
    # Hash du fichier pour éviter les doublons
    file_hash = hashlib.md5(filename.encode()).hexdigest()[:8]
    
    # Nettoyer le nom de fichier
    name, ext = os.path.splitext(filename)
    clean_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).strip()
    clean_filename = f"{file_hash}_{clean_name}{ext}"
    
    return f"attachments/{now.year}/{now.month:02d}/{instance.content_type.model}/{instance.object_id}/{clean_filename}"


class Attachment(AbstractBaseModel):
    """
    Modèle Attachment - Fichiers joints génériques
    Peut être attaché à n'importe quel modèle via GenericForeignKey
    """
    
    # Relation générique
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        verbose_name=_("Type de contenu")
    )
    
    object_id = models.PositiveIntegerField(
        _("ID de l'objet")
    )
    
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Fichier
    file = models.FileField(
        _("Fichier"),
        upload_to=attachment_upload_path,
        max_length=500
    )
    
    # Métadonnées du fichier
    original_filename = models.CharField(
        _("Nom du fichier original"),
        max_length=255
    )
    
    file_size = models.PositiveBigIntegerField(
        _("Taille du fichier (octets)"),
        default=0
    )
    
    mime_type = models.CharField(
        _("Type MIME"),
        max_length=100,
        blank=True,
        default=""
    )
    
    file_extension = models.CharField(
        _("Extension"),
        max_length=10,
        blank=True,
        default=""
    )
    
    # Hash du fichier pour déduplication
    file_hash = models.CharField(
        _("Hash SHA256"),
        max_length=64,
        blank=True,
        default="",
        db_index=True
    )
    
    # Description
    title = models.CharField(
        _("Titre"),
        max_length=255,
        blank=True,
        default=""
    )
    
    description = models.TextField(
        _("Description"),
        blank=True,
        default=""
    )
    
    # Type d'attachement (optionnel pour catégoriser)
    attachment_type = models.CharField(
        _("Type d'attachement"),
        max_length=50,
        blank=True,
        default="",
        db_index=True,
        help_text=_("Ex: invoice, contract, photo, document")
    )
    
    # Sécurité
    is_public = models.BooleanField(
        _("Public"),
        default=False,
        help_text=_("Accessible sans authentification")
    )
    
    # Nombre de téléchargements
    download_count = models.PositiveIntegerField(
        _("Nombre de téléchargements"),
        default=0
    )
    
    # Virus scan (pour intégration future)
    is_scanned = models.BooleanField(
        _("Scanné"),
        default=False
    )
    
    scan_result = models.CharField(
        _("Résultat du scan"),
        max_length=50,
        blank=True,
        default=""
    )
    
    class Meta:
        verbose_name = _("Fichier joint")
        verbose_name_plural = _("Fichiers joints")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['attachment_type', 'is_public']),
        ]
    
    def __str__(self):
        return self.original_filename or self.file.name
    
    def save(self, *args, **kwargs):
        """Surcharge pour extraire les métadonnées du fichier"""
        import magic
        
        if self.file:
            # Nom original
            if not self.original_filename:
                self.original_filename = os.path.basename(self.file.name)
            
            # Extension
            if not self.file_extension:
                _, ext = os.path.splitext(self.original_filename)
                self.file_extension = ext.lower().lstrip('.')
            
            # Taille
            if self.file.size:
                self.file_size = self.file.size
            
            # Type MIME
            if not self.mime_type and hasattr(self.file, 'file'):
                try:
                    mime = magic.Magic(mime=True)
                    self.mime_type = mime.from_buffer(self.file.file.read(2048))
                    self.file.file.seek(0)  # Reset file pointer
                except:
                    pass
            
            # Hash SHA256
            if not self.file_hash and hasattr(self.file, 'file'):
                try:
                    sha256_hash = hashlib.sha256()
                    for chunk in self.file.chunks():
                        sha256_hash.update(chunk)
                    self.file_hash = sha256_hash.hexdigest()
                except:
                    pass
        
        super().save(*args, **kwargs)
    
    def increment_download_count(self):
        """Incrémente le compteur de téléchargements"""
        self.download_count += 1
        self.save(update_fields=['download_count'])
    
    def get_human_readable_size(self):
        """Retourne la taille du fichier dans un format lisible"""
        size = self.file_size
        for unit in ['o', 'Ko', 'Mo', 'Go', 'To']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} Po"
