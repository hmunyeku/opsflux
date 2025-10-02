"""
Commande Django pour créer un superuser admin
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Créer un superuser admin avec mot de passe par défaut'

    def handle(self, *args, **options):
        User = get_user_model()

        username = 'admin'
        email = 'admin@opsflux.io'
        password = 'OpsFlux2025!'

        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            user.set_password(password)
            user.is_superuser = True
            user.is_staff = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f'✅ Superuser "{username}" mis à jour'))
        else:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                first_name='Admin',
                last_name='OpsFlux'
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Superuser "{username}" créé'))

        self.stdout.write(f'   Username: {username}')
        self.stdout.write(f'   Email: {email}')
        self.stdout.write(f'   Password: {password}')
        self.stdout.write('')
        self.stdout.write(f'🌐 Accédez à l\'admin: http://72.60.188.156:8000/admin/')
