import React, { useEffect, useState } from 'react';
import '@ui5/webcomponents-fiori/dist/UserSettingsView.js';
import '@ui5/webcomponents-fiori/dist/UserSettingsItem.js';
import '@ui5/webcomponents-fiori/dist/UserSettingsDialog.js';
import '@ui5/webcomponents/dist/Icon.js';
import '@ui5/webcomponents/dist/Title.js';
import '@ui5/webcomponents/dist/Label.js';
import '@ui5/webcomponents/dist/Button.js';
import '@ui5/webcomponents/dist/Panel.js';
import '@ui5/webcomponents/dist/ComboBox.js';
import '@ui5/webcomponents/dist/ComboBoxItem.js';
import '@ui5/webcomponents/dist/RadioButton.js';
import '@ui5/webcomponents/dist/Text.js';
import '@ui5/webcomponents/dist/CheckBox.js';
import '@ui5/webcomponents/dist/Toast.js';
import '@ui5/webcomponents/dist/List.js';
import '@ui5/webcomponents/dist/ListItemStandard.js';
import '@ui5/webcomponents/dist/Input.js';
import '@ui5/webcomponents-icons/dist/user-settings.js';
import '@ui5/webcomponents-icons/dist/person-placeholder.js';
import '@ui5/webcomponents-icons/dist/palette.js';
import '@ui5/webcomponents-icons/dist/bell.js';
import '@ui5/webcomponents-icons/dist/reset.js';
import '@ui5/webcomponents-icons/dist/locked.js';
import './UserSettingsDialog.css';

/**
 * Composant UserSettingsDialog
 * Dialog modal pour les paramètres utilisateur (accessible depuis ShellBar)
 * Suit le pattern SAP Fiori UserSettings
 */
