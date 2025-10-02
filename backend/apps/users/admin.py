"""
Configuration Admin Django pour Users
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Role, Permission, UserRole


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin pour User personnalisé"""
    
    list_display = [
        'username', 'email', 'full_name_display',
        'company', 'is_active', 'is_staff', 'last_login'
    ]
    list_filter = [
        'is_active', 'is_staff', 'is_superuser', 'is_archived',
        'company', 'auth_type', 'date_joined'
    ]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['username']
    
    fieldsets = (
        (None, {
            'fields': ('username', 'password', 'eid')
        }),
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'mobile', 'avatar')
        }),
        ('Organisation', {
            'fields': ('company', 'business_unit', 'manager')
        }),
        ('Préférences', {
            'fields': ('language', 'timezone', 'theme', 'email_notifications', 'push_notifications')
        }),
        ('Authentification', {
            'fields': ('auth_type', 'external_id')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_archived', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Dates importantes', {
            'fields': ('last_login', 'last_login_ip', 'date_joined'),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('metadata',),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'company'),
        }),
    )
    
    readonly_fields = ['eid', 'last_login', 'last_login_ip', 'date_joined']
    
    def full_name_display(self, obj):
        """Affiche le nom complet"""
        return obj.get_full_name() or '-'
    full_name_display.short_description = 'Nom complet'


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    """Admin pour Role"""
    
    list_display = [
        'name', 'code', 'level', 'permissions_count',
        'is_system', 'is_active'
    ]
    list_filter = ['is_system', 'is_active', 'level']
    search_fields = ['name', 'code', 'description']
    filter_horizontal = ['permissions']
    readonly_fields = ['eid', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'code', 'description', 'eid')
        }),
        ('Configuration', {
            'fields': ('level', 'is_system', 'is_active')
        }),
        ('Permissions', {
            'fields': ('permissions',)
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def permissions_count(self, obj):
        """Compte le nombre de permissions"""
        return obj.permissions.count()
    permissions_count.short_description = 'Nb permissions'


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    """Admin pour Permission"""
    
    list_display = [
        'code', 'name', 'category', 'action', 
        'resource', 'is_system'
    ]
    list_filter = ['category', 'action', 'is_system']
    search_fields = ['name', 'code', 'description']
    readonly_fields = ['eid', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'code', 'description', 'eid')
        }),
        ('Catégorisation', {
            'fields': ('category', 'action', 'resource')
        }),
        ('Configuration', {
            'fields': ('is_system',)
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    """Admin pour UserRole"""
    
    list_display = [
        'user', 'role', 'company', 'business_unit',
        'validity_display', 'is_active'
    ]
    list_filter = ['role', 'company', 'is_active']
    search_fields = ['user__username', 'user__email', 'role__name']
    readonly_fields = ['created_at']
    
    def validity_display(self, obj):
        """Affiche la période de validité"""
        if obj.valid_from or obj.valid_to:
            from_str = obj.valid_from.strftime('%d/%m/%Y') if obj.valid_from else '∞'
            to_str = obj.valid_to.strftime('%d/%m/%Y') if obj.valid_to else '∞'
            return f"{from_str} → {to_str}"
        return 'Permanent'
    validity_display.short_description = 'Validité'
