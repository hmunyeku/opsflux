"""
Admin de l'app Modules
"""
from django.contrib import admin
from .models import Module, ModulePermission, ModuleInstallation


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    """Administration des modules"""
    list_display = ['display_name', 'name', 'version', 'category', 'is_installed', 'is_active', 'is_core']
    list_filter = ['is_installed', 'is_active', 'is_core', 'category']
    search_fields = ['name', 'display_name', 'description', 'author']
    readonly_fields = ['created_at', 'updated_at', 'install_date']
    fieldsets = [
        ('Identification', {
            'fields': ['name', 'display_name', 'description', 'icon', 'category']
        }),
        ('Version et Auteur', {
            'fields': ['version', 'author']
        }),
        ('État', {
            'fields': ['is_installed', 'is_active', 'is_core']
        }),
        ('Dépendances', {
            'fields': ['dependencies']
        }),
        ('Licence', {
            'fields': ['license_type', 'license_key'],
            'classes': ['collapse']
        }),
        ('Installation', {
            'fields': ['install_date', 'installed_by'],
            'classes': ['collapse']
        }),
        ('Configuration', {
            'fields': ['config'],
            'classes': ['collapse']
        }),
        ('Métadonnées', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]


@admin.register(ModulePermission)
class ModulePermissionAdmin(admin.ModelAdmin):
    """Administration des permissions module"""
    list_display = ['module', 'codename', 'name']
    list_filter = ['module']
    search_fields = ['codename', 'name', 'description']


@admin.register(ModuleInstallation)
class ModuleInstallationAdmin(admin.ModelAdmin):
    """Administration de l'historique d'installation"""
    list_display = ['module', 'action', 'version', 'status', 'user', 'created_at', 'execution_time']
    list_filter = ['action', 'status', 'created_at']
    search_fields = ['module__name', 'module__display_name']
    readonly_fields = ['created_at', 'updated_at']
