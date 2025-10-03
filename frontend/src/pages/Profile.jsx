import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  ShellBar,
  ShellBarItem,
  Card,
  CardHeader,
  Title,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  CheckBox,
  Button,
  FlexBox,
  Icon,
  Avatar,
  MessageStrip,
  Label,
  FileUploader
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';
import './Dashboard.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du profil');
      }

      const data = await response.json();
      setUser(data);

      // Remplir le formulaire avec les données
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
      console.error('Erreur:', error);
      setMessage({ type: 'Error', text: error.message });
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value !== undefined ? e.target.value : e.target.checked;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (e, field) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);

      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      setMessage({ type: 'Warning', text: 'Veuillez sélectionner un fichier' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await fetch(`${apiUrl}/api/users/users/update_profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      setUser(data);
      setAvatarFile(null);
      setAvatarPreview(null);

      // Mettre à jour localStorage
      const userToStore = {
        id: data.id,
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        display_name: data.display_name,
        avatar_url: data.avatar_url
      };
      localStorage.setItem('user', JSON.stringify(userToStore));

      setMessage({ type: 'Success', text: 'Avatar mis à jour avec succès' });
      setSaving(false);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'Error', text: error.message });
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

      const data = await response.json();
      setUser(data);

      // Mettre à jour localStorage
      const userToStore = {
        id: data.id,
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        display_name: data.display_name,
        avatar_url: data.avatar_url
      };
      localStorage.setItem('user', JSON.stringify(userToStore));

      setMessage({ type: 'Success', text: 'Profil mis à jour avec succès' });
      setSaving(false);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'Error', text: error.message });
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setMessage(null);

    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      setMessage({ type: 'Error', text: 'Les mots de passe ne correspondent pas' });
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

      setMessage({ type: 'Success', text: 'Mot de passe modifié avec succès' });
      setPasswordForm({
        old_password: '',
        new_password: '',
        new_password_confirm: ''
      });
      setSaving(false);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'Error', text: error.message });
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <ThemeProvider>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Chargement...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="dashboard-container">
        <ShellBar
          primaryTitle="OpsFlux"
          secondaryTitle="Mon Profil"
          logo={<Icon name="business-suite" />}
          profile={
            <Avatar initials={user.username?.charAt(0).toUpperCase() || 'U'} />
          }
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

        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Title level="H3" style={{ marginBottom: '2rem' }}>
            Mon Profil
          </Title>

          {message && (
            <MessageStrip
              design={message.type}
              style={{ marginBottom: '1rem' }}
              onClose={() => setMessage(null)}
            >
              {message.text}
            </MessageStrip>
          )}

          <FlexBox direction="Column" style={{ gap: '2rem' }}>
            {/* Avatar */}
            <Card
              header={
                <CardHeader
                  titleText="Photo de profil"
                  avatar={<Icon name="camera" />}
                />
              }
            >
              <div style={{ padding: '1rem' }}>
                <FlexBox alignItems="Center" style={{ gap: '2rem' }}>
                  <Avatar
                    size="XL"
                    style={{ width: '120px', height: '120px' }}
                  >
                    {avatarPreview || user.avatar_url ? (
                      <img
                        src={avatarPreview || user.avatar_url}
                        alt="Avatar"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '48px' }}>
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </Avatar>

                  <FlexBox direction="Column" style={{ gap: '1rem', flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <div style={{ fontSize: '0.875rem', color: 'var(--sapNeutralTextColor)' }}>
                      Formats acceptés: JPG, PNG, GIF. Taille maximale: 2MB
                    </div>
                    <FlexBox style={{ gap: '0.5rem' }}>
                      <Button
                        design="Emphasized"
                        onClick={handleUploadAvatar}
                        disabled={saving || !avatarFile}
                      >
                        Enregistrer la photo
                      </Button>
                      {avatarPreview && (
                        <Button
                          onClick={() => {
                            setAvatarFile(null);
                            setAvatarPreview(null);
                          }}
                        >
                          Annuler
                        </Button>
                      )}
                    </FlexBox>
                  </FlexBox>
                </FlexBox>
              </div>
            </Card>

            {/* Informations personnelles */}
            <Card
              header={
                <CardHeader
                  titleText="Informations personnelles"
                  avatar={<Icon name="person-placeholder" />}
                />
              }
            >
              <div style={{ padding: '1rem' }}>
                <Form>
                  <FormItem label={<Label>Nom d'utilisateur</Label>}>
                    <Input value={user.username} disabled />
                  </FormItem>

                  <FormItem label={<Label>Prénom</Label>}>
                    <Input
                      value={formData.first_name}
                      onInput={(e) => handleInputChange(e, 'first_name')}
                    />
                  </FormItem>

                  <FormItem label={<Label>Nom</Label>}>
                    <Input
                      value={formData.last_name}
                      onInput={(e) => handleInputChange(e, 'last_name')}
                    />
                  </FormItem>

                  <FormItem label={<Label>Email</Label>}>
                    <Input
                      type="email"
                      value={formData.email}
                      onInput={(e) => handleInputChange(e, 'email')}
                    />
                  </FormItem>

                  <FormItem label={<Label>Téléphone</Label>}>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onInput={(e) => handleInputChange(e, 'phone')}
                    />
                  </FormItem>

                  <FormItem label={<Label>Mobile</Label>}>
                    <Input
                      type="tel"
                      value={formData.mobile}
                      onInput={(e) => handleInputChange(e, 'mobile')}
                    />
                  </FormItem>
                </Form>

                <FlexBox justifyContent="End" style={{ marginTop: '1rem' }}>
                  <Button
                    design="Emphasized"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    Enregistrer
                  </Button>
                </FlexBox>
              </div>
            </Card>

            {/* Préférences */}
            <Card
              header={
                <CardHeader
                  titleText="Préférences"
                  avatar={<Icon name="settings" />}
                />
              }
            >
              <div style={{ padding: '1rem' }}>
                <Form>
                  <FormItem label={<Label>Langue</Label>}>
                    <Select
                      value={formData.language}
                      onChange={(e) => handleInputChange(e, 'language')}
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
                    >
                      <Option value="light">Clair</Option>
                      <Option value="dark">Sombre</Option>
                      <Option value="auto">Automatique</Option>
                    </Select>
                  </FormItem>

                  <FormItem>
                    <CheckBox
                      text="Notifications par email"
                      checked={formData.email_notifications}
                      onChange={(e) => handleInputChange(e, 'email_notifications')}
                    />
                  </FormItem>

                  <FormItem>
                    <CheckBox
                      text="Notifications push navigateur"
                      checked={formData.push_notifications}
                      onChange={(e) => handleInputChange(e, 'push_notifications')}
                    />
                  </FormItem>
                </Form>

                <FlexBox justifyContent="End" style={{ marginTop: '1rem' }}>
                  <Button
                    design="Emphasized"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    Enregistrer
                  </Button>
                </FlexBox>
              </div>
            </Card>

            {/* Changement de mot de passe */}
            <Card
              header={
                <CardHeader
                  titleText="Changer le mot de passe"
                  avatar={<Icon name="locked" />}
                />
              }
            >
              <div style={{ padding: '1rem' }}>
                <Form>
                  <FormItem label={<Label>Mot de passe actuel</Label>}>
                    <Input
                      type="password"
                      value={passwordForm.old_password}
                      onInput={(e) => handlePasswordChange(e, 'old_password')}
                    />
                  </FormItem>

                  <FormItem label={<Label>Nouveau mot de passe</Label>}>
                    <Input
                      type="password"
                      value={passwordForm.new_password}
                      onInput={(e) => handlePasswordChange(e, 'new_password')}
                    />
                  </FormItem>

                  <FormItem label={<Label>Confirmer le nouveau mot de passe</Label>}>
                    <Input
                      type="password"
                      value={passwordForm.new_password_confirm}
                      onInput={(e) => handlePasswordChange(e, 'new_password_confirm')}
                    />
                  </FormItem>
                </Form>

                <FlexBox justifyContent="End" style={{ marginTop: '1rem' }}>
                  <Button
                    design="Emphasized"
                    onClick={handleChangePassword}
                    disabled={saving || !passwordForm.old_password || !passwordForm.new_password}
                  >
                    Changer le mot de passe
                  </Button>
                </FlexBox>
              </div>
            </Card>
          </FlexBox>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Profile;
