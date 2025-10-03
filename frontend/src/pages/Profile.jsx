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

    // Online/Offline listener
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      setMessage({ type: MessageStripDesign.Negative, text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setMessage({ type: MessageStripDesign.Negative, text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/users/users/change_password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors du changement de mot de passe');
      }

      setPasswordForm({ old_password: '', new_password: '', new_password_confirm: '' });
      setMessage({ type: MessageStripDesign.Success, text: 'Mot de passe modifié avec succès' });
    } catch (error) {
      setMessage({ type: MessageStripDesign.Negative, text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const toggleProfilePopover = (e) => {
    if (profilePopoverRef.current) {
      profilePopoverRef.current.showAt(e.detail.targetRef || profileButtonRef.current);
    }
  };

  if (loading) {
    return (
      <FlexBox
        justifyContent={FlexBoxJustifyContent.Center}
        alignItems={FlexBoxAlignItems.Center}
        style={{ height: '100vh' }}
      >
        <BusyIndicator active size="Large" text="Chargement du profil..." />
      </FlexBox>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.display_name || user.username || 'Utilisateur';
  const initials = user.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <ThemeProvider>
      <FlexBox
        direction={FlexBoxDirection.Column}
        style={{ height: '100vh', background: 'var(--sapBackgroundColor)' }}
      >
        {/* ShellBar Header */}
        <ShellBar
          primaryTitle="OpsFlux"
          secondaryTitle="Mon Profil"
          logo={<Icon name="business-suite" />}
          profile={
            <div ref={profileButtonRef}>
              <Avatar
                initials={initials}
                size={AvatarSize.XS}
                style={{ cursor: 'pointer' }}
              />
            </div>
          }
          onProfileClick={toggleProfilePopover}
          onLogoClick={() => navigate('/dashboard')}
          showProductSwitch={false}
          showCoPilot={false}
        >
          <ShellBarItem icon="home" text="Tableau de bord" onClick={() => navigate('/dashboard')} />
          <ShellBarItem
            icon={isOnline ? 'connected' : 'disconnected'}
            text={isOnline ? 'En ligne' : 'Hors ligne'}
          />
        </ShellBar>

        {/* Profile Popover */}
        <Popover
          ref={profilePopoverRef}
          placementType={PopoverPlacementType.Bottom}
          headerText={displayName}
        >
          <List>
            <StandardListItem icon="action-settings" onClick={() => { profilePopoverRef.current?.close(); navigate('/dashboard'); }}>
              Tableau de bord
            </StandardListItem>
            <StandardListItem type="Active" icon="log" onClick={() => { profilePopoverRef.current?.close(); handleLogout(); }}>
              Déconnexion
            </StandardListItem>
          </List>
        </Popover>

        {/* Main Content */}
        <FlexBox direction={FlexBoxDirection.Column} style={{ flex: 1, background: 'var(--sapBackgroundColor)' }}>
          {/* Breadcrumbs */}
          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--sapGroup_ContentBorderColor)' }}>
            <Breadcrumbs>
              <BreadcrumbsItem href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                Accueil
              </BreadcrumbsItem>
              <BreadcrumbsItem>Mon profil</BreadcrumbsItem>
            </Breadcrumbs>
          </div>

          {/* Profile Header Card */}
          <div style={{ padding: '2rem' }}>
            <Card style={{ marginBottom: '2rem' }}>
              <FlexBox
                alignItems={FlexBoxAlignItems.Center}
                style={{ padding: '2rem', gap: '2rem', flexWrap: 'wrap' }}
              >
                <Avatar
                  size={AvatarSize.XL}
                  initials={initials}
                  style={{ fontSize: '3rem' }}
                />
                <FlexBox direction={FlexBoxDirection.Column} style={{ flex: 1, gap: '0.5rem' }}>
                  <Title level={TitleLevel.H3}>{displayName}</Title>
                  <Text style={{ color: 'var(--sapNeutralTextColor)' }}>@{user.username}</Text>
                  <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '1rem', marginTop: '0.5rem' }}>
                    <ObjectStatus state={ValueState.Success} icon="email">
                      {user.email}
                    </ObjectStatus>
                    <ObjectStatus state={isOnline ? ValueState.Success : ValueState.Error} icon={isOnline ? 'connected' : 'disconnected'}>
                      {isOnline ? 'En ligne' : 'Hors ligne'}
                    </ObjectStatus>
                  </FlexBox>
                </FlexBox>
                <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.5rem' }}>
                  <Badge colorScheme="8">Utilisateur actif</Badge>
                  <Text style={{ fontSize: '0.875rem', color: 'var(--sapNeutralTextColor)' }}>
                    Membre depuis 2025
                  </Text>
                </FlexBox>
              </FlexBox>
            </Card>

            {/* Messages */}
            {message && (
              <MessageStrip
                design={message.type}
                onClose={() => setMessage(null)}
                style={{ marginBottom: '1rem' }}
              >
                {message.text}
              </MessageStrip>
            )}

            {/* TabContainer */}
            <TabContainer
              onTabSelect={(e) => setSelectedTab(e.detail.tabIndex)}
              style={{ height: 'auto' }}
            >
              {/* Tab 1: Informations personnelles */}
              <Tab text="Informations personnelles" icon="person-placeholder" selected={selectedTab === 0}>
                <div style={{ padding: '2rem' }}>
                  <Title level={TitleLevel.H4} style={{ marginBottom: '1.5rem' }}>
                    Informations personnelles
                  </Title>
                  <Form labelSpanM={4} columnsM={2} columnsL={2}>
                    <FormItem label={<Label>Nom d'utilisateur</Label>}>
                      <Input value={user.username} disabled style={{ width: '100%' }} />
                    </FormItem>
                    <FormItem label={<Label>Email</Label>}>
                      <Input value={formData.email} onInput={(e) => handleInputChange(e, 'email')} type={InputType.Email} style={{ width: '100%' }} />
                    </FormItem>
                    <FormItem label={<Label>Prénom</Label>}>
                      <Input value={formData.first_name} onInput={(e) => handleInputChange(e, 'first_name')} style={{ width: '100%' }} />
                    </FormItem>
                    <FormItem label={<Label>Nom</Label>}>
                      <Input value={formData.last_name} onInput={(e) => handleInputChange(e, 'last_name')} style={{ width: '100%' }} />
                    </FormItem>
                    <FormItem label={<Label>Téléphone</Label>}>
                      <Input value={formData.phone} onInput={(e) => handleInputChange(e, 'phone')} type={InputType.Tel} style={{ width: '100%' }} />
                    </FormItem>
                    <FormItem label={<Label>Mobile</Label>}>
                      <Input value={formData.mobile} onInput={(e) => handleInputChange(e, 'mobile')} type={InputType.Tel} style={{ width: '100%' }} />
                    </FormItem>
                  </Form>
                  <FlexBox justifyContent={FlexBoxJustifyContent.End} style={{ marginTop: '2rem', gap: '0.5rem' }}>
                    <Button design={ButtonDesign.Transparent} onClick={fetchProfile}>Annuler</Button>
                    <Button design={ButtonDesign.Emphasized} icon="save" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                  </FlexBox>
                </div>
              </Tab>

              {/* Tab 2: Sécurité */}
              <Tab text="Sécurité" icon="shield" selected={selectedTab === 1}>
                <div style={{ padding: '2rem' }}>
                  <Title level={TitleLevel.H4} style={{ marginBottom: '1.5rem' }}>
                    Modifier le mot de passe
                  </Title>
                  <Form labelSpanM={4} columnsM={1} columnsL={1} style={{ maxWidth: '600px' }}>
                    <FormItem label={<Label required>Mot de passe actuel</Label>}>
                      <Input
                        value={passwordForm.old_password}
                        onInput={(e) => handlePasswordChange(e, 'old_password')}
                        type={InputType.Password}
                        required
                        style={{ width: '100%' }}
                      />
                    </FormItem>
                    <FormItem label={<Label required>Nouveau mot de passe</Label>}>
                      <Input
                        value={passwordForm.new_password}
                        onInput={(e) => handlePasswordChange(e, 'new_password')}
                        type={InputType.Password}
                        required
                        style={{ width: '100%' }}
                      />
                    </FormItem>
                    <FormItem label={<Label required>Confirmer le mot de passe</Label>}>
                      <Input
                        value={passwordForm.new_password_confirm}
                        onInput={(e) => handlePasswordChange(e, 'new_password_confirm')}
                        type={InputType.Password}
                        required
                        style={{ width: '100%' }}
                      />
                    </FormItem>
                  </Form>
                  <FlexBox justifyContent={FlexBoxJustifyContent.Start} style={{ marginTop: '2rem', gap: '0.5rem' }}>
                    <Button design={ButtonDesign.Emphasized} icon="locked" onClick={handleChangePassword} disabled={saving}>
                      {saving ? 'Modification...' : 'Changer le mot de passe'}
                    </Button>
                  </FlexBox>

                  <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--sapInfoBackground)', borderRadius: '0.25rem' }}>
                    <Title level={TitleLevel.H5} style={{ marginBottom: '1rem' }}>
                      Authentification à deux facteurs (2FA)
                    </Title>
                    <Text style={{ display: 'block', marginBottom: '1rem' }}>
                      Ajoutez une couche de sécurité supplémentaire à votre compte
                    </Text>
                    <Button design={ButtonDesign.Default} icon="add" disabled>
                      Activer 2FA (Bientôt disponible)
                    </Button>
                  </div>
                </div>
              </Tab>

              {/* Tab 3: Préférences */}
              <Tab text="Préférences" icon="action-settings" selected={selectedTab === 2}>
                <div style={{ padding: '2rem' }}>
                  <Title level={TitleLevel.H4} style={{ marginBottom: '1.5rem' }}>
                    Préférences
                  </Title>
                  <Form labelSpanM={4} columnsM={2} columnsL={2}>
                    <FormItem label={<Label>Langue</Label>}>
                      <Select
                        onChange={(e) => handleInputChange({ target: { value: e.detail.selectedOption.value } }, 'language')}
                        style={{ width: '100%' }}
                      >
                        <Option value="fr" selected={formData.language === 'fr'}>Français</Option>
                        <Option value="en" selected={formData.language === 'en'}>English</Option>
                        <Option value="es" selected={formData.language === 'es'}>Español</Option>
                      </Select>
                    </FormItem>
                    <FormItem label={<Label>Fuseau horaire</Label>}>
                      <Select
                        onChange={(e) => handleInputChange({ target: { value: e.detail.selectedOption.value } }, 'timezone')}
                        style={{ width: '100%' }}
                      >
                        <Option value="UTC" selected={formData.timezone === 'UTC'}>UTC</Option>
                        <Option value="Europe/Paris" selected={formData.timezone === 'Europe/Paris'}>Europe/Paris</Option>
                        <Option value="America/New_York" selected={formData.timezone === 'America/New_York'}>America/New_York</Option>
                      </Select>
                    </FormItem>
                    <FormItem label={<Label>Thème</Label>}>
                      <Select
                        onChange={(e) => handleInputChange({ target: { value: e.detail.selectedOption.value } }, 'theme')}
                        style={{ width: '100%' }}
                      >
                        <Option value="auto" selected={formData.theme === 'auto'}>Automatique</Option>
                        <Option value="light" selected={formData.theme === 'light'}>Clair</Option>
                        <Option value="dark" selected={formData.theme === 'dark'}>Sombre</Option>
                      </Select>
                    </FormItem>
                  </Form>

                  <div style={{ marginTop: '2rem' }}>
                    <Title level={TitleLevel.H5} style={{ marginBottom: '1rem' }}>
                      Notifications
                    </Title>
                    <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '1rem' }}>
                      <CheckBox
                        text="Recevoir les notifications par email"
                        checked={formData.email_notifications}
                        onChange={(e) => handleInputChange(e, 'email_notifications')}
                      />
                      <CheckBox
                        text="Recevoir les notifications push"
                        checked={formData.push_notifications}
                        onChange={(e) => handleInputChange(e, 'push_notifications')}
                      />
                    </FlexBox>
                  </div>

                  <FlexBox justifyContent={FlexBoxJustifyContent.End} style={{ marginTop: '2rem', gap: '0.5rem' }}>
                    <Button design={ButtonDesign.Transparent} onClick={fetchProfile}>Annuler</Button>
                    <Button design={ButtonDesign.Emphasized} icon="save" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                  </FlexBox>
                </div>
              </Tab>
            </TabContainer>
          </div>

          {/* Footer Toolbar */}
          <Bar
            design={BarDesign.Footer}
            startContent={
              <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                <Icon name="sys-monitor" />
                <Label>OpsFlux v1.0.0</Label>
              </FlexBox>
            }
            endContent={
              <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '1rem' }}>
                <Label>Statut: {isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}</Label>
                <Label>|</Label>
                <Label>Utilisateur: {displayName}</Label>
                <Label>|</Label>
                <Label>© 2025 OpsFlux</Label>
              </FlexBox>
            }
          />
        </FlexBox>
      </FlexBox>
    </ThemeProvider>
  );
};

export default Profile;
