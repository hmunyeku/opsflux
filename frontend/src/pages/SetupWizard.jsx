/**
 * SetupWizard.jsx - Assistant de configuration initiale avec UI5 Wizard
 * Utilisé pour le premier démarrage du logiciel
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SetupWizard.css';

// Imports UI5 Web Components
import '@ui5/webcomponents-fiori/dist/Wizard.js';
import '@ui5/webcomponents-fiori/dist/WizardStep.js';
import '@ui5/webcomponents/dist/Button.js';
import '@ui5/webcomponents/dist/Input.js';
import '@ui5/webcomponents/dist/Label.js';
import '@ui5/webcomponents/dist/Select.js';
import '@ui5/webcomponents/dist/Option.js';
import '@ui5/webcomponents/dist/Title.js';
import '@ui5/webcomponents/dist/MessageStrip.js';
import '@ui5/webcomponents/dist/Switch.js';
import '@ui5/webcomponents-icons/dist/accept.js';
import '@ui5/webcomponents-icons/dist/employee.js';
import '@ui5/webcomponents-icons/dist/settings.js';

function SetupWizard() {
  const navigate = useNavigate();
  const wizardRef = useRef(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    // Étape 1: Informations utilisateur
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Étape 2: Préférences
    language: 'fr',
    timezone: 'UTC',
    theme: 'auto',

    // Étape 3: Configuration UI
    showSearch: true,
    showNotifications: true,
    showHelp: true,
    compactMode: false,
    sidebarCollapsed: false,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Charger le profil existant si disponible
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/users/users/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          language: data.language || 'fr',
          timezone: data.timezone || 'UTC',
          theme: data.theme || 'auto',
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Veuillez entrer une adresse email valide');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const goToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(1);
      // Active l'étape 2
      const wizard = wizardRef.current;
      if (wizard) {
        const step2 = document.getElementById('wizard-step-2');
        if (step2) {
          step2.removeAttribute('disabled');
          step2.setAttribute('selected', '');
        }
      }
    }
  };

  const goToStep3 = () => {
    setCurrentStep(2);
    const wizard = wizardRef.current;
    if (wizard) {
      const step3 = document.getElementById('wizard-step-3');
      if (step3) {
        step3.removeAttribute('disabled');
        step3.setAttribute('selected', '');
      }
    }
  };

  const completeSetup = async () => {
    try {
      const token = localStorage.getItem('access_token');

      // Mise à jour du profil
      await fetch('http://localhost:8000/api/users/users/update_profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          language: formData.language,
          timezone: formData.timezone,
          theme: formData.theme,
        })
      });

      // Mise à jour des préférences UI
      await fetch('http://localhost:8000/api/users/ui-preferences/update_my_preferences/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          show_search: formData.showSearch,
          show_notifications: formData.showNotifications,
          show_help: formData.showHelp,
          compact_mode: formData.compactMode,
          sidebar_collapsed: formData.sidebarCollapsed,
        })
      });

      // Rediriger vers le dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la configuration:', error);
      setErrorMessage('Erreur lors de la sauvegarde de la configuration');
    }
  };

  return (
    <div className="setup-wizard-container">
      <div className="setup-wizard-content">
        <ui5-title level="H1" className="setup-title">
          Configuration initiale d'OpsFlux
        </ui5-title>

        {errorMessage && (
          <ui5-message-strip design="Negative" style={{ marginBottom: '1rem' }}>
            {errorMessage}
          </ui5-message-strip>
        )}

        <ui5-wizard ref={wizardRef}>
          {/* Étape 1: Informations utilisateur */}
          <ui5-wizard-step
            id="wizard-step-1"
            icon="employee"
            title-text="Informations personnelles"
            selected
          >
            <div className="wizard-step-content">
              <ui5-title level="H3">Vos informations personnelles</ui5-title>
              <p className="step-description">
                Commençons par configurer votre profil utilisateur.
              </p>

              <div className="wizard-field">
                <ui5-label for="firstName" required>Prénom *</ui5-label>
                <ui5-input
                  id="firstName"
                  value={formData.firstName}
                  onInput={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>

              <div className="wizard-field">
                <ui5-label for="lastName" required>Nom *</ui5-label>
                <ui5-input
                  id="lastName"
                  value={formData.lastName}
                  onInput={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>

              <div className="wizard-field">
                <ui5-label for="email" required>Email *</ui5-label>
                <ui5-input
                  id="email"
                  type="Email"
                  value={formData.email}
                  onInput={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="wizard-field">
                <ui5-label for="phone">Téléphone</ui5-label>
                <ui5-input
                  id="phone"
                  type="Tel"
                  value={formData.phone}
                  onInput={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="wizard-step-actions">
                <ui5-button design="Emphasized" onClick={goToStep2}>
                  Suivant
                </ui5-button>
              </div>
            </div>
          </ui5-wizard-step>

          {/* Étape 2: Préférences */}
          <ui5-wizard-step
            id="wizard-step-2"
            icon="settings"
            title-text="Préférences"
            disabled
          >
            <div className="wizard-step-content">
              <ui5-title level="H3">Préférences régionales</ui5-title>
              <p className="step-description">
                Configurez vos préférences de langue et d'affichage.
              </p>

              <div className="wizard-field">
                <ui5-label for="language">Langue</ui5-label>
                <ui5-select
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.detail.selectedOption.value)}
                >
                  <ui5-option value="fr">Français</ui5-option>
                  <ui5-option value="en">English</ui5-option>
                  <ui5-option value="de">Deutsch</ui5-option>
                  <ui5-option value="es">Español</ui5-option>
                </ui5-select>
              </div>

              <div className="wizard-field">
                <ui5-label for="timezone">Fuseau horaire</ui5-label>
                <ui5-select
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.detail.selectedOption.value)}
                >
                  <ui5-option value="UTC">UTC</ui5-option>
                  <ui5-option value="Europe/Paris">Europe/Paris</ui5-option>
                  <ui5-option value="America/New_York">America/New York</ui5-option>
                  <ui5-option value="Asia/Tokyo">Asia/Tokyo</ui5-option>
                </ui5-select>
              </div>

              <div className="wizard-field">
                <ui5-label for="theme">Thème</ui5-label>
                <ui5-select
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.detail.selectedOption.value)}
                >
                  <ui5-option value="auto">Automatique</ui5-option>
                  <ui5-option value="light">Clair</ui5-option>
                  <ui5-option value="dark">Sombre</ui5-option>
                </ui5-select>
              </div>

              <div className="wizard-step-actions">
                <ui5-button design="Transparent" onClick={() => setCurrentStep(0)}>
                  Retour
                </ui5-button>
                <ui5-button design="Emphasized" onClick={goToStep3}>
                  Suivant
                </ui5-button>
              </div>
            </div>
          </ui5-wizard-step>

          {/* Étape 3: Configuration UI */}
          <ui5-wizard-step
            id="wizard-step-3"
            icon="accept"
            title-text="Interface"
            disabled
          >
            <div className="wizard-step-content">
              <ui5-title level="H3">Configuration de l'interface</ui5-title>
              <p className="step-description">
                Personnalisez l'affichage de votre interface.
              </p>

              <div className="wizard-field">
                <ui5-switch
                  checked={formData.showSearch}
                  onChange={(e) => handleInputChange('showSearch', e.target.checked)}
                  text-on="Visible"
                  text-off="Masquée"
                >
                  Barre de recherche
                </ui5-switch>
              </div>

              <div className="wizard-field">
                <ui5-switch
                  checked={formData.showNotifications}
                  onChange={(e) => handleInputChange('showNotifications', e.target.checked)}
                  text-on="Visibles"
                  text-off="Masquées"
                >
                  Notifications
                </ui5-switch>
              </div>

              <div className="wizard-field">
                <ui5-switch
                  checked={formData.showHelp}
                  onChange={(e) => handleInputChange('showHelp', e.target.checked)}
                  text-on="Visible"
                  text-off="Masqué"
                >
                  Bouton d'aide
                </ui5-switch>
              </div>

              <div className="wizard-field">
                <ui5-switch
                  checked={formData.compactMode}
                  onChange={(e) => handleInputChange('compactMode', e.target.checked)}
                  text-on="Activé"
                  text-off="Désactivé"
                >
                  Mode compact
                </ui5-switch>
              </div>

              <div className="wizard-field">
                <ui5-switch
                  checked={formData.sidebarCollapsed}
                  onChange={(e) => handleInputChange('sidebarCollapsed', e.target.checked)}
                  text-on="Réduite"
                  text-off="Étendue"
                >
                  Barre latérale réduite par défaut
                </ui5-switch>
              </div>

              <div className="wizard-step-actions">
                <ui5-button design="Transparent" onClick={() => setCurrentStep(1)}>
                  Retour
                </ui5-button>
                <ui5-button design="Emphasized" onClick={completeSetup}>
                  Terminer la configuration
                </ui5-button>
              </div>
            </div>
          </ui5-wizard-step>
        </ui5-wizard>
      </div>
    </div>
  );
}

export default SetupWizard;
