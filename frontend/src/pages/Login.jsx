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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login/`, {
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
        throw new Error(data.detail || data.error || 'Identifiants incorrects');
      }

      // Stocker les tokens
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Rediriger vers le dashboard
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
        <FlexBox
          direction="Column"
          justifyContent="Center"
          alignItems="Center"
          style={{ maxWidth: '400px', width: '100%' }}
        >
          <Card>
            <FlexBox direction="Column" alignItems="Center" style={{ marginBottom: '2rem' }}>
              <Icon name="business-suite" style={{ fontSize: '4rem', marginBottom: '1rem' }} />
              <Title level="H2">OpsFlux</Title>
              <span>ERP Modulaire Intelligent</span>
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
              <div className="form-field">
                <Label required>Nom d'utilisateur</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onInput={handleInputChange}
                  placeholder="Entrez votre nom d'utilisateur"
                  icon={<Icon name="employee" />}
                  disabled={loading}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-field">
                <Label required>Mot de passe</Label>
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onInput={handleInputChange}
                  placeholder="Entrez votre mot de passe"
                  icon={<Icon name="locked" />}
                  disabled={loading}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <FlexBox justifyContent="SpaceBetween" alignItems="Center" style={{ marginBottom: '1rem' }}>
                <Label>
                  <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
                  {' '}Afficher le mot de passe
                </Label>
              </FlexBox>

              <Button
                design="Emphasized"
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>

              <FlexBox justifyContent="Center" style={{ marginTop: '1rem' }}>
                <a href="http://72.60.188.156:3002" style={{ textDecoration: 'none' }}>
                  Pas encore de compte ? En savoir plus
                </a>
              </FlexBox>
            </form>
          </Card>

          <FlexBox justifyContent="Center" style={{ marginTop: '2rem', color: '#666' }}>
            <span>&copy; 2025 OpsFlux - ERP Modulaire | 3MH-CCAI</span>
          </FlexBox>
        </FlexBox>
      </div>
    </ThemeProvider>
  );
};

export default Login;
