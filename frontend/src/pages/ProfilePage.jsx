import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@ui5/webcomponents-fiori/dist/ShellBar.js';
import '@ui5/webcomponents-fiori/dist/ShellBarBranding.js';
import '@ui5/webcomponents-fiori/dist/ShellBarItem.js';
import '@ui5/webcomponents-fiori/dist/ObjectPage.js';
import '@ui5/webcomponents-fiori/dist/ObjectPageSection.js';
import '@ui5/webcomponents-fiori/dist/ObjectPageSubSection.js';
import '@ui5/webcomponents/dist/Avatar.js';
import '@ui5/webcomponents/dist/Button.js';
import '@ui5/webcomponents/dist/Input.js';
import '@ui5/webcomponents/dist/Label.js';
import '@ui5/webcomponents/dist/Title.js';
import '@ui5/webcomponents/dist/Text.js';
import '@ui5/webcomponents/dist/Tag.js';
import '@ui5/webcomponents/dist/Select.js';
import '@ui5/webcomponents/dist/Option.js';
import '@ui5/webcomponents/dist/CheckBox.js';
import '@ui5/webcomponents/dist/Card.js';
import '@ui5/webcomponents/dist/CardHeader.js';
import '@ui5/webcomponents/dist/MessageStrip.js';
import '@ui5/webcomponents/dist/BusyIndicator.js';
import '@ui5/webcomponents/dist/Icon.js';
import '@ui5/webcomponents/dist/Breadcrumbs.js';
import '@ui5/webcomponents/dist/BreadcrumbsItem.js';
import '@ui5/webcomponents-icons/dist/person-placeholder.js';
import '@ui5/webcomponents-icons/dist/email.js';
import '@ui5/webcomponents-icons/dist/phone.js';
import '@ui5/webcomponents-icons/dist/mobile.js';
import '@ui5/webcomponents-icons/dist/palette.js';
import '@ui5/webcomponents-icons/dist/globe.js';
import '@ui5/webcomponents-icons/dist/bell.js';
import '@ui5/webcomponents-icons/dist/locked.js';
import '@ui5/webcomponents-icons/dist/save.js';
import '@ui5/webcomponents-icons/dist/home.js';
import './ProfilePage.css';

