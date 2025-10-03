import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  FlexBox,
  Card,
  Title,
  Label,
  Input,
  Button,
  MessageStrip,
  BusyIndicator,
  Icon,
  Text
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
      <div className="login-container">
        <Card style={{ width: '28rem', padding: '2rem' }}>
          <FlexBox direction="Column" alignItems="Center" style={{ marginBottom: '2rem' }}>
            <Icon name="business-suite" style={{ fontSize: '3rem', color: 'var(--sapBrandColor)', marginBottom: '1rem' }} />
            <Title level="H2" style={{ marginBottom: '0.5rem' }}>OpsFlux</Title>
            <Text>Connectez-vous à votre espace</Text>
          </FlexBox>

          {error && (
            <MessageStrip
              design="Negative"
              style={{ marginBottom: '1rem' }}
              onClose={() => setError('')}
            >
              {error}
            </MessageStrip>
          )}

          <form onSubmit={handleSubmit}>
            <FlexBox direction="Column" style={{ gap: '1rem' }}>
              <div>
                <Label required showColon>Nom d'utilisateur</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onInput={handleInputChange}
                  placeholder="Entrez votre nom d'utilisateur"
                  disabled={loading}
                  required
                  style={{ width: '100%', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <Label required showColon>Mot de passe</Label>
                <Input
                  name="password"
                  type={showPassword ? 'Text' : 'Password'}
                  value={formData.password}
                  onInput={handleInputChange}
                  placeholder="Entrez votre mot de passe"
                  disabled={loading}
                  required
                  style={{ width: '100%', marginTop: '0.25rem' }}
                />
              </div>

              <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="showPassword"
                  onChange={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                />
                <Label for="showPassword" style={{ cursor: 'pointer' }}>
                  Afficher le mot de passe
                </Label>
              </FlexBox>

              <Button
                design="Emphasized"
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {loading && <BusyIndicator active size="Small" style={{ marginRight: '0.5rem' }} />}
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>

              <FlexBox justifyContent="Center" style={{ marginTop: '1rem' }}>
                <a
                  href="http://72.60.188.156:3002"
                  style={{
                    color: 'var(--sapLinkColor)',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  Découvrir OpsFlux →
                </a>
              </FlexBox>
            </FlexBox>
          </form>
        </Card>

        <Text style={{ marginTop: '2rem', color: 'var(--sapNeutralTextColor)', fontSize: '0.875rem' }}>
          © 2025 OpsFlux · 3MH-CCAI
        </Text>
      </div>
    </ThemeProvider>
  );
};

export default Login;
