"""
Serializers DRF pour l'app Users
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import User, Role, Permission, UserRole


class PermissionSerializer(serializers.ModelSerializer):
    """Serializer pour Permission"""
    
    class Meta:
        model = Permission
        fields = [
            'id', 'eid', 'name', 'code', 'description',
            'category', 'action', 'resource', 'is_system',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['eid', 'created_at', 'updated_at']


class RoleSerializer(serializers.ModelSerializer):
    """Serializer pour Role"""
    
    permissions_count = serializers.IntegerField(
        source='permissions.count',
        read_only=True
    )
    permissions_detail = PermissionSerializer(
        source='permissions',
        many=True,
        read_only=True
    )
    
    class Meta:
        model = Role
        fields = [
            'id', 'eid', 'name', 'code', 'description',
            'permissions', 'permissions_count', 'permissions_detail',
            'level', 'is_system', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['eid', 'permissions_count', 'created_at', 'updated_at']


class UserRoleSerializer(serializers.ModelSerializer):
    """Serializer pour UserRole"""
    
    role_name = serializers.CharField(source='role.name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    business_unit_name = serializers.CharField(source='business_unit.name', read_only=True)
    
    class Meta:
        model = UserRole
        fields = [
            'id', 'user', 'role', 'role_name',
            'company', 'company_name',
            'business_unit', 'business_unit_name',
            'valid_from', 'valid_to', 'is_active',
            'created_at'
        ]
        read_only_fields = ['created_at']


class UserListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour liste d'utilisateurs"""
    
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    display_name = serializers.CharField(source='get_display_name', read_only=True)
    avatar_url = serializers.CharField(source='get_avatar_url', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'eid', 'username', 'email',
            'first_name', 'last_name', 'full_name', 'display_name',
            'avatar_url', 'company', 'company_name',
            'is_active', 'is_staff', 'last_login'
        ]


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour User"""
    
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    display_name = serializers.CharField(source='get_display_name', read_only=True)
    avatar_url = serializers.CharField(source='get_avatar_url', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    business_unit_name = serializers.CharField(source='business_unit.name', read_only=True)
    manager_name = serializers.CharField(source='manager.get_display_name', read_only=True)
    roles = UserRoleSerializer(source='user_roles', many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'eid', 'username', 'email',
            'first_name', 'last_name', 'full_name', 'display_name',
            'phone', 'mobile', 'avatar', 'avatar_url',
            'company', 'company_name',
            'business_unit', 'business_unit_name',
            'manager', 'manager_name',
            'language', 'timezone', 'theme',
            'email_notifications', 'push_notifications',
            'auth_type', 'external_id',
            'is_active', 'is_staff', 'is_superuser', 'is_archived',
            'roles', 'metadata',
            'last_login', 'last_login_ip',
            'date_joined', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'eid', 'full_name', 'display_name', 'avatar_url',
            'last_login', 'last_login_ip', 'date_joined',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer pour création d'utilisateur"""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone', 'mobile',
            'company', 'business_unit', 'manager',
            'language', 'timezone', 'auth_type'
        ]
    
    def validate(self, attrs):
        """Valider que les mots de passe correspondent"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Les mots de passe ne correspondent pas."
            })
        return attrs
    
    def create(self, validated_data):
        """Créer l'utilisateur avec mot de passe hashé"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour mise à jour d'utilisateur"""
    
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name',
            'phone', 'mobile', 'avatar',
            'company', 'business_unit', 'manager',
            'language', 'timezone', 'theme',
            'email_notifications', 'push_notifications',
            'is_active'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer pour changement de mot de passe"""
    
    old_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """Valider les mots de passe"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': "Les mots de passe ne correspondent pas."
            })
        return attrs
    
    def validate_old_password(self, value):
        """Vérifier l'ancien mot de passe"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mot de passe incorrect.")
        return value


class LoginSerializer(serializers.Serializer):
    """Serializer pour login"""
    
    username = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """Valider les credentials"""
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            # Tenter avec username
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )
            
            # Si échec, tenter avec email
            if not user:
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(
                        request=self.context.get('request'),
                        username=user_obj.username,
                        password=password
                    )
                except User.DoesNotExist:
                    pass
            
            if not user:
                raise serializers.ValidationError(
                    "Identifiants invalides.",
                    code='authorization'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    "Ce compte est désactivé.",
                    code='authorization'
                )
            
            if user.is_archived:
                raise serializers.ValidationError(
                    "Ce compte est archivé.",
                    code='authorization'
                )
        else:
            raise serializers.ValidationError(
                "Username et password requis.",
                code='authorization'
            )
        
        attrs['user'] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer pour le profil de l'utilisateur connecté"""
    
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    display_name = serializers.CharField(source='get_display_name', read_only=True)
    avatar_url = serializers.CharField(source='get_avatar_url', read_only=True)
    roles = UserRoleSerializer(source='user_roles', many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'eid', 'username', 'email',
            'first_name', 'last_name', 'full_name', 'display_name',
            'phone', 'mobile', 'avatar', 'avatar_url',
            'company', 'business_unit', 'manager',
            'language', 'timezone', 'theme',
            'email_notifications', 'push_notifications',
            'roles', 'last_login', 'date_joined'
        ]
        read_only_fields = [
            'eid', 'username', 'full_name', 'display_name',
            'avatar_url', 'last_login', 'date_joined'
        ]
