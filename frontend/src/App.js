import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState('Vérification...');
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    // Vérifier la connexion à l'API
    const apiUrl = process.env.REACT_APP_API_URL || 'http://72.60.188.156:8000';

    fetch(`${apiUrl}/api/core/health/`)
      .then(response => response.json())
      .then(data => {
        setApiStatus('✅ Connecté');
        setApiData(data);
      })
      .catch(error => {
        setApiStatus('❌ Déconnecté');
        console.error('Erreur API:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <h1>🚀 OpsFlux</h1>
          <p className="subtitle">ERP Modulaire Intelligent</p>
        </div>

        <div className="status-card">
          <h2>État du Système</h2>
          <div className="status-item">
            <span className="status-label">Frontend:</span>
            <span className="status-value">✅ Actif</span>
          </div>
          <div className="status-item">
            <span className="status-label">API Backend:</span>
            <span className="status-value">{apiStatus}</span>
          </div>
          {apiData && (
            <>
              <div className="status-item">
                <span className="status-label">Version:</span>
                <span className="status-value">{apiData.version || '1.0.0'}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Django:</span>
                <span className="status-value">{apiData.django_version || 'N/A'}</span>
              </div>
            </>
          )}
        </div>

        <div className="info-card">
          <h3>🎉 Déploiement Réussi !</h3>
          <p>Votre instance OpsFlux est opérationnelle.</p>
          
          <div className="links">
            <a
              href={`${process.env.REACT_APP_API_URL || 'http://72.60.188.156:8000'}/api/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-button"
            >
              📚 Documentation API
            </a>
            <a
              href={`${process.env.REACT_APP_API_URL || 'http://72.60.188.156:8000'}/admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-button"
            >
              👤 Admin Django
            </a>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔐</span>
            <h4>Authentification</h4>
            <p>JWT, SSO, LDAP</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <h4>IA Intégrée</h4>
            <p>Claude Code natif</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h4>Multi-tenant</h4>
            <p>Gestion avancée</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔄</span>
            <h4>Modulaire</h4>
            <p>Architecture extensible</p>
          </div>
        </div>

        <footer className="App-footer">
          <p>3MH-CCAI | Version 1.0.0</p>
        </footer>
      </header>
    </div>
  );
}

export default App;
