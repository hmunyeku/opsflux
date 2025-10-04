import React, { useState } from 'react';

// Import des Web Components UI5 natifs v2.15.0
import '@ui5/webcomponents/dist/Button.js';
import '@ui5/webcomponents/dist/Title.js';
import '@ui5/webcomponents/dist/Text.js';
import '@ui5/webcomponents/dist/Card.js';
import '@ui5/webcomponents/dist/CardHeader.js';
import '@ui5/webcomponents/dist/Input.js';
import '@ui5/webcomponents/dist/Icon.js';
import '@ui5/webcomponents/dist/Tag.js'; // Tag au lieu de Badge
import '@ui5/webcomponents/dist/Label.js';
import '@ui5/webcomponents/dist/MessageStrip.js';
import '@ui5/webcomponents/dist/Bar.js';
import '@ui5/webcomponents-icons/dist/workflow-tasks.js';
import '@ui5/webcomponents-icons/dist/log.js';
import '@ui5/webcomponents-icons/dist/play.js';
import '@ui5/webcomponents-icons/dist/database.js';
import '@ui5/webcomponents-icons/dist/document.js';
import '@ui5/webcomponents-icons/dist/process.js';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const APP_URL = process.env.REACT_APP_FRONTEND_URL || 'http://72.60.188.156:3001';

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    window.location.href = APP_URL;
  };

  if (showLogin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--sapBackgroundColor) 0%, var(--sapShell_Background) 100%)',
        padding: '2rem'
      }}>
        <ui5-card style={{ width: '420px', maxWidth: '100%' }}>
          <ui5-card-header
            slot="header"
            title-text="Connexion à OpsFlux"
            subtitle-text="Gérez vos flux métiers en toute simplicité"
          >
            <ui5-icon slot="avatar" name="workflow-tasks" style={{ fontSize: '2.5rem', color: 'var(--sapBrandColor)' }}></ui5-icon>
          </ui5-card-header>

          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <ui5-message-strip design="Negative" hide-close-button>
                {error}
              </ui5-message-strip>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <ui5-label for="email">Email</ui5-label>
                <ui5-input
                  id="email"
                  type="Email"
                  placeholder="votre.email@entreprise.fr"
                  value={email}
                  onInput={(e) => setEmail(e.target.value)}
                  style={{ width: '100%' }}
                ></ui5-input>
              </div>

              <div>
                <ui5-label for="password">Mot de passe</ui5-label>
                <ui5-input
                  id="password"
                  type="Password"
                  placeholder="••••••••"
                  value={password}
                  onInput={(e) => setPassword(e.target.value)}
                  style={{ width: '100%' }}
                ></ui5-input>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <ui5-button
                  design="Emphasized"
                  icon="log"
                  onClick={handleLogin}
                  style={{ width: '100%' }}
                >
                  Se connecter
                </ui5-button>
                <ui5-button
                  design="Transparent"
                  onClick={() => setShowLogin(false)}
                  style={{ width: '100%' }}
                >
                  Retour à l'accueil
                </ui5-button>
              </div>

              <ui5-text style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--sapNeutralTextColor)' }}>
                Pas encore de compte ? Contactez votre administrateur système.
              </ui5-text>
            </form>
          </div>
        </ui5-card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <ui5-bar design="Header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div slot="startContent" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ui5-icon name="workflow-tasks" style={{ fontSize: '1.5rem', color: 'var(--sapBrandColor)' }}></ui5-icon>
          <ui5-title level="H5" style={{ margin: 0 }}>OpsFlux</ui5-title>
          <ui5-text style={{ color: 'var(--sapNeutralTextColor)', fontSize: '0.875rem' }}>
            Gestion Intelligente des Flux Métiers
          </ui5-text>
        </div>
        <div slot="endContent">
          <ui5-button design="Emphasized" onClick={() => setShowLogin(true)}>
            Se connecter
          </ui5-button>
        </div>
      </ui5-bar>

      {/* Hero Section */}
      <div style={{
        padding: '6rem 2rem',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--sapBackgroundColor) 0%, var(--sapShell_Background) 100%)',
        textAlign: 'center'
      }}>
        <ui5-tag color-scheme="8" style={{ marginBottom: '1rem' }}>
          🔄 Automatisez vos processus métiers
        </ui5-tag>
        <ui5-icon name="workflow-tasks" style={{ fontSize: '6rem', color: 'var(--sapBrandColor)', marginBottom: '2rem' }}></ui5-icon>
        <ui5-title level="H1" style={{ marginBottom: '1rem', fontSize: '3.5rem' }}>
          OpsFlux
        </ui5-title>
        <ui5-title level="H3" style={{ marginBottom: '1rem', fontWeight: 'normal', color: 'var(--sapNeutralTextColor)', maxWidth: '800px' }}>
          Plateforme de gestion et d'automatisation des flux métiers
        </ui5-title>
        <ui5-text style={{ marginBottom: '3rem', fontSize: '1.125rem', maxWidth: '700px', color: 'var(--sapNeutralTextColor)' }}>
          Centralisez, automatisez et optimisez tous vos flux opérationnels : données, documents, workflows et processus métiers
        </ui5-text>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ui5-button design="Emphasized" icon="log" onClick={() => setShowLogin(true)}>
            Accéder à la plateforme
          </ui5-button>
          <ui5-button design="Transparent" icon="play">
            Découvrir les flux
          </ui5-button>
        </div>
      </div>

      {/* Flows Section */}
      <div style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <ui5-tag color-scheme="6" style={{ marginBottom: '1rem' }}>Flux métiers</ui5-tag>
          <ui5-title level="H2" style={{ marginBottom: '1rem' }}>
            Gérez tous vos flux en un seul endroit
          </ui5-title>
          <ui5-text style={{ color: 'var(--sapNeutralTextColor)' }}>
            De la capture à l'archivage, suivez et automatisez l'intégralité de vos processus métiers
          </ui5-text>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          {[
            { icon: 'database', title: 'Flux de données', desc: 'Import, export, transformation et synchronisation de données multi-sources', badge: 'ETL' },
            { icon: 'document', title: 'Flux documentaires', desc: 'Gestion électronique de documents, versioning et workflow de validation', badge: 'GED' },
            { icon: 'process', title: 'Flux opérationnels', desc: 'Orchestration des processus métiers avec règles automatisées', badge: 'BPM' }
          ].map((flow, index) => (
            <ui5-card key={index} style={{ width: '360px', minHeight: '180px' }}>
              <ui5-card-header
                slot="header"
                title-text={flow.title}
                subtitle-text={flow.desc}
              >
                <ui5-icon slot="avatar" name={flow.icon} style={{ fontSize: '2rem', color: 'var(--sapBrandColor)' }}></ui5-icon>
                <ui5-tag slot="action" color-scheme="6">{flow.badge}</ui5-tag>
              </ui5-card-header>
            </ui5-card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <ui5-bar design="Footer" style={{ marginTop: 'auto' }}>
        <div slot="startContent" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ui5-icon name="workflow-tasks"></ui5-icon>
          <ui5-label style={{ fontWeight: 'bold' }}>OpsFlux</ui5-label>
          <ui5-label style={{ color: 'var(--sapNeutralTextColor)' }}>v1.0.0</ui5-label>
        </div>
        <div slot="endContent">
          <ui5-label style={{ color: 'var(--sapNeutralTextColor)', fontSize: '0.875rem' }}>
            © 2025 OpsFlux · 3MH-CCAI
          </ui5-label>
        </div>
      </ui5-bar>
    </div>
  );
}

export default App;
