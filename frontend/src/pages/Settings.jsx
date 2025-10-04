/**
 * Settings.jsx - Page de paramètres utilisateur avec UI5 Web Components
 * Utilise ui5-tabcontainer pour organiser les différentes sections
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

// Imports UI5 Web Components
import '@ui5/webcomponents/dist/TabContainer.js';
import '@ui5/webcomponents/dist/Tab.js';
import '@ui5/webcomponents/dist/Label.js';
import '@ui5/webcomponents/dist/Input.js';
import '@ui5/webcomponents/dist/Select.js';
import '@ui5/webcomponents/dist/Option.js';
import '@ui5/webcomponents/dist/Switch.js';
import '@ui5/webcomponents/dist/Button.js';
import '@ui5/webcomponents/dist/Title.js';
import '@ui5/webcomponents/dist/MessageStrip.js';
import '@ui5/webcomponents-icons/dist/action-settings.js';
import '@ui5/webcomponents-icons/dist/palette.js';
import '@ui5/webcomponents-icons/dist/bell.js';
import '@ui5/webcomponents-icons/dist/navigation-left-arrow.js';

function Settings() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Charger le profil et les préférences
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');

      // Charger le profil
      const profileResponse = await fetch('http://localhost:8000/api/users/users/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
      }

      // Charger les préférences UI
      const preferencesResponse = await fetch('http://localhost:8000/api/users/ui-preferences/my_preferences/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (preferencesResponse.ok) {
        const preferencesData = await preferencesResponse.json();
        setPreferences(preferencesData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://localhost:8000/api/users/ui-preferences/update_my_preferences/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        setSaveMessage('Préférences enregistrées avec succès');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveMessage('Erreur lors de la sauvegarde');
    }
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://localhost:8000/api/users/users/update_profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          mobile: profile.mobile,
          language: profile.language,
          timezone: profile.timezone,
          theme: profile.theme,
          email_notifications: profile.email_notifications,
          push_notifications: profile.push_notifications
        })
      });

      if (response.ok) {
        setSaveMessage('Profil enregistré avec succès');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      setSaveMessage('Erreur lors de la sauvegarde du profil');
    }
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="settings-loading">Chargement...</div>;
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <ui5-button
          icon="navigation-left-arrow"
          design="Transparent"
          onClick={() => navigate('/dashboard')}
        >
          Retour
        </ui5-button>
        <ui5-title level="H2">Paramètres</ui5-title>
      </div>

      {saveMessage && (
        <ui5-message-strip design="Positive" style={{ marginBottom: '1rem' }}>
          {saveMessage}
        </ui5-message-strip>
      )}

      <ui5-tabcontainer className="settings-tabs">
        {/* Onglet Profil */}
        <ui5-tab text="Profil" icon="action-settings" selected>
          <div className="settings-section">
            <ui5-title level="H3">Informations personnelles</ui5-title>

            <div className="settings-field">
              <ui5-label for="firstName">Prénom</ui5-label>
              <ui5-input
                id="firstName"
                value={profile?.first_name || ''}
                onInput={(e) => handleProfileChange('first_name', e.target.value)}
              />
            </div>

            <div className="settings-field">
              <ui5-label for="lastName">Nom</ui5-label>
              <ui5-input
                id="lastName"
                value={profile?.last_name || ''}
                onInput={(e) => handleProfileChange('last_name', e.target.value)}
              />
            </div>

            <div className="settings-field">
              <ui5-label for="email">Email</ui5-label>
              <ui5-input
                id="email"
                type="Email"
                value={profile?.email || ''}
                onInput={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>

            <div className="settings-field">
              <ui5-label for="phone">Téléphone</ui5-label>
              <ui5-input
                id="phone"
                type="Tel"
                value={profile?.phone || ''}
                onInput={(e) => handleProfileChange('phone', e.target.value)}
              />
            </div>

            <div className="settings-field">
              <ui5-label for="mobile">Mobile</ui5-label>
              <ui5-input
                id="mobile"
                type="Tel"
                value={profile?.mobile || ''}
                onInput={(e) => handleProfileChange('mobile', e.target.value)}
              />
            </div>

            <ui5-button design="Emphasized" onClick={saveProfile}>
              Enregistrer le profil
            </ui5-button>
          </div>
        </ui5-tab>

        {/* Onglet Apparence */}
        <ui5-tab text="Apparence" icon="palette">
          <div className="settings-section">
            <ui5-title level="H3">Préférences d'affichage</ui5-title>

            <div className="settings-field">
              <ui5-label for="theme">Thème</ui5-label>
              <ui5-select
                id="theme"
                value={profile?.theme || 'auto'}
                onChange={(e) => handleProfileChange('theme', e.detail.selectedOption.value)}
              >
                <ui5-option value="auto">Automatique</ui5-option>
                <ui5-option value="light">Clair</ui5-option>
                <ui5-option value="dark">Sombre</ui5-option>
              </ui5-select>
            </div>

            <div className="settings-field">
              <ui5-label for="language">Langue</ui5-label>
              <ui5-select
                id="language"
                value={profile?.language || 'fr'}
                onChange={(e) => handleProfileChange('language', e.detail.selectedOption.value)}
              >
                <ui5-option value="fr">Français</ui5-option>
                <ui5-option value="en">English</ui5-option>
                <ui5-option value="de">Deutsch</ui5-option>
              </ui5-select>
            </div>

            <div className="settings-field">
              <ui5-switch
                checked={preferences?.compact_mode || false}
                onChange={(e) => handlePreferenceChange('compact_mode', e.target.checked)}
                text-on="Activé"
                text-off="Désactivé"
              >
                Mode compact
              </ui5-switch>
            </div>

            <div className="settings-field">
              <ui5-switch
                checked={preferences?.sidebar_collapsed || false}
                onChange={(e) => handlePreferenceChange('sidebar_collapsed', e.target.checked)}
                text-on="Réduite"
                text-off="Étendue"
              >
                Barre latérale réduite par défaut
              </ui5-switch>
            </div>

            <div className="settings-field">
              <ui5-switch
                checked={preferences?.show_tooltips !== false}
                onChange={(e) => handlePreferenceChange('show_tooltips', e.target.checked)}
                text-on="Activées"
                text-off="Désactivées"
              >
                Afficher les infobulles
              </ui5-switch>
            </div>

            <ui5-button design="Emphasized" onClick={savePreferences}>
              Enregistrer les préférences
            </ui5-button>
          </div>
        </ui5-tab>

        {/* Onglet Interface */}
        <ui5-tab text="Interface" icon="action-settings">
          <div className="settings-section">
            <ui5-title level="H3">Éléments d'interface</ui5-title>

            <div className="settings-field">
              <ui5-switch
                checked={preferences?.show_search !== false}
                onChange={(e) => handlePreferenceChange('show_search', e.target.checked)}
                text-on="Visible"
                text-off="Masquée"
              >
                Barre de recherche
              </ui5-switch>
            </div>

            <div className="settings-field">
              <ui5-switch
                checked={preferences?.show_notifications !== false}
                onChange={(e) => handlePreferenceChange('show_notifications', e.target.checked)}
                text-on="Visibles"
                text-off="Masquées"
              >
                Notifications
              </ui5-switch>
            </div>

            <div className="settings-field">
              <ui5-switch
                checked={preferences?.show_help !== false}
                onChange={(e) => handlePreferenceChange('show_help', e.target.checked)}
                text-on="Visible"
                text-off="Masqué"
              >
                Bouton d'aide
              </ui5-switch>
            </div>

            <div className="settings-field">
              <ui5-label for="pageSize">Éléments par page</ui5-label>
              <ui5-select
                id="pageSize"
                value={String(preferences?.default_page_size || 20)}
                onChange={(e) => handlePreferenceChange('default_page_size', parseInt(e.detail.selectedOption.value))}
              >
                <ui5-option value="10">10</ui5-option>
                <ui5-option value="20">20</ui5-option>
                <ui5-option value="50">50</ui5-option>
                <ui5-option value="100">100</ui5-option>
              </ui5-select>
            </div>

            <ui5-button design="Emphasized" onClick={savePreferences}>
              Enregistrer les préférences
            </ui5-button>
          </div>
        </ui5-tab>

        {/* Onglet Notifications */}
        <ui5-tab text="Notifications" icon="bell">
          <div className="settings-section">
            <ui5-title level="H3">Préférences de notifications</ui5-title>

            <div className="settings-field">
              <ui5-switch
                checked={profile?.email_notifications !== false}
                onChange={(e) => handleProfileChange('email_notifications', e.target.checked)}
                text-on="Activées"
                text-off="Désactivées"
              >
                Notifications par email
              </ui5-switch>
            </div>

            <div className="settings-field">
              <ui5-switch
                checked={profile?.push_notifications !== false}
                onChange={(e) => handleProfileChange('push_notifications', e.target.checked)}
                text-on="Activées"
                text-off="Désactivées"
              >
                Notifications push
              </ui5-switch>
            </div>

            <ui5-button design="Emphasized" onClick={saveProfile}>
              Enregistrer les notifications
            </ui5-button>
          </div>
        </ui5-tab>
      </ui5-tabcontainer>
    </div>
  );
}

export default Settings;
