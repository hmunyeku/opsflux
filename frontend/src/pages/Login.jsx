import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import des Web Components UI5 natifs v2.15.0
import '@ui5/webcomponents/dist/Label.js';
import '@ui5/webcomponents/dist/MessageStrip.js';
import '@ui5/webcomponents/dist/BusyIndicator.js';
import '@ui5/webcomponents/dist/Icon.js';
import '@ui5/webcomponents/dist/Title.js';
import '@ui5/webcomponents/dist/Text.js';
import '@ui5/webcomponents/dist/Card.js';
import '@ui5/webcomponents/dist/Link.js';
import '@ui5/webcomponents-icons/dist/product.js';

// Import des wrappers UI5 pour React
import UI5Input from '../components/UI5Input';
import UI5Button from '../components/UI5Button';
import UI5CheckBox from '../components/UI5CheckBox';

/**
 * Page de connexion OpsFlux
 * Utilise UI5 Web Components natifs v2.15.0
 * Authentification JWT via API backend
 */
const Login = () => {
  const navigate = useNavigate();

  // State
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Rediriger si déjà authentifié
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  /**
   * Gestion des changements dans les inputs
   */
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Effacer l'erreur lors de la saisie
    if (error) setError('');
  };

  /**
   * Validation du formulaire
   */
  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Le nom d\'utilisateur est requis');
      return false;
    }
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  /**
   * Soumission du formulaire de connexion
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/users/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.detail || data.error || 'Identifiants incorrects';
        throw new Error(errorMessage);
      }

      if (data.access && data.refresh) {
        // Stocker les tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // Stocker les données essentielles de l'utilisateur
        const userToStore = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          display_name: data.user.display_name,
          avatar_url: data.user.avatar_url
        };
        localStorage.setItem('user', JSON.stringify(userToStore));

        // Redirection vers le dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--sapBackgroundColor)',
      padding: '2rem'
    }}>
      <ui5-card style={{
        width: '100%',
        maxWidth: '28rem',
        boxShadow: 'var(--sapContent_Shadow2)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem 2rem 1rem 2rem'
        }}>
          <ui5-icon
            name="product"
            style={{
              fontSize: '4rem',
              color: 'var(--sapBrandColor)',
              marginBottom: '1rem'
            }}
          ></ui5-icon>
          <ui5-title level="H2" style={{ marginBottom: '0.5rem' }}>
            OpsFlux
          </ui5-title>
          <ui5-text style={{ color: 'var(--sapNeutralTextColor)', textAlign: 'center' }}>
            Plateforme Entreprise Intelligente
          </ui5-text>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div style={{ padding: '0 2rem' }}>
            <ui5-message-strip
              design="Negative"
              onClose={() => setError('')}
            >
              {error}
            </ui5-message-strip>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 2rem 2rem 2rem',
            gap: '1rem'
          }}>
            {/* Champ Username */}
            <div>
              <ui5-label required show-colon>
                Nom d'utilisateur
              </ui5-label>
              <UI5Input
                name="username"
                value={formData.username}
                disabled={loading}
                onInput={handleInputChange}
                placeholder="Entrez votre identifiant"
                required={true}
                style={{ width: '100%', marginTop: '0.25rem' }}
              />
            </div>

            {/* Champ Password */}
            <div>
              <ui5-label required show-colon>
                Mot de passe
              </ui5-label>
              <UI5Input
                name="password"
                value={formData.password}
                disabled={loading}
                type={showPassword ? "Text" : "Password"}
                onInput={handleInputChange}
                placeholder="Entrez votre mot de passe"
                required={true}
                style={{ width: '100%', marginTop: '0.25rem' }}
              />
            </div>

            {/* Afficher le mot de passe */}
            <UI5CheckBox
              text="Afficher le mot de passe"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />

            {/* Bouton de connexion */}
            <UI5Button
              design="Emphasized"
              disabled={loading}
              onClick={handleSubmit}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading && (
                <ui5-busy-indicator
                  active
                  size="Small"
                  style={{ marginRight: '0.5rem', display: 'inline-block' }}
                ></ui5-busy-indicator>
              )}
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </UI5Button>

            {/* Lien vers site vitrine */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '0.5rem'
            }}>
              <ui5-link
                href={process.env.REACT_APP_WEB_URL || 'http://localhost:3002'}
                target="_blank"
              >
                Découvrir OpsFlux →
              </ui5-link>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem 2rem',
          borderTop: '1px solid var(--sapGroup_ContentBorderColor)'
        }}>
          <ui5-text style={{ fontSize: '0.875rem', color: 'var(--sapNeutralTextColor)' }}>
            © 2025 OpsFlux · Plateforme Entreprise
          </ui5-text>
        </div>
      </ui5-card>
    </div>
  );
};

export default Login;
