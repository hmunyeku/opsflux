"""
URLs de l'API Users
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'users'

# Router pour les ViewSets
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'roles', views.RoleViewSet, basename='role')
router.register(r'permissions', views.PermissionViewSet, basename='permission')
router.register(r'user-roles', views.UserRoleViewSet, basename='userrole')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Auth endpoints
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    
    # Permission check
    path('check-permission/', views.check_permission, name='check-permission'),
]
