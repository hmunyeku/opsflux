from django.apps import AppConfig


class ModulesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.modules'
    label = 'modules'  # Label pour les références dans les ForeignKey
    verbose_name = 'Gestion des Modules'
