import React, { useState, useRef } from 'react';

// Import UI5 Web Components
import '@ui5/webcomponents/dist/Title.js';
import '@ui5/webcomponents/dist/Label.js';
import '@ui5/webcomponents/dist/Text.js';
import '@ui5/webcomponents/dist/List.js';
import '@ui5/webcomponents/dist/ListItemStandard.js';
import '@ui5/webcomponents/dist/Toast.js';
import '@ui5/webcomponents/dist/Select.js';
import '@ui5/webcomponents/dist/Option.js';
import '@ui5/webcomponents/dist/Panel.js';
import '@ui5/webcomponents-icons/dist/settings.js';
import '@ui5/webcomponents-icons/dist/puzzle.js';
import '@ui5/webcomponents-icons/dist/database.js';
import '@ui5/webcomponents-icons/dist/shield.js';
import '@ui5/webcomponents-icons/dist/email.js';
import '@ui5/webcomponents-icons/dist/log.js';

import UI5Input from '../components/UI5Input';
import UI5Button from '../components/UI5Button';
import UI5CheckBox from '../components/UI5CheckBox';
import './AppSettings.css';

/**
 * Page AppSettings - Configuration globale de l'application
 * Inspirée du SAP ToolPage pattern
 */
const AppSettings = () => {
  const toastRef = useRef(null);

  const [selectedSection, setSelectedSection] = useState('general');
  const [settings, setSettings] = useState({
    // Général
    appName: 'OpsFlux',
    appDescription: 'Plateforme Entreprise Intelligente',
    enableAnalytics: true,
    enableDebugMode: false,

    // Base de données
    dbBackupEnabled: true,
    dbBackupFrequency: 'daily',
    dbRetentionDays: 30,

    // Email
    emailHost: '',
    emailPort: 587,
    emailUseTLS: true,
    emailFrom: '',

    // Sécurité
    sessionTimeout: 30,
    passwordMinLength: 8,
    enableTwoFactor: false,

    // Modules
    allowModuleInstall: true,
    autoUpdateModules: false,

    // Logs
    logLevel: 'INFO',
    logRetentionDays: 90
  });

  const showToast = (message) => {
    if (toastRef.current) {
      toastRef.current.textContent = message;
      toastRef.current.show();
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Appeler l'API pour sauvegarder les paramètres
      showToast('Paramètres sauvegardés avec succès');
    } catch (error) {
      showToast('Erreur lors de la sauvegarde');
    }
  };

  const sections = [
    { id: 'general', icon: 'settings', title: 'Général' },
    { id: 'database', icon: 'database', title: 'Base de données' },
    { id: 'email', icon: 'email', title: 'Email' },
    { id: 'security', icon: 'shield', title: 'Sécurité' },
    { id: 'modules', icon: 'puzzle', title: 'Modules' },
    { id: 'logs', icon: 'log', title: 'Logs' }
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'general':
        return (
          <div className="settings-content">
            <ui5-title level="H3">Paramètres Généraux</ui5-title>
            <ui5-panel header-text="Configuration de base" style={{ marginTop: '1rem' }}>
              <div className="settings-form">
                <div className="settings-item">
                  <ui5-label>Nom de l'application:</ui5-label>
                  <UI5Input
                    value={settings.appName}
                    onInput={(e) => setSettings({...settings, appName: e.target.value})}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="settings-item">
                  <ui5-label>Description:</ui5-label>
                  <UI5Input
                    value={settings.appDescription}
                    onInput={(e) => setSettings({...settings, appDescription: e.target.value})}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="settings-item">
                  <UI5CheckBox
                    text="Activer les analytics"
                    checked={settings.enableAnalytics}
                    onChange={(e) => setSettings({...settings, enableAnalytics: e.target.checked})}
                  />
                </div>
                <div className="settings-item">
                  <UI5CheckBox
                    text="Mode debug"
                    checked={settings.enableDebugMode}
                    onChange={(e) => setSettings({...settings, enableDebugMode: e.target.checked})}
                  />
                </div>
              </div>
            </ui5-panel>
          </div>
        );

      case 'database':
        return (
          <div className="settings-content">
            <ui5-title level="H3">Paramètres Base de données</ui5-title>
            <ui5-panel header-text="Sauvegarde et rétention" style={{ marginTop: '1rem' }}>
              <div className="settings-form">
                <div className="settings-item">
                  <UI5CheckBox
                    text="Activer les sauvegardes automatiques"
                    checked={settings.dbBackupEnabled}
                    onChange={(e) => setSettings({...settings, dbBackupEnabled: e.target.checked})}
                  />
                </div>
                <div className="settings-item">
                  <ui5-label>Fréquence de sauvegarde:</ui5-label>
                  <ui5-select
                    onChange={(e) => setSettings({...settings, dbBackupFrequency: e.detail.selectedOption.value})}
                  >
                    <ui5-option value="hourly" selected={settings.dbBackupFrequency === 'hourly'}>Toutes les heures</ui5-option>
                    <ui5-option value="daily" selected={settings.dbBackupFrequency === 'daily'}>Quotidien</ui5-option>
                    <ui5-option value="weekly" selected={settings.dbBackupFrequency === 'weekly'}>Hebdomadaire</ui5-option>
                  </ui5-select>
                </div>
                <div className="settings-item">
                  <ui5-label>Rétention (jours):</ui5-label>
                  <UI5Input
                    type="Number"
                    value={settings.dbRetentionDays.toString()}
                    onInput={(e) => setSettings({...settings, dbRetentionDays: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </ui5-panel>
          </div>
        );

      case 'email':
        return (
          <div className="settings-content">
            <ui5-title level="H3">Paramètres Email</ui5-title>
            <ui5-panel header-text="Configuration SMTP" style={{ marginTop: '1rem' }}>
              <div className="settings-form">
                <div className="settings-item">
                  <ui5-label>Serveur SMTP:</ui5-label>
                  <UI5Input
                    value={settings.emailHost}
                    onInput={(e) => setSettings({...settings, emailHost: e.target.value})}
                    placeholder="smtp.example.com"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="settings-item">
                  <ui5-label>Port:</ui5-label>
                  <UI5Input
                    type="Number"
                    value={settings.emailPort.toString()}
                    onInput={(e) => setSettings({...settings, emailPort: parseInt(e.target.value)})}
                  />
                </div>
                <div className="settings-item">
                  <UI5CheckBox
                    text="Utiliser TLS"
                    checked={settings.emailUseTLS}
                    onChange={(e) => setSettings({...settings, emailUseTLS: e.target.checked})}
                  />
                </div>
                <div className="settings-item">
                  <ui5-label>Email expéditeur:</ui5-label>
                  <UI5Input
                    value={settings.emailFrom}
                    onInput={(e) => setSettings({...settings, emailFrom: e.target.value})}
                    placeholder="noreply@opsflux.io"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </ui5-panel>
          </div>
        );

      case 'security':
        return (
          <div className="settings-content">
            <ui5-title level="H3">Paramètres Sécurité</ui5-title>
            <ui5-panel header-text="Authentification et sessions" style={{ marginTop: '1rem' }}>
              <div className="settings-form">
                <div className="settings-item">
                  <ui5-label>Timeout session (minutes):</ui5-label>
                  <UI5Input
                    type="Number"
                    value={settings.sessionTimeout.toString()}
                    onInput={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div className="settings-item">
                  <ui5-label>Longueur minimum mot de passe:</ui5-label>
                  <UI5Input
                    type="Number"
                    value={settings.passwordMinLength.toString()}
                    onInput={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
                  />
                </div>
                <div className="settings-item">
                  <UI5CheckBox
                    text="Authentification 2 facteurs obligatoire"
                    checked={settings.enableTwoFactor}
                    onChange={(e) => setSettings({...settings, enableTwoFactor: e.target.checked})}
                  />
                </div>
              </div>
            </ui5-panel>
          </div>
        );

      case 'modules':
        return (
          <div className="settings-content">
            <ui5-title level="H3">Paramètres Modules</ui5-title>
            <ui5-panel header-text="Gestion des modules" style={{ marginTop: '1rem' }}>
              <div className="settings-form">
                <div className="settings-item">
                  <UI5CheckBox
                    text="Autoriser l'installation de modules"
                    checked={settings.allowModuleInstall}
                    onChange={(e) => setSettings({...settings, allowModuleInstall: e.target.checked})}
                  />
                </div>
                <div className="settings-item">
                  <UI5CheckBox
                    text="Mise à jour automatique des modules"
                    checked={settings.autoUpdateModules}
                    onChange={(e) => setSettings({...settings, autoUpdateModules: e.target.checked})}
                  />
                </div>
              </div>
            </ui5-panel>
          </div>
        );

      case 'logs':
        return (
          <div className="settings-content">
            <ui5-title level="H3">Paramètres Logs</ui5-title>
            <ui5-panel header-text="Configuration des journaux" style={{ marginTop: '1rem' }}>
              <div className="settings-form">
                <div className="settings-item">
                  <ui5-label>Niveau de log:</ui5-label>
                  <ui5-select
                    onChange={(e) => setSettings({...settings, logLevel: e.detail.selectedOption.value})}
                  >
                    <ui5-option value="DEBUG" selected={settings.logLevel === 'DEBUG'}>DEBUG</ui5-option>
                    <ui5-option value="INFO" selected={settings.logLevel === 'INFO'}>INFO</ui5-option>
                    <ui5-option value="WARNING" selected={settings.logLevel === 'WARNING'}>WARNING</ui5-option>
                    <ui5-option value="ERROR" selected={settings.logLevel === 'ERROR'}>ERROR</ui5-option>
                  </ui5-select>
                </div>
                <div className="settings-item">
                  <ui5-label>Rétention logs (jours):</ui5-label>
                  <UI5Input
                    type="Number"
                    value={settings.logRetentionDays.toString()}
                    onInput={(e) => setSettings({...settings, logRetentionDays: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </ui5-panel>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-settings-page">
      <div className="settings-header">
        <ui5-title level="H2">Paramètres de l'Application</ui5-title>
        <UI5Button design="Emphasized" onClick={handleSave}>
          Enregistrer
        </UI5Button>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <ui5-list>
            {sections.map(section => (
              <ui5-list-item-standard
                key={section.id}
                icon={section.icon}
                onClick={() => setSelectedSection(section.id)}
                selected={selectedSection === section.id}
              >
                {section.title}
              </ui5-list-item-standard>
            ))}
          </ui5-list>
        </div>

        <div className="settings-main">
          {renderContent()}
        </div>
      </div>

      <ui5-toast ref={toastRef} placement="BottomCenter"></ui5-toast>
    </div>
  );
};

export default AppSettings;