const UserSettingsDialog = ({ open, onClose, user }) => {
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

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initialiser les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        mobile: user.mobile || '',
        language: user.language || 'fr',
        timezone: user.timezone || 'UTC',
        theme: user.theme || 'auto',
        email_notifications: user.email_notifications !== undefined ? user.email_notifications : true,
        push_notifications: user.push_notifications !== undefined ? user.push_notifications : true
      });
    }
  }, [user]);

  // Gestionnaire d'événement pour fermeture dialog
  useEffect(() => {
    const dialogElement = document.getElementById('userSettingsDialog');
    if (!dialogElement) return;

    const handleBeforeClose = (event) => {
      if (!confirm('Êtes-vous sûr de vouloir fermer les paramètres ? Les modifications non sauvegardées seront perdues.')) {
        event.preventDefault();
      }
    };

    const handleClose = () => {
      if (onClose) onClose();
    };

    dialogElement.addEventListener('before-close', handleBeforeClose);
    dialogElement.addEventListener('close', handleClose);

    return () => {
      dialogElement.removeEventListener('before-close', handleBeforeClose);
      dialogElement.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  const handleSaveProfile = async () => {
    setSaving(true);
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

      // Mettre à jour localStorage
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        display_name: userData.display_name,
        avatar_url: userData.avatar_url
      }));

      showToast('Profil mis à jour avec succès');
    } catch (error) {
      showToast('Erreur : ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      showToast('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      showToast('Le mot de passe doit contenir au moins 8 caractères');
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
      showToast('Mot de passe modifié avec succès');
    } catch (error) {
      showToast('Erreur : ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    const toast = document.getElementById('userSettingsToast');
    if (toast) {
      toast.open = true;
    }
  };

  const displayName = user?.display_name || user?.username || 'Utilisateur';

  return (
    <>
      <ui5-user-settings-dialog
        id="userSettingsDialog"
        open={open}
        header-text="Paramètres"
        show-search-field
      >
        {/* User Account */}
        <ui5-user-settings-item
          icon="user-settings"
          text="Mon Compte"
          tooltip="Mon Compte"
          header-text="Informations du Compte"
        >
          <ui5-user-settings-view slot="pages">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <ui5-icon name="person-placeholder" style={{ width: '4rem', height: '4rem' }}></ui5-icon>
              <ui5-title level="H3" size="H3" style={{ display: 'inline', marginLeft: '1rem' }}>
                {displayName}
              </ui5-title>
            </div>

            <div className="user-settings-container">
              <div className="user-settings-item">
                <ui5-label>Nom d'utilisateur :</ui5-label>
                <ui5-text>{user?.username}</ui5-text>
              </div>
              <div className="user-settings-item">
                <ui5-label>Email :</ui5-label>
                <ui5-text>{formData.email}</ui5-text>
              </div>
              <div className="user-settings-item">
                <ui5-label>Prénom :</ui5-label>
                <ui5-input
                  value={formData.first_name}
                  onInput={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="user-settings-item">
                <ui5-label>Nom :</ui5-label>
                <ui5-input
                  value={formData.last_name}
                  onInput={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
              <div className="user-settings-item">
                <ui5-label>Téléphone :</ui5-label>
                <ui5-input
                  value={formData.phone}
                  onInput={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="user-settings-item">
                <ui5-label>Mobile :</ui5-label>
                <ui5-input
                  value={formData.mobile}
                  onInput={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <ui5-button
                design="Emphasized"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </ui5-button>
            </div>
          </ui5-user-settings-view>
        </ui5-user-settings-item>

        {/* Appearance */}
        <ui5-user-settings-item
          icon="palette"
          text="Apparence"
          tooltip="Apparence"
          header-text="Thème et Affichage"
        >
          <ui5-user-settings-view text="Thème">
            <ui5-list separators="Inner">
              <ui5-li
                icon="palette"
                onClick={() => setFormData({ ...formData, theme: 'auto' })}
                selected={formData.theme === 'auto'}
              >
                Automatique (Système)
              </ui5-li>
              <ui5-li
                icon="palette"
                onClick={() => setFormData({ ...formData, theme: 'light' })}
                selected={formData.theme === 'light'}
              >
                Clair (SAP Morning Horizon)
              </ui5-li>
              <ui5-li
                icon="palette"
                onClick={() => setFormData({ ...formData, theme: 'dark' })}
                selected={formData.theme === 'dark'}
              >
                Sombre (SAP Evening Horizon)
              </ui5-li>
            </ui5-list>
            <ui5-button
              design="Emphasized"
              onClick={handleSaveProfile}
              disabled={saving}
              style={{ marginTop: '1rem' }}
            >
              Appliquer le thème
            </ui5-button>
          </ui5-user-settings-view>
        </ui5-user-settings-item>

        {/* Language & Region */}
        <ui5-user-settings-item
          text="Langue et Région"
          tooltip="Langue et Région"
          header-text="Paramètres Régionaux"
        >
          <ui5-user-settings-view slot="pages">
            <div className="user-settings-container">
              <div className="user-settings-item-wide">
                <ui5-label>Langue :</ui5-label>
                <ui5-combobox
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <ui5-cb-item text="Français" value="fr" selected={formData.language === 'fr'}></ui5-cb-item>
                  <ui5-cb-item text="English" value="en" selected={formData.language === 'en'}></ui5-cb-item>
                  <ui5-cb-item text="Español" value="es" selected={formData.language === 'es'}></ui5-cb-item>
                </ui5-combobox>
              </div>
              <div className="user-settings-item-wide">
                <ui5-label>Fuseau horaire :</ui5-label>
                <ui5-combobox
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                >
                  <ui5-cb-item text="UTC" value="UTC" selected={formData.timezone === 'UTC'}></ui5-cb-item>
                  <ui5-cb-item text="Europe/Paris" value="Europe/Paris" selected={formData.timezone === 'Europe/Paris'}></ui5-cb-item>
                  <ui5-cb-item text="America/New_York" value="America/New_York" selected={formData.timezone === 'America/New_York'}></ui5-cb-item>
                  <ui5-cb-item text="Asia/Tokyo" value="Asia/Tokyo" selected={formData.timezone === 'Asia/Tokyo'}></ui5-cb-item>
                </ui5-combobox>
              </div>
            </div>

            <ui5-panel fixed style={{ marginTop: '2rem' }}>
              <ui5-label>
                Après avoir enregistré vos paramètres, certaines modifications peuvent nécessiter un rechargement de la page.
              </ui5-label>
            </ui5-panel>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <ui5-button
                design="Emphasized"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                Enregistrer
              </ui5-button>
            </div>
          </ui5-user-settings-view>
        </ui5-user-settings-item>

        {/* Notifications */}
        <ui5-user-settings-item
          icon="bell"
          text="Notifications"
          tooltip="Notifications"
          header-text="Préférences de Notifications"
        >
          <ui5-user-settings-view slot="pages">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem' }}>
              <ui5-checkbox
                text="Recevoir les notifications par email"
                checked={formData.email_notifications}
                onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })}
              />
              <ui5-checkbox
                text="Recevoir les notifications push dans le navigateur"
                checked={formData.push_notifications}
                onChange={(e) => setFormData({ ...formData, push_notifications: e.target.checked })}
              />
            </div>

            <ui5-panel fixed style={{ margin: '1rem' }}>
              <ui5-label>
                Les notifications vous permettent de rester informé des événements importants dans OpsFlux.
              </ui5-label>
            </ui5-panel>

            <div style={{ marginTop: '2rem', textAlign: 'right', marginRight: '1rem' }}>
              <ui5-button
                design="Emphasized"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                Enregistrer
              </ui5-button>
            </div>
          </ui5-user-settings-view>
        </ui5-user-settings-item>

        {/* Security (Fixed Item) */}
        <ui5-user-settings-item
          slot="fixedItems"
          icon="locked"
          text="Sécurité"
          tooltip="Sécurité"
          header-text="Paramètres de Sécurité"
        >
          <ui5-user-settings-view text="Changer le mot de passe">
            <div className="user-settings-container" style={{ maxWidth: '600px' }}>
              <div className="user-settings-item-wide">
                <ui5-label required>Mot de passe actuel :</ui5-label>
                <ui5-input
                  type="Password"
                  value={passwordForm.old_password}
                  onInput={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                  required
                />
              </div>
              <div className="user-settings-item-wide">
                <ui5-label required>Nouveau mot de passe :</ui5-label>
                <ui5-input
                  type="Password"
                  value={passwordForm.new_password}
                  onInput={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  required
                />
              </div>
              <div className="user-settings-item-wide">
                <ui5-label required>Confirmer le mot de passe :</ui5-label>
                <ui5-input
                  type="Password"
                  value={passwordForm.new_password_confirm}
                  onInput={(e) => setPasswordForm({ ...passwordForm, new_password_confirm: e.target.value })}
                  required
                />
              </div>
            </div>

            <ui5-panel fixed style={{ marginTop: '2rem' }}>
              <ui5-label>
                Le mot de passe doit contenir au moins 8 caractères.
              </ui5-label>
            </ui5-panel>

            <div style={{ marginTop: '2rem' }}>
              <ui5-button
                design="Emphasized"
                icon="locked"
                onClick={handleChangePassword}
                disabled={saving}
              >
                {saving ? 'Modification...' : 'Changer le mot de passe'}
              </ui5-button>
            </div>
          </ui5-user-settings-view>

          <ui5-user-settings-view text="Authentification 2FA">
            <ui5-text>Ajoutez une couche de sécurité supplémentaire à votre compte.</ui5-text>
            <ui5-button design="Default" icon="add" disabled style={{ marginTop: '1rem' }}>
              Activer 2FA (Bientôt disponible)
            </ui5-button>
            <ui5-panel fixed style={{ marginTop: '1rem' }}>
              <ui5-label>
                L'authentification à deux facteurs protège votre compte avec un code de vérification en plus de votre mot de passe.
              </ui5-label>
            </ui5-panel>
          </ui5-user-settings-view>
        </ui5-user-settings-item>

        {/* Reset Settings (Fixed Item) */}
        <ui5-user-settings-item
          slot="fixedItems"
          icon="reset"
          text="Réinitialiser"
          tooltip="Réinitialiser les paramètres"
          header-text="Réinitialisation"
        >
          <ui5-user-settings-view text="Réinitialiser les préférences">
            <ui5-text>
              Cette action réinitialisera toutes vos préférences personnelles (thème, langue, notifications, etc.).
            </ui5-text>
            <ui5-button
              design="Negative"
              onClick={() => showToast('Fonctionnalité de réinitialisation bientôt disponible')}
              style={{ marginTop: '1rem' }}
            >
              Réinitialiser les préférences
            </ui5-button>
          </ui5-user-settings-view>
        </ui5-user-settings-item>
      </ui5-user-settings-dialog>

      {/* Toast pour les messages */}
      <ui5-toast id="userSettingsToast" design="Emphasized">
        {toastMessage}
      </ui5-toast>
    </>
  );
};

export default UserSettingsDialog;