/**
 * Page Profile complète avec SAP Fiori ObjectPage pattern
 * Accessible via menu ou bouton "Mon profil"
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

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
      setMessage({ type: "Negative", text: error.message });
      setLoading(false);
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

      setMessage({ type: "Positive", text: 'Profil mis à jour avec succès' });
    } catch (error) {
      setMessage({ type: "Negative", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      setMessage({ type: "Negative", text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setMessage({ type: "Negative", text: 'Le mot de passe doit contenir au moins 8 caractères' });
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
      setMessage({ type: "Positive", text: 'Mot de passe modifié avec succès' });
    } catch (error) {
      setMessage({ type: "Negative", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ui5-busy-indicator active size="Large" text="Chargement..."></ui5-busy-indicator>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.display_name || user.username || 'Utilisateur';
  const initials = user.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div style={{ height: '100vh', background: 'var(--sapBackgroundColor)' }}>
      {/* ShellBar */}
      <ui5-shellbar
        primary-title="OpsFlux"
        secondary-title="Mon Profil"
      >
        <ui5-shellbar-branding slot="branding">
          OpsFlux
          <ui5-icon slot="logo" name="person-placeholder"></ui5-icon>
        </ui5-shellbar-branding>

        <ui5-shellbar-item
          icon="home"
          text="Retour"
          onClick={() => navigate('/dashboard')}
        ></ui5-shellbar-item>

        <ui5-avatar
          slot="profile"
          initials={initials}
        ></ui5-avatar>
      </ui5-shellbar>

      {/* Breadcrumbs */}
      <div style={{ padding: '0.5rem 2rem', borderBottom: '1px solid var(--sapGroup_ContentBorderColor)' }}>
        <ui5-breadcrumbs>
          <ui5-breadcrumbs-item onClick={() => navigate('/dashboard')}>
            Accueil
          </ui5-breadcrumbs-item>
          <ui5-breadcrumbs-item>Mon profil</ui5-breadcrumbs-item>
        </ui5-breadcrumbs>
      </div>

      {/* ObjectPage */}
      <ui5-object-page
        header-title={displayName}
        header-subtitle={`@${user.username}`}
        style={{ height: 'calc(100vh - 88px)' }}
      >
        {/* Header Avatar */}
        <div slot="image">
          <ui5-avatar
            initials={initials}
            size="L"
            style={{ fontSize: '3rem' }}
          ></ui5-avatar>
        </div>

        {/* Header Actions */}
        <div slot="headerActions">
          <ui5-tag color-scheme="9">Actif</ui5-tag>
          <ui5-button design="Emphasized" icon="save" onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </ui5-button>
        </div>

        {/* Messages */}
        {message && (
          <div style={{ padding: '1rem 2rem' }}>
            <ui5-message-strip design={message.type} onClose={() => setMessage(null)}>
              {message.text}
            </ui5-message-strip>
          </div>
        )}

        {/* Section: Informations personnelles */}
        <ui5-object-page-section
          title-text="Informations personnelles"
          id="personal-info"
        >
          <ui5-object-page-sub-section title-text="Identité">
            <div className="profile-form-grid">
              <div className="form-group">
                <ui5-label for="username" required>Nom d'utilisateur</ui5-label>
                <ui5-input id="username" value={user.username} disabled></ui5-input>
              </div>

              <div className="form-group">
                <ui5-label for="email" required>Email</ui5-label>
                <ui5-input
                  id="email"
                  type="Email"
                  value={formData.email}
                  onInput={(e) => setFormData({ ...formData, email: e.target.value })}
                  icon={<ui5-icon name="email"></ui5-icon>}
                ></ui5-input>
              </div>

              <div className="form-group">
                <ui5-label for="first_name">Prénom</ui5-label>
                <ui5-input
                  id="first_name"
                  value={formData.first_name}
                  onInput={(e) => setFormData({ ...formData, first_name: e.target.value })}
                ></ui5-input>
              </div>

              <div className="form-group">
                <ui5-label for="last_name">Nom</ui5-label>
                <ui5-input
                  id="last_name"
                  value={formData.last_name}
                  onInput={(e) => setFormData({ ...formData, last_name: e.target.value })}
                ></ui5-input>
              </div>
            </div>
          </ui5-object-page-sub-section>

          <ui5-object-page-sub-section title-text="Contact">
            <div className="profile-form-grid">
              <div className="form-group">
                <ui5-label for="phone">Téléphone</ui5-label>
                <ui5-input
                  id="phone"
                  type="Tel"
                  value={formData.phone}
                  onInput={(e) => setFormData({ ...formData, phone: e.target.value })}
                  icon={<ui5-icon name="phone"></ui5-icon>}
                ></ui5-input>
              </div>

              <div className="form-group">
                <ui5-label for="mobile">Mobile</ui5-label>
                <ui5-input
                  id="mobile"
                  type="Tel"
                  value={formData.mobile}
                  onInput={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  icon={<ui5-icon name="mobile"></ui5-icon>}
                ></ui5-input>
              </div>
            </div>
          </ui5-object-page-sub-section>
        </ui5-object-page-section>

        {/* Section: Préférences */}
        <ui5-object-page-section
          title-text="Préférences"
          id="preferences"
        >
          <ui5-object-page-sub-section title-text="Langue et Région">
            <div className="profile-form-grid">
              <div className="form-group">
                <ui5-label for="language">Langue</ui5-label>
                <ui5-select
                  id="language"
                  onChange={(e) => setFormData({ ...formData, language: e.detail.selectedOption.value })}
                >
                  <ui5-option value="fr" selected={formData.language === 'fr'}>Français</ui5-option>
                  <ui5-option value="en" selected={formData.language === 'en'}>English</ui5-option>
                  <ui5-option value="es" selected={formData.language === 'es'}>Español</ui5-option>
                </ui5-select>
              </div>

              <div className="form-group">
                <ui5-label for="timezone">Fuseau horaire</ui5-label>
                <ui5-select
                  id="timezone"
                  onChange={(e) => setFormData({ ...formData, timezone: e.detail.selectedOption.value })}
                >
                  <ui5-option value="UTC" selected={formData.timezone === 'UTC'}>UTC</ui5-option>
                  <ui5-option value="Europe/Paris" selected={formData.timezone === 'Europe/Paris'}>Europe/Paris</ui5-option>
                  <ui5-option value="America/New_York" selected={formData.timezone === 'America/New_York'}>America/New York</ui5-option>
                  <ui5-option value="Asia/Tokyo" selected={formData.timezone === 'Asia/Tokyo'}>Asia/Tokyo</ui5-option>
                </ui5-select>
              </div>
            </div>
          </ui5-object-page-sub-section>

          <ui5-object-page-sub-section title-text="Apparence">
            <div className="profile-form-grid">
              <div className="form-group">
                <ui5-label for="theme">Thème</ui5-label>
                <ui5-select
                  id="theme"
                  onChange={(e) => setFormData({ ...formData, theme: e.detail.selectedOption.value })}
                >
                  <ui5-option value="auto" selected={formData.theme === 'auto'}>Automatique</ui5-option>
                  <ui5-option value="light" selected={formData.theme === 'light'}>Clair</ui5-option>
                  <ui5-option value="dark" selected={formData.theme === 'dark'}>Sombre</ui5-option>
                </ui5-select>
              </div>
            </div>
          </ui5-object-page-sub-section>

          <ui5-object-page-sub-section title-text="Notifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ui5-checkbox
                text="Recevoir les notifications par email"
                checked={formData.email_notifications}
                onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })}
              />
              <ui5-checkbox
                text="Recevoir les notifications push"
                checked={formData.push_notifications}
                onChange={(e) => setFormData({ ...formData, push_notifications: e.target.checked })}
              />
            </div>
          </ui5-object-page-sub-section>
        </ui5-object-page-section>

        {/* Section: Sécurité */}
        <ui5-object-page-section
          title-text="Sécurité"
          id="security"
        >
          <ui5-object-page-sub-section title-text="Changer le mot de passe">
            <div className="profile-form-grid" style={{ maxWidth: '600px' }}>
              <div className="form-group">
                <ui5-label for="old_password" required>Mot de passe actuel</ui5-label>
                <ui5-input
                  id="old_password"
                  type="Password"
                  value={passwordForm.old_password}
                  onInput={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                  required
                ></ui5-input>
              </div>

              <div className="form-group">
                <ui5-label for="new_password" required>Nouveau mot de passe</ui5-label>
                <ui5-input
                  id="new_password"
                  type="Password"
                  value={passwordForm.new_password}
                  onInput={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  required
                ></ui5-input>
              </div>

              <div className="form-group">
                <ui5-label for="new_password_confirm" required>Confirmer le mot de passe</ui5-label>
                <ui5-input
                  id="new_password_confirm"
                  type="Password"
                  value={passwordForm.new_password_confirm}
                  onInput={(e) => setPasswordForm({ ...passwordForm, new_password_confirm: e.target.value })}
                  required
                ></ui5-input>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <ui5-button design="Emphasized" icon="locked" onClick={handleChangePassword} disabled={saving}>
                  {saving ? 'Modification...' : 'Changer le mot de passe'}
                </ui5-button>
              </div>
            </div>
          </ui5-object-page-sub-section>

          <ui5-object-page-sub-section title-text="Authentification 2FA">
            <ui5-card style={{ maxWidth: '600px' }}>
              <ui5-card-header
                slot="header"
                title-text="Authentification à deux facteurs"
                subtitle-text="Sécurisez votre compte"
              ></ui5-card-header>
              <div style={{ padding: '1rem' }}>
                <ui5-text>
                  Ajoutez une couche de sécurité supplémentaire à votre compte avec l'authentification à deux facteurs.
                </ui5-text>
                <br /><br />
                <ui5-button design="Default" disabled>
                  Activer 2FA (Bientôt disponible)
                </ui5-button>
              </div>
            </ui5-card>
          </ui5-object-page-sub-section>
        </ui5-object-page-section>
      </ui5-object-page>
    </div>
  );
};

export default ProfilePage;
