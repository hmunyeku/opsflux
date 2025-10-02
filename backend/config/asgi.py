"""
ASGI config for OpsFlux project.
Expose l'application ASGI callable en tant que variable module-level nommée ``application``.
Pour WebSocket et support asynchrone futur
"""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

# Configuration future pour les WebSockets avec Channels
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# import core.routing

application = django_asgi_app

# Future configuration WebSocket:
# application = ProtocolTypeRouter({
#     "http": django_asgi_app,
#     "websocket": AuthMiddlewareStack(
#         URLRouter(
#             core.routing.websocket_urlpatterns
#         )
#     ),
# })
