import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  Label,
  Input,
  Button,
  MessageStrip,
  BusyIndicator,
  Icon
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const name = e.target.getAttribute('name');
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim()) {
      setError('Le nom d\'utilisateur est requis');
      return;
    }
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/users/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.detail || data.error || 'Identifiants incorrects';
        throw new Error(errorMessage);
      }

      if (data.access) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // Stocker uniquement les données essentielles de l'utilisateur
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
    <ThemeProvider>
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            {/* Header avec logo */}
            <div className="login-header">
              <div className="login-logo-container">
                <Icon name="business-suite" className="login-logo-icon" />
              </div>
              <h1 className="login-title">OpsFlux</h1>
              <p className="login-subtitle">Plateforme Entreprise Intelligente</p>
            </div>

            {/* Formulaire */}
            <div className="login-form">
              {error && (
                <div className="login-error">
                  <MessageStrip
                    design="Negative"
                    onClose={() => setError('')}
                  >
                    {error}
                  </MessageStrip>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="login-form-group">
                  <Label required className="login-label">
                    Nom d'utilisateur
                  </Label>
                  <div className="login-input-wrapper">
                    <Input
                      name="username"
                      value={formData.username}
                      onInput={handleInputChange}
                      placeholder="Entrez votre identifiant"
                      disabled={loading}
                      required
                      className="login-input"
                    />
                  </div>
                </div>

                <div className="login-form-group">
                  <Label required className="login-label">
                    Mot de passe
                  </Label>
                  <div className="login-input-wrapper">
                    <Input
                      name="password"
                      type={showPassword ? 'Text' : 'Password'}
                      value={formData.password}
                      onInput={handleInputChange}
                      placeholder="Entrez votre mot de passe"
                      disabled={loading}
                      required
                      className="login-input"
                    />
                  </div>
                </div>

                <div className="login-checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="showPassword"
                    onChange={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="showPassword" className="login-checkbox-label">
                    Afficher le mot de passe
                  </label>
                </div>

                <Button
                  design="Emphasized"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="login-submit-btn"
                >
                  {loading && <BusyIndicator active size="Small" style={{ marginRight: '0.5rem' }} />}
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>
            </div>

            {/* Footer */}
            <div className="login-footer">
              <a
                href="http://72.60.188.156:3002"
                className="login-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Découvrir OpsFlux →
              </a>
            </div>
          </div>

          <div className="login-copyright">
            © 2025 OpsFlux · Plateforme Entreprise Intelligente
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;
