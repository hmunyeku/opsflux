"""
Views (ViewSets) pour l'API Users
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import login, logout
from django.utils import timezone

from .models import User, Role, Permission, UserRole, UIPreference, MenuItem
from .serializers import (
    UserListSerializer, UserDetailSerializer, UserCreateSerializer,
    UserUpdateSerializer, ChangePasswordSerializer, LoginSerializer,
    ProfileSerializer, RoleSerializer, PermissionSerializer,
    UserRoleSerializer, UIPreferenceSerializer, MenuItemSerializer,
    MenuItemListSerializer
)
from core.utils import get_client_ip
from core.ratelimit import api_ratelimit, RateLimits


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet pour User"""
    
    queryset = User.objects.filter(is_archived=False).select_related(
        'company', 'business_unit', 'manager'
    )
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_staff', 'company', 'business_unit', 'auth_type']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'email', 'last_name', 'created_at', 'last_login']
    ordering = ['last_name', 'first_name']
    
    def get_serializer_class(self):
        """Retourne le serializer approprié selon l'action"""
        if self.action == 'list':
            return UserListSerializer
        elif self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserDetailSerializer
    
    def get_permissions(self):
        """Permissions selon l'action"""
        if self.action == 'create':
            return [IsAdminUser()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Retourne le profil de l'utilisateur connecté"""
        serializer = ProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """Met à jour le profil de l'utilisateur connecté"""
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Retourner le profil complet mis à jour
        profile_serializer = ProfileSerializer(request.user, context={'request': request})
        return Response(profile_serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    @api_ratelimit(rate=RateLimits.AUTH_PASSWORD_RESET, method='POST')
    def change_password(self, request):
        """Change le mot de passe de l'utilisateur connecté
        Rate limit: 3 par heure"""
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        # Changer le mot de passe
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        return Response({
            'message': 'Mot de passe modifié avec succès.'
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reset_password(self, request, pk=None):
        """Reset le mot de passe d'un utilisateur (admin)"""
        user = self.get_object()
        new_password = request.data.get('new_password')
        
        if not new_password:
            return Response({
                'error': 'new_password requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': f'Mot de passe réinitialisé pour {user.username}'
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def archive(self, request, pk=None):
        """Archive un utilisateur"""
        user = self.get_object()
        user.is_archived = True
        user.is_active = False
        user.save()
        
        return Response({
            'message': f'Utilisateur {user.username} archivé'
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def unarchive(self, request, pk=None):
        """Désarchive un utilisateur"""
        user = self.get_object()
        user.is_archived = False
        user.is_active = True
        user.save()
        
        return Response({
            'message': f'Utilisateur {user.username} désarchivé'
        })
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def permissions(self, request, pk=None):
        """Retourne toutes les permissions de l'utilisateur"""
        user = self.get_object()
        
        # Récupérer toutes les permissions via les rôles
        permissions = Permission.objects.filter(
            roles__user_assignments__user=user,
            roles__user_assignments__is_active=True
        ).distinct()
        
        serializer = PermissionSerializer(permissions, many=True)
        return Response(serializer.data)


class RoleViewSet(viewsets.ModelViewSet):
    """ViewSet pour Role"""
    
    queryset = Role.objects.filter(is_deleted=False).prefetch_related('permissions')
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_system', 'level']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'level', 'created_at']
    ordering = ['-level', 'name']
    
    def get_permissions(self):
        """Seuls les admins peuvent modifier les rôles"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def add_permission(self, request, pk=None):
        """Ajoute une permission à un rôle"""
        role = self.get_object()
        permission_id = request.data.get('permission_id')
        
        try:
            permission = Permission.objects.get(pk=permission_id)
            role.permissions.add(permission)
            
            return Response({
                'message': f'Permission {permission.code} ajoutée au rôle {role.name}'
            })
        except Permission.DoesNotExist:
            return Response({
                'error': 'Permission non trouvée'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def remove_permission(self, request, pk=None):
        """Retire une permission d'un rôle"""
        role = self.get_object()
        permission_id = request.data.get('permission_id')
        
        try:
            permission = Permission.objects.get(pk=permission_id)
            role.permissions.remove(permission)
            
            return Response({
                'message': f'Permission {permission.code} retirée du rôle {role.name}'
            })
        except Permission.DoesNotExist:
            return Response({
                'error': 'Permission non trouvée'
            }, status=status.HTTP_404_NOT_FOUND)


class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour Permission (lecture seule)"""
    
    queryset = Permission.objects.filter(is_deleted=False)
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'action', 'is_system']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['category', 'resource', 'action']
    ordering = ['category', 'resource', 'action']


class UserRoleViewSet(viewsets.ModelViewSet):
    """ViewSet pour UserRole"""
    
    queryset = UserRole.objects.select_related(
        'user', 'role', 'company', 'business_unit'
    )
    serializer_class = UserRoleSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user', 'role', 'company', 'business_unit', 'is_active']
    ordering = ['-created_at']


@api_view(['POST'])
@permission_classes([AllowAny])
@api_ratelimit(rate=RateLimits.AUTH_LOGIN, method='POST')
def login_view(request):
    """
    Login endpoint
    Retourne JWT tokens
    Rate limit: 5 tentatives par minute par IP
    """
    serializer = LoginSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    
    user = serializer.validated_data['user']
    
    # Mettre à jour last_login et IP
    user.last_login = timezone.now()
    user.last_login_ip = get_client_ip(request)
    user.save(update_fields=['last_login', 'last_login_ip'])
    
    # Générer les tokens JWT
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': ProfileSerializer(user).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout endpoint
    Blacklist le refresh token
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Déconnexion réussie'
        })
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_permission(request):
    """
    Vérifie si l'utilisateur a une permission
    Query params: permission_code
    """
    permission_code = request.query_params.get('permission_code')

    if not permission_code:
        return Response({
            'error': 'permission_code requis'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Vérifier si l'utilisateur a la permission
    has_permission = Permission.objects.filter(
        code=permission_code,
        roles__user_assignments__user=request.user,
        roles__user_assignments__is_active=True
    ).exists()

    return Response({
        'permission_code': permission_code,
        'has_permission': has_permission,
    })


class UIPreferenceViewSet(viewsets.ModelViewSet):
    """ViewSet pour UIPreference"""

    queryset = UIPreference.objects.select_related('user')
    serializer_class = UIPreferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Limite aux préférences de l'utilisateur connecté (sauf admin)"""
        if self.request.user.is_staff:
            return super().get_queryset()
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_preferences(self, request):
        """Retourne les préférences UI de l'utilisateur connecté"""
        try:
            preferences = UIPreference.objects.get(user=request.user)
        except UIPreference.DoesNotExist:
            # Créer des préférences par défaut si elles n'existent pas
            preferences = UIPreference.objects.create(user=request.user)

        serializer = UIPreferenceSerializer(preferences)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def update_my_preferences(self, request):
        """Met à jour les préférences UI de l'utilisateur connecté"""
        try:
            preferences = UIPreference.objects.get(user=request.user)
        except UIPreference.DoesNotExist:
            preferences = UIPreference.objects.create(user=request.user)

        serializer = UIPreferenceSerializer(
            preferences,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class MenuItemViewSet(viewsets.ModelViewSet):
    """ViewSet pour MenuItem"""

    queryset = MenuItem.objects.filter(is_deleted=False).select_related(
        'parent', 'module'
    ).prefetch_related('required_permissions')
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_system', 'item_type', 'module']
    search_fields = ['code', 'label']
    ordering_fields = ['order', 'label', 'created_at']
    ordering = ['order', 'label']

    def get_serializer_class(self):
        """Retourne le serializer approprié selon l'action"""
        if self.action == 'list':
            return MenuItemListSerializer
        return MenuItemSerializer

    def get_permissions(self):
        """Seuls les admins peuvent modifier les éléments de menu"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_menu(self, request):
        """
        Retourne les éléments de menu accessibles à l'utilisateur connecté
        Construit une hiérarchie complète avec permissions
        """
        # Récupérer tous les éléments actifs
        all_items = MenuItem.objects.filter(
            is_active=True,
            is_deleted=False
        ).select_related('parent', 'module').prefetch_related(
            'required_permissions'
        ).order_by('order', 'label')

        # Filtrer par permissions
        allowed_items = []
        for item in all_items:
            if item.has_permission(request.user):
                allowed_items.append(item)

        # Construire la hiérarchie (seulement les éléments de niveau racine)
        root_items = [item for item in allowed_items if item.parent is None]

        serializer = MenuItemSerializer(
            root_items,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def navigation(self, request):
        """
        Retourne la structure de navigation complète pour le Dashboard
        Format optimisé pour ui5-side-navigation
        """
        # Récupérer tous les éléments visibles de l'utilisateur
        all_items = MenuItem.objects.filter(
            is_active=True,
            is_deleted=False
        ).select_related('parent', 'module').prefetch_related(
            'required_permissions'
        ).order_by('item_type', 'order', 'label')

        # Filtrer par permissions utilisateur
        allowed_items = [item for item in all_items if item.has_permission(request.user)]

        # Séparer par type
        normal_items = [item for item in allowed_items if item.item_type == 'item' and item.parent is None]
        fixed_items = [item for item in allowed_items if item.item_type == 'fixed']

        return Response({
            'items': MenuItemSerializer(normal_items, many=True, context={'request': request}).data,
            'fixed_items': MenuItemSerializer(fixed_items, many=True, context={'request': request}).data,
        })
