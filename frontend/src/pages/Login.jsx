import React, { useState } from 'react';
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
  CheckBox,
  spacing
} from '@ui5/webcomponents-react';
import { FlexBoxJustifyContent, FlexBoxAlignItems, FlexBoxDirection, TitleLevel, MessageStripDesign, ButtonDesign, InputType } from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';

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
      <FlexBox
        justifyContent={FlexBoxJustifyContent.Center}
        alignItems={FlexBoxAlignItems.Center}
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
            direction={FlexBoxDirection.Column}
            alignItems={FlexBoxAlignItems.Center}
            style={spacing.sapUiContentPadding}
          >
            <Icon
              name="business-suite"
              style={{
                fontSize: '4rem',
                color: 'var(--sapBrandColor)',
                marginBottom: '1rem'
              }}
            />
            <Title level={TitleLevel.H1} style={{ marginBottom: '0.5rem' }}>
              OpsFlux
            </Title>
            <Text style={{ color: 'var(--sapNeutralTextColor)' }}>
              Plateforme Entreprise Intelligente
            </Text>
          </FlexBox>

          {/* Messages */}
          {error && (
            <div style={{ ...spacing.sapUiContentPadding, paddingTop: 0 }}>
              <MessageStrip
                design={MessageStripDesign.Negative}
                onClose={() => setError('')}
              >
                {error}
              </MessageStrip>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <FlexBox
              direction={FlexBoxDirection.Column}
              style={{
                ...spacing.sapUiContentPadding,
                gap: '1rem'
              }}
            >
              {/* Username */}
              <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.25rem' }}>
                <Label required>Nom d'utilisateur</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onInput={handleInputChange}
                  placeholder="Entrez votre identifiant"
                  disabled={loading}
                  required
                  style={{ width: '100%' }}
                />
              </FlexBox>

              {/* Password */}
              <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.25rem' }}>
                <Label required>Mot de passe</Label>
                <Input
                  name="password"
                  type={showPassword ? InputType.Text : InputType.Password}
                  value={formData.password}
                  onInput={handleInputChange}
                  placeholder="Entrez votre mot de passe"
                  disabled={loading}
                  required
                  style={{ width: '100%' }}
                />
              </FlexBox>

              {/* Show Password */}
              <CheckBox
                text="Afficher le mot de passe"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />

              {/* Submit Button */}
              <Button
                design={ButtonDesign.Emphasized}
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {loading && <BusyIndicator active size="Small" style={{ marginRight: '0.5rem' }} />}
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>

              {/* Link */}
              <FlexBox justifyContent={FlexBoxJustifyContent.Center} style={{ marginTop: '0.5rem' }}>
                <Link href="http://72.60.188.156:3002" target="_blank">
                  Découvrir OpsFlux →
                </Link>
              </FlexBox>
            </FlexBox>
          </form>

          {/* Footer */}
          <FlexBox
            justifyContent={FlexBoxJustifyContent.Center}
            style={{
              ...spacing.sapUiContentPadding,
              paddingTop: '1rem',
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
