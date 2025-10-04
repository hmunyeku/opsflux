import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  Label,
  Input,
  Button,
  MessageStrip,
  BusyIndicator,
  Icon,
  FlexBox,
  Title,
  Text,
  Card,
  Link,
  CheckBox
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';

/**
 * Page de connexion OpsFlux
 * Utilise UI5 Web Components v2.15.0 avec React
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
    <ThemeProvider>
      <FlexBox
        justifyContent="Center"
        alignItems="Center"
        style={{
          minHeight: '100vh',
          background: 'var(--sapBackgroundColor)',
          padding: '2rem'
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: '28rem',
            boxShadow: 'var(--sapContent_Shadow2)'
          }}
        >
          {/* Header */}
          <FlexBox
            direction="Column"
            alignItems="Center"
            style={{ padding: '2rem 2rem 1rem 2rem' }}
          >
            <Icon
              name="business-suite"
              style={{
                fontSize: '4rem',
                color: 'var(--sapBrandColor)',
                marginBottom: '1rem'
              }}
            />
            <Title level="H2" style={{ marginBottom: '0.5rem' }}>
              OpsFlux
            </Title>
            <Text style={{ color: 'var(--sapNeutralTextColor)', textAlign: 'center' }}>
              Plateforme Entreprise Intelligente
            </Text>
          </FlexBox>

          {/* Message d'erreur */}
          {error && (
            <div style={{ padding: '0 2rem' }}>
              <MessageStrip
                design="Negative"
                onClose={() => setError('')}
              >
                {error}
              </MessageStrip>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <FlexBox
              direction="Column"
              style={{
                padding: '1.5rem 2rem 2rem 2rem',
                gap: '1rem'
              }}
            >
              {/* Champ Username */}
              <div>
                <Label required showColon>
                  Nom d'utilisateur
                </Label>
                <Input
                  name="username"
                  value={formData.username}
                  onInput={handleInputChange}
                  placeholder="Entrez votre identifiant"
                  disabled={loading}
                  required
                  style={{ width: '100%', marginTop: '0.25rem' }}
                />
              </div>

              {/* Champ Password */}
              <div>
                <Label required showColon>
                  Mot de passe
                </Label>
                <Input
                  name="password"
                  type={showPassword ? "Text" : "Password"}
                  value={formData.password}
                  onInput={handleInputChange}
                  placeholder="Entrez votre mot de passe"
                  disabled={loading}
                  required
                  style={{ width: '100%', marginTop: '0.25rem' }}
                />
              </div>

              {/* Afficher le mot de passe */}
              <CheckBox
                text="Afficher le mot de passe"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />

              {/* Bouton de connexion */}
              <Button
                design="Emphasized"
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {loading && (
                  <BusyIndicator
                    active
                    size="Small"
                    style={{ marginRight: '0.5rem', display: 'inline-block' }}
                  />
                )}
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>

              {/* Lien vers site vitrine */}
              <FlexBox
                justifyContent="Center"
                style={{ marginTop: '0.5rem' }}
              >
                <Link
                  href={process.env.REACT_APP_WEB_URL || 'http://localhost:3002'}
                  target="_blank"
                >
                  Découvrir OpsFlux →
                </Link>
              </FlexBox>
            </FlexBox>
          </form>

          {/* Footer */}
          <FlexBox
            justifyContent="Center"
            style={{
              padding: '1rem 2rem',
              borderTop: '1px solid var(--sapGroup_ContentBorderColor)'
            }}
          >
            <Text style={{ fontSize: '0.875rem', color: 'var(--sapNeutralTextColor)' }}>
              © 2025 OpsFlux · Plateforme Entreprise
            </Text>
          </FlexBox>
        </Card>
      </FlexBox>
    </ThemeProvider>
  );
};

export default Login;
