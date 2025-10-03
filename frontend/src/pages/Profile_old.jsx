import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  ShellBar,
  ShellBarItem,
  Card,
  CardHeader,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  CheckBox,
  Button,
  Icon,
  Avatar,
  MessageStrip,
  Label,
  BusyIndicator,
  FlexBox,
  Title,
  Text,
  TabContainer,
  Tab,
  ObjectStatus,
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Popover,
  List,
  StandardListItem,
  Badge
} from '@ui5/webcomponents-react';
import {
  FlexBoxDirection,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
  FlexBoxWrap,
  TitleLevel,
  ButtonDesign,
  MessageStripDesign,
  InputType,
  AvatarSize,
  ValueState,
  BarDesign,
  PopoverPlacementType
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedTab, setSelectedTab] = useState(0);

  // Refs for Popovers
  const profilePopoverRef = useRef(null);
  const profileButtonRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    mobile: '',
    language: 'fr',
    timezone: 'UTC',
    theme: 'auto',
    email_notifications: true,
    push_notifications: true
  });

  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/users/users/me/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erreur lors du chargement du profil');

      const data = await response.json();
      setUser(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        mobile: data.mobile || '',
        language: data.language || 'fr',
        timezone: data.timezone || 'UTC',
        theme: data.theme || 'auto',
        email_notifications: data.email_notifications !== undefined ? data.email_notifications : true,
        push_notifications: data.push_notifications !== undefined ? data.push_notifications : true
      });
      setLoading(false);
    } catch (error) {
      setMessage({ type: MessageStripDesign.Negative, text: error.message });
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value !== undefined ? e.target.value : e.target.checked;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (e, field) => {
    setPasswordForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      setMessage({ type: MessageStripDesign.Warning, text: 'Veuillez sélectionner un fichier' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const data = new FormData();
      data.append('avatar', avatarFile);

      const response = await fetch(`${apiUrl}/api/users/users/update_profile/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'upload');
      }

      const userData = await response.json();
      setUser(userData);
      setAvatarFile(null);
      setAvatarPreview(null);

      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        display_name: userData.display_name,
        avatar_url: userData.avatar_url
      }));

      setMessage({ type: MessageStripDesign.Success, text: 'Avatar mis à jour avec succès' });
    } catch (error) {
      setMessage({ type: MessageStripDesign.Negative, text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/users/users/update_profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la sauvegarde');
      }

      const userData = await response.json();
      setUser(userData);

      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        display_name: userData.display_name,
        avatar_url: userData.avatar_url
      }));

      setMessage({ type: MessageStripDesign.Success, text: 'Profil mis à jour avec succès' });
    } catch (error) {
      setMessage({ type: MessageStripDesign.Negative, text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setMessage(null);

    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      setMessage({ type: MessageStripDesign.Negative, text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/users/users/change_password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.old_password?.[0] || 'Erreur lors du changement de mot de passe');
      }

      setMessage({ type: MessageStripDesign.Success, text: 'Mot de passe modifié avec succès' });
      setPasswordForm({ old_password: '', new_password: '', new_password_confirm: '' });
    } catch (error) {
      setMessage({ type: MessageStripDesign.Negative, text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <ThemeProvider>
        <FlexBox
          direction={FlexBoxDirection.Column}
          alignItems={FlexBoxAlignItems.Center}
          justifyContent={FlexBoxJustifyContent.Center}
          style={{ minHeight: '100vh', gap: '1rem' }}
        >
          <BusyIndicator active size="Large" />
          <Text>Chargement du profil...</Text>
        </FlexBox>
      </ThemeProvider>
    );
  }

  const displayName = user.display_name || user.username || 'Utilisateur';
  const initials = user.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <ThemeProvider>
      <FlexBox
        direction={FlexBoxDirection.Column}
        style={{ height: '100vh', background: 'var(--sapBackgroundColor)' }}
      >
        <ShellBar
          primaryTitle="OpsFlux"
          secondaryTitle="Mon Profil"
          logo={<Icon name="business-suite" />}
          profile={<Avatar initials={initials} />}
          onLogoClick={() => navigate('/dashboard')}
        >
          <ShellBarItem
            icon="home"
            text="Tableau de bord"
            onClick={() => navigate('/dashboard')}
          />
          <ShellBarItem
            icon="log"
            text="Déconnexion"
            onClick={handleLogout}
          />
        </ShellBar>

        <FlexBox
          direction={FlexBoxDirection.Column}
          style={{ flex: 1, overflowY: 'auto' }}
        >
          <div style={{ maxWidth: '75rem', margin: '0 auto', width: '100%', padding: '1rem' }}>
            {/* Header */}
            <FlexBox direction={FlexBoxDirection.Column} style={{ marginBottom: '2rem' }}>
              <Title level={TitleLevel.H2}>Mon Profil</Title>
              <Text style={{ color: 'var(--sapNeutralTextColor)', marginTop: '0.5rem' }}>
                Gérez vos informations personnelles et préférences
              </Text>
            </FlexBox>

            {/* Messages */}
            {message && (
              <div style={{ marginBottom: '1rem' }}>
                <MessageStrip
                  design={message.type}
                  onClose={() => setMessage(null)}
                >
                  {message.text}
                </MessageStrip>
              </div>
            )}

            {/* Avatar Card */}
            <Card
              style={{ marginBottom: '1rem' }}
              header={
                <CardHeader
                  titleText="Photo de profil"
                  avatar={<Icon name="camera" />}
                />
              }
            >
              <FlexBox
                alignItems={FlexBoxAlignItems.Center}
                style={{ padding: '1rem', gap: '2rem' }}
              >
                <Avatar
                  size={AvatarSize.XL}
                  style={{ width: '120px', height: '120px' }}
                >
                  {avatarPreview || user.avatar_url ? (
                    <img src={avatarPreview || user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '3rem' }}>{initials}</span>
                  )}
                </Avatar>

                <FlexBox direction={FlexBoxDirection.Column} style={{ flex: 1, gap: '0.5rem' }}>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} />
                  <Text style={{ fontSize: '0.875rem', color: 'var(--sapNeutralTextColor)' }}>
                    Formats acceptés : JPG, PNG, GIF · Taille max : 2MB
                  </Text>
                  <FlexBox style={{ gap: '0.5rem' }}>
                    <Button
                      design={ButtonDesign.Emphasized}
                      onClick={handleUploadAvatar}
                      disabled={saving || !avatarFile}
                    >
                      Enregistrer
                    </Button>
                    {avatarPreview && (
                      <Button onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}>
                        Annuler
                      </Button>
                    )}
                  </FlexBox>
                </FlexBox>
              </FlexBox>
            </Card>

            {/* Personal Info Card */}
            <Card
              style={{ marginBottom: '1rem' }}
              header={
                <CardHeader
                  titleText="Informations personnelles"
                  avatar={<Icon name="person-placeholder" />}
                />
              }
            >
              <div style={{ padding: '1rem' }}>
                <Form labelSpanM={4} columnsM={2} columnsL={2}>
                  <FormItem label={<Label>Nom d'utilisateur</Label>}>
                    <Input value={user.username} disabled style={{ width: '100%' }} />
                  </FormItem>

                  <FormItem label={<Label>Prénom</Label>}>
                    <Input
                      value={formData.first_name}
                      onInput={(e) => handleInputChange(e, 'first_name')}
                      style={{ width: '100%' }}
                    />
                  </FormItem>

                  <FormItem label={<Label>Nom</Label>}>
                    <Input
                      value={formData.last_name}
                      onInput={(e) => handleInputChange(e, 'last_name')}
                      style={{ width: '100%' }}
                    />
                  </FormItem>

                  <FormItem label={<Label>Email</Label>}>
                    <Input
                      type={InputType.Email}
                      value={formData.email}
                      onInput={(e) => handleInputChange(e, 'email')}
                      style={{ width: '100%' }}
                    />
                  </FormItem>

                  <FormItem label={<Label>Téléphone</Label>}>
                    <Input
                      type={InputType.Tel}
                      value={formData.phone}
                      onInput={(e) => handleInputChange(e, 'phone')}
                      style={{ width: '100%' }}
                    />
                  </FormItem>

                  <FormItem label={<Label>Mobile</Label>}>
                    <Input
                      type={InputType.Tel}
                      value={formData.mobile}
                      onInput={(e) => handleInputChange(e, 'mobile')}
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                </Form>

                <FlexBox justifyContent={FlexBoxJustifyContent.End} style={{ marginTop: '1rem' }}>
                  <Button design={ButtonDesign.Emphasized} onClick={handleSaveProfile} disabled={saving}>
                    Enregistrer
                  </Button>
                </FlexBox>
              </div>
            </Card>

            {/* Preferences Card */}
            <Card
              style={{ marginBottom: '1rem' }}
              header={
                <CardHeader
                  titleText="Préférences"
                  avatar={<Icon name="settings" />}
                />
              }
            >
              <div style={{ padding: '1rem' }}>
                <Form labelSpanM={4} columnsM={2} columnsL={3}>
                  <FormItem label={<Label>Langue</Label>}>
                    <Select
                      value={formData.language}
                      onChange={(e) => handleInputChange(e, 'language')}
                      style={{ width: '100%' }}
                    >
                      <Option value="fr">Français</Option>
                      <Option value="en">English</Option>
                      <Option value="es">Español</Option>
                    </Select>
                  </FormItem>

                  <FormItem label={<Label>Fuseau horaire</Label>}>
                    <Select
                      value={formData.timezone}
                      onChange={(e) => handleInputChange(e, 'timezone')}
                      style={{ width: '100%' }}
                    >
                      <Option value="UTC">UTC</Option>
                      <Option value="Europe/Paris">Europe/Paris</Option>
                      <Option value="America/New_York">America/New_York</Option>
                      <Option value="Asia/Tokyo">Asia/Tokyo</Option>
                    </Select>
                  </FormItem>

                  <FormItem label={<Label>Thème</Label>}>
                    <Select
                      value={formData.theme}
                      onChange={(e) => handleInputChange(e, 'theme')}
                      style={{ width: '100%' }}
                    >
                      <Option value="light">Clair</Option>
                      <Option value="dark">Sombre</Option>
                      <Option value="auto">Automatique</Option>
                    </Select>
                  </FormItem>
                </Form>

                <FlexBox direction={FlexBoxDirection.Column} style={{ marginTop: '1rem', gap: '0.5rem' }}>
                  <CheckBox
                    text="Notifications par email"
                    checked={formData.email_notifications}
                    onChange={(e) => handleInputChange(e, 'email_notifications')}
                  />
                  <CheckBox
                    text="Notifications push navigateur"
                    checked={formData.push_notifications}
                    onChange={(e) => handleInputChange(e, 'push_notifications')}
                  />
                </FlexBox>

                <FlexBox justifyContent={FlexBoxJustifyContent.End} style={{ marginTop: '1rem' }}>
                  <Button design={ButtonDesign.Emphasized} onClick={handleSaveProfile} disabled={saving}>
                    Enregistrer
                  </Button>
                </FlexBox>
              </div>
            </Card>

            {/* Password Card */}
            <Card
              header={
                <CardHeader
                  titleText="Changer le mot de passe"
                  avatar={<Icon name="locked" />}
                />
              }
            >
              <div style={{ padding: '1rem' }}>
                <MessageStrip design={MessageStripDesign.Information} style={{ marginBottom: '1rem' }}>
                  Minimum 8 caractères avec lettres et chiffres
                </MessageStrip>

                <Form labelSpanM={4}>
                  <FormItem label={<Label>Mot de passe actuel</Label>}>
                    <Input
                      type={InputType.Password}
                      value={passwordForm.old_password}
                      onInput={(e) => handlePasswordChange(e, 'old_password')}
                      style={{ width: '100%' }}
                    />
                  </FormItem>

                  <FormItem label={<Label>Nouveau mot de passe</Label>}>
                    <Input
                      type={InputType.Password}
                      value={passwordForm.new_password}
                      onInput={(e) => handlePasswordChange(e, 'new_password')}
                      style={{ width: '100%' }}
                    />
                  </FormItem>

                  <FormItem label={<Label>Confirmer le nouveau mot de passe</Label>}>
                    <Input
                      type={InputType.Password}
                      value={passwordForm.new_password_confirm}
                      onInput={(e) => handlePasswordChange(e, 'new_password_confirm')}
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                </Form>

                <FlexBox justifyContent={FlexBoxJustifyContent.End} style={{ marginTop: '1rem' }}>
                  <Button
                    design={ButtonDesign.Emphasized}
                    onClick={handleChangePassword}
                    disabled={saving || !passwordForm.old_password || !passwordForm.new_password}
                  >
                    Changer le mot de passe
                  </Button>
                </FlexBox>
              </div>
            </Card>
          </div>
        </FlexBox>
      </FlexBox>
    </ThemeProvider>
  );
};

export default Profile;
