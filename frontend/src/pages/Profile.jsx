import React, { useEffect, useState } from 'react';
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
  BusyIndicator
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

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
      setMessage({ type: 'Error', text: error.message });
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
      setMessage({ type: 'Warning', text: 'Veuillez sélectionner un fichier' });
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

      setMessage({ type: 'Success', text: 'Avatar mis à jour avec succès' });
    } catch (error) {
      setMessage({ type: 'Error', text: error.message });
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

      setMessage({ type: 'Success', text: 'Profil mis à jour avec succès' });
    } catch (error) {
      setMessage({ type: 'Error', text: error.message });
    } finally {
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
      setPasswordForm({ old_password: '', new_password: '', new_password_confirm: '' });
    } catch (error) {
      setMessage({ type: 'Error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <ThemeProvider>
        <div className="profile-loading">
          <BusyIndicator active size="Large" />
          <span className="profile-loading-text">Chargement du profil...</span>
        </div>
      </ThemeProvider>
    );
  }

  const displayName = user.display_name || user.username || 'Utilisateur';
  const initials = user.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <ThemeProvider>
      <div className="profile-container">
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

        <div className="profile-content">
          <div className="profile-content-inner">
            {/* Header */}
            <div className="profile-header">
              <h1 className="profile-title">Mon Profil</h1>
              <p className="profile-subtitle">
                Gérez vos informations personnelles et préférences
              </p>
            </div>

            {/* Messages */}
            {message && (
              <div className="profile-message">
                <MessageStrip
                  design={message.type}
                  onClose={() => setMessage(null)}
                >
                  {message.text}
                </MessageStrip>
              </div>
            )}

            {/* Sections */}
            <div className="profile-sections">
              {/* Avatar */}
              <Card
                className="profile-card"
                header={
                  <CardHeader
                    titleText="Photo de profil"
                    avatar={<Icon name="camera" />}
                  />
                }
              >
                <div className="profile-card-content">
                  <div className="profile-avatar-section">
                    <div className="profile-avatar-preview">
                      {avatarPreview || user.avatar_url ? (
                        <img src={avatarPreview || user.avatar_url} alt="Avatar" />
                      ) : (
                        <div className="profile-avatar-placeholder">{initials}</div>
                      )}
                    </div>

                    <div className="profile-avatar-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      <p className="profile-avatar-info">
                        Formats acceptés : JPG, PNG, GIF · Taille max : 2MB
                      </p>
                      <div className="profile-avatar-actions">
                        <Button
                          design="Emphasized"
                          onClick={handleUploadAvatar}
                          disabled={saving || !avatarFile}
                        >
                          Enregistrer la photo
                        </Button>
                        {avatarPreview && (
                          <Button onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}>
                            Annuler
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Informations personnelles */}
              <Card
                className="profile-card"
                header={
                  <CardHeader
                    titleText="Informations personnelles"
                    avatar={<Icon name="person-placeholder" />}
                  />
                }
              >
                <div className="profile-card-content">
                  <div className="profile-form">
                    <div className="profile-form-item">
                      <Label className="profile-form-label">Nom d'utilisateur</Label>
                      <Input value={user.username} disabled className="profile-form-input" />
                    </div>

                    <div className="profile-form-item">
                      <Label className="profile-form-label">Prénom</Label>
                      <Input
                        value={formData.first_name}
                        onInput={(e) => handleInputChange(e, 'first_name')}
                        className="profile-form-input"
                      />
                    </div>

                    <div className="profile-form-item">
                      <Label className="profile-form-label">Nom</Label>
                      <Input
                        value={formData.last_name}
                        onInput={(e) => handleInputChange(e, 'last_name')}
                        className="profile-form-input"
                      />
                    </div>

                    <div className="profile-form-item">
                      <Label className="profile-form-label">Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onInput={(e) => handleInputChange(e, 'email')}
                        className="profile-form-input"
                      />
                    </div>

                    <div className="profile-form-item">
                      <Label className="profile-form-label">Téléphone</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onInput={(e) => handleInputChange(e, 'phone')}
                        className="profile-form-input"
                      />
                    </div>

                    <div className="profile-form-item">
                      <Label className="profile-form-label">Mobile</Label>
                      <Input
                        type="tel"
                        value={formData.mobile}
                        onInput={(e) => handleInputChange(e, 'mobile')}
                        className="profile-form-input"
                      />
                    </div>
                  </div>

                  <div className="profile-form-actions">
                    <Button design="Emphasized" onClick={handleSaveProfile} disabled={saving}>
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Préférences */}
              <Card
                className="profile-card"
                header={
                  <CardHeader
                    titleText="Préférences"
                    avatar={<Icon name="settings" />}
                  />
                }
              >
                <div className="profile-card-content">
                  <div className="profile-form">
                    <div className="profile-form-item">
                      <Label className="profile-form-label">Langue</Label>
                      <Select
                        value={formData.language}
                        onChange={(e) => handleInputChange(e, 'language')}
                        className="profile-form-input"
                      >
                        <Option value="fr">Français</Option>
                        <Option value="en">English</Option>
                        <Option value="es">Español</Option>
                      </Select>
                    </div>

                    <div className="profile-form-item">
                      <Label className="profile-form-label">Fuseau horaire</Label>
                      <Select
                        value={formData.timezone}
                        onChange={(e) => handleInputChange(e, 'timezone')}
                        className="profile-form-input"
                      >
                        <Option value="UTC">UTC</Option>
                        <Option value="Europe/Paris">Europe/Paris</Option>
                        <Option value="America/New_York">America/New_York</Option>
                        <Option value="Asia/Tokyo">Asia/Tokyo</Option>
                      </Select>
                    </div>

                    <div className="profile-form-item">
                      <Label className="profile-form-label">Thème</Label>
                      <Select
                        value={formData.theme}
                        onChange={(e) => handleInputChange(e, 'theme')}
                        className="profile-form-input"
                      >
                        <Option value="light">Clair</Option>
                        <Option value="dark">Sombre</Option>
                        <Option value="auto">Automatique</Option>
                      </Select>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem' }}>
                    <div className="profile-checkbox-wrapper">
                      <CheckBox
                        text="Notifications par email"
                        checked={formData.email_notifications}
                        onChange={(e) => handleInputChange(e, 'email_notifications')}
                      />
                    </div>
                    <div className="profile-checkbox-wrapper">
                      <CheckBox
                        text="Notifications push navigateur"
                        checked={formData.push_notifications}
                        onChange={(e) => handleInputChange(e, 'push_notifications')}
                      />
                    </div>
                  </div>

                  <div className="profile-form-actions">
                    <Button design="Emphasized" onClick={handleSaveProfile} disabled={saving}>
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Changer le mot de passe */}
              <Card
                className="profile-card"
                header={
                  <CardHeader
                    titleText="Changer le mot de passe"
                    avatar={<Icon name="locked" />}
                  />
                }
              >
                <div className="profile-card-content">
                  <div className="profile-password-info">
                    <p className="profile-password-info-text">
                      Minimum 8 caractères avec lettres et chiffres
                    </p>
                  </div>

                  <div className="profile-password-grid">
                    <div className="profile-form-item">
                      <Label className="profile-form-label">Mot de passe actuel</Label>
                      <Input
                        type="password"
                        value={passwordForm.old_password}
                        onInput={(e) => handlePasswordChange(e, 'old_password')}
                        className="profile-form-input"
                      />
                    </div>

                    <div className="profile-form-item">
                      <Label className="profile-form-label">Nouveau mot de passe</Label>
                      <Input
                        type="password"
                        value={passwordForm.new_password}
                        onInput={(e) => handlePasswordChange(e, 'new_password')}
                        className="profile-form-input"
                      />
                    </div>

                    <div className="profile-form-item">
                      <Label className="profile-form-label">Confirmer le nouveau mot de passe</Label>
                      <Input
                        type="password"
                        value={passwordForm.new_password_confirm}
                        onInput={(e) => handlePasswordChange(e, 'new_password_confirm')}
                        className="profile-form-input"
                      />
                    </div>
                  </div>

                  <div className="profile-form-actions">
                    <Button
                      design="Emphasized"
                      onClick={handleChangePassword}
                      disabled={saving || !passwordForm.old_password || !passwordForm.new_password}
                    >
                      Changer le mot de passe
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Profile;
