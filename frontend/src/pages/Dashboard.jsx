import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  ShellBar,
  ShellBarItem,
  SideNavigation,
  SideNavigationItem,
  Card,
  CardHeader,
  Button,
  Icon,
  Avatar
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleNavigation = (itemId) => {
    setSelectedItem(itemId);
    if (itemId === 'profile') {
      navigate('/profile');
    }
  };

  if (!user) {
    return null;
  }

  const displayName = user.display_name || user.username || 'Utilisateur';
  const initials = user.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <ThemeProvider>
      <div className="dashboard-container">
        {/* ShellBar Header */}
        <ShellBar
          primaryTitle="OpsFlux"
          secondaryTitle="Plateforme Entreprise"
          logo={<Icon name="business-suite" />}
          profile={<Avatar initials={initials} />}
          onProfileClick={handleProfileClick}
          onLogoClick={() => handleNavigation('dashboard')}
        >
          <ShellBarItem
            icon="home"
            text="Accueil"
            onClick={() => handleNavigation('dashboard')}
          />
          <ShellBarItem
            icon="customer"
            text="Profil"
            onClick={handleProfileClick}
          />
          <ShellBarItem
            icon="log"
            text="Déconnexion"
            onClick={handleLogout}
          />
        </ShellBar>

        {/* Layout Principal */}
        <div className="dashboard-layout">
          {/* Sidebar Navigation */}
          <div className="dashboard-sidebar">
            <SideNavigation
              onSelectionChange={(e) => handleNavigation(e.detail.item.id)}
            >
              <SideNavigationItem
                id="dashboard"
                text="Tableau de bord"
                icon="home"
                selected={selectedItem === 'dashboard'}
              />
              <SideNavigationItem
                id="profile"
                text="Mon profil"
                icon="account"
                selected={selectedItem === 'profile'}
              />
              <SideNavigationItem
                id="users"
                text="Utilisateurs"
                icon="group"
                selected={selectedItem === 'users'}
              />
              <SideNavigationItem
                id="modules"
                text="Modules"
                icon="puzzle"
                selected={selectedItem === 'modules'}
              />
              <SideNavigationItem
                id="settings"
                text="Paramètres"
                icon="action-settings"
                selected={selectedItem === 'settings'}
              />
            </SideNavigation>
          </div>

          {/* Content Area */}
          <div className="dashboard-content">
            <div className="dashboard-content-inner">
              {/* Welcome Section */}
              <div className="dashboard-welcome">
                <h1 className="dashboard-welcome-title">
                  Bienvenue, {displayName}
                </h1>
                <p className="dashboard-welcome-subtitle">
                  Voici un aperçu de votre espace de travail
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="dashboard-stats-grid">
                <Card className="dashboard-stat-card">
                  <div className="dashboard-stat-content">
                    <div className="dashboard-stat-info">
                      <p className="dashboard-stat-label">Modules actifs</p>
                      <h2 className="dashboard-stat-value primary">5</h2>
                    </div>
                    <Icon name="puzzle" className="dashboard-stat-icon" />
                  </div>
                </Card>

                <Card className="dashboard-stat-card">
                  <div className="dashboard-stat-content">
                    <div className="dashboard-stat-info">
                      <p className="dashboard-stat-label">Utilisateurs</p>
                      <h2 className="dashboard-stat-value success">12</h2>
                    </div>
                    <Icon name="group" className="dashboard-stat-icon" />
                  </div>
                </Card>

                <Card className="dashboard-stat-card">
                  <div className="dashboard-stat-content">
                    <div className="dashboard-stat-info">
                      <p className="dashboard-stat-label">Tâches</p>
                      <h2 className="dashboard-stat-value warning">24</h2>
                    </div>
                    <Icon name="task" className="dashboard-stat-icon" />
                  </div>
                </Card>

                <Card className="dashboard-stat-card">
                  <div className="dashboard-stat-content">
                    <div className="dashboard-stat-info">
                      <p className="dashboard-stat-label">Notifications</p>
                      <h2 className="dashboard-stat-value info">8</h2>
                    </div>
                    <Icon name="bell" className="dashboard-stat-icon" />
                  </div>
                </Card>
              </div>

              {/* AI Assistant Card */}
              <Card className="dashboard-ai-card dashboard-actions">
                <div className="dashboard-ai-content">
                  <Icon
                    name="bot"
                    style={{ fontSize: '3rem', marginBottom: '1rem' }}
                  />
                  <h3 className="dashboard-ai-title">Assistant IA</h3>
                  <p className="dashboard-ai-subtitle">
                    Propulsé par Claude AI, l'assistant intelligent est prêt à
                    vous aider dans vos tâches quotidiennes.
                  </p>
                  <Button
                    icon="conversation"
                    className="dashboard-ai-btn"
                  >
                    Démarrer une conversation
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card
                className="dashboard-actions"
                header={
                  <CardHeader
                    titleText="Actions rapides"
                    subtitleText="Accédez rapidement aux fonctionnalités principales"
                    avatar={<Icon name="action" />}
                  />
                }
              >
                <div className="dashboard-actions-grid">
                  <Button
                    design="Emphasized"
                    icon="add"
                    className="dashboard-action-btn"
                  >
                    Nouveau document
                  </Button>
                  <Button
                    design="Emphasized"
                    icon="group"
                    className="dashboard-action-btn"
                    onClick={() => handleNavigation('users')}
                  >
                    Gérer utilisateurs
                  </Button>
                  <Button
                    design="Emphasized"
                    icon="puzzle"
                    className="dashboard-action-btn"
                    onClick={() => handleNavigation('modules')}
                  >
                    Installer module
                  </Button>
                  <Button
                    design="Emphasized"
                    icon="action-settings"
                    className="dashboard-action-btn"
                    onClick={() => handleNavigation('settings')}
                  >
                    Configuration
                  </Button>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card
                className="dashboard-activity"
                header={
                  <CardHeader
                    titleText="Activité récente"
                    subtitleText="Dernières actions effectuées"
                    avatar={<Icon name="activities" />}
                  />
                }
              >
                <div className="dashboard-activity-list">
                  <div className="dashboard-activity-empty">
                    <Icon name="inbox" className="dashboard-activity-empty-icon" />
                    <p>Aucune activité récente</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
