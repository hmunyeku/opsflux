"""
Configuration Celery pour OpsFlux
Gestion des tâches asynchrones et planifiées
"""
import os
from celery import Celery
from celery.schedules import crontab

# Définir le module de settings Django par défaut
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

# Créer l'instance Celery
app = Celery('opsflux')

# Configuration depuis les settings Django avec le namespace CELERY
app.config_from_object('django.conf:settings', namespace='CELERY')

# Découverte automatique des tâches dans tous les apps Django
app.autodiscover_tasks()

# Configuration des tâches périodiques
app.conf.beat_schedule = {
    # Nettoyage quotidien des logs
    'cleanup-old-logs': {
        'task': 'core.tasks.cleanup_old_logs',
        'schedule': crontab(hour=2, minute=0),  # Tous les jours à 2h du matin
    },
    # Backup automatique de la base de données
    'daily-database-backup': {
        'task': 'core.tasks.backup_database',
        'schedule': crontab(hour=3, minute=0),  # Tous les jours à 3h du matin
    },
    # Synchronisation des taux de change
    'sync-currency-rates': {
        'task': 'core.tasks.sync_currency_rates',
        'schedule': crontab(hour='*/6'),  # Toutes les 6 heures
    },
    # Vérification de la santé du système
    'health-check': {
        'task': 'core.tasks.system_health_check',
        'schedule': crontab(minute='*/15'),  # Toutes les 15 minutes
    },
}

# Configuration des timeouts
app.conf.task_soft_time_limit = 300  # 5 minutes
app.conf.task_time_limit = 600  # 10 minutes

# Configuration du retry
app.conf.task_acks_late = True
app.conf.task_reject_on_worker_lost = True

# Configuration du résultat
app.conf.result_expires = 3600  # 1 heure


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Tâche de débogage pour tester Celery"""
    print(f'Request: {self.request!r}')
