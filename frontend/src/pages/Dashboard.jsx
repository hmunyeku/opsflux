import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  Page,
  Card,
  CardHeader,
  Title,
  FlexBox,
  AnalyticalTable,
  Icon,
  Avatar,
  Button
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
    // Vérifier l'authentification
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
    console.log('Profile clicked');
  };

  const handleNavigation = (itemId) => {
    setSelectedItem(itemId);
    // Navigation logic here
  };

  if (!user) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="dashboard-container">
        <ShellBar
          primaryTitle="OpsFlux"
          secondaryTitle="ERP Modulaire"
          logo={<Icon name="business-suite" />}
          profile={
            <Avatar>
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          }
          onProfileClick={handleProfileClick}
          onLogoClick={() => handleNavigation('dashboard')}
        >
          <Button
            icon="log"
            design="Transparent"
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </ShellBar>

        <FlexBox className="dashboard-layout">
          <div className="sidebar">
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
                id="modules"
                text="Modules"
                icon="grid"
                expanded
              >
                <SideNavigationSubItem
                  id="finance"
                  text="Finance & Comptabilité"
                  icon="wallet"
                />
                <SideNavigationSubItem
                  id="hr"
                  text="Ressources Humaines"
                  icon="employee"
                />
                <SideNavigationSubItem
                  id="inventory"
                  text="Gestion des Stocks"
                  icon="product"
                />
                <SideNavigationSubItem
                  id="sales"
                  text="Ventes & CRM"
                  icon="sales-order"
                />
                <SideNavigationSubItem
                  id="production"
                  text="Production"
                  icon="factory"
                />
              </SideNavigationItem>

              <SideNavigationItem
                id="ai"
                text="Assistant IA"
                icon="bot"
              />

              <SideNavigationItem
                id="reports"
                text="Rapports"
                icon="chart-table-view"
              />

              <SideNavigationItem
                id="settings"
                text="Paramètres"
                icon="action-settings"
              />
            </SideNavigation>
          </div>

          <div className="main-content">
            <Page
              header={
                <Title level="H3">
                  Bienvenue, {user.username}!
                </Title>
              }
            >
              <FlexBox direction="Column" className="dashboard-content">
                <FlexBox wrap="Wrap" className="cards-grid">
                  <Card
                    header={
                      <CardHeader
                        titleText="Statistiques rapides"
                        subtitleText="Vue d'ensemble"
                        avatar={<Icon name="Chart-Tree-Map" />}
                      />
                    }
                    className="dashboard-card"
                  >
                    <div className="card-content">
                      <FlexBox direction="Column">
                        <div className="stat-item">
                          <span className="stat-label">Modules actifs</span>
                          <span className="stat-value">5</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Utilisateurs</span>
                          <span className="stat-value">12</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Tâches en cours</span>
                          <span className="stat-value">24</span>
                        </div>
                      </FlexBox>
                    </div>
                  </Card>

                  <Card
                    header={
                      <CardHeader
                        titleText="Activité récente"
                        subtitleText="Dernières 24h"
                        avatar={<Icon name="activities" />}
                      />
                    }
                    className="dashboard-card"
                  >
                    <div className="card-content">
                      <p>Aucune activité récente</p>
                    </div>
                  </Card>

                  <Card
                    header={
                      <CardHeader
                        titleText="Assistant IA"
                        subtitleText="Powered by Claude"
                        avatar={<Icon name="bot" />}
                      />
                    }
                    className="dashboard-card"
                  >
                    <div className="card-content">
                      <p>Assistant IA prêt à vous aider</p>
                      <Button design="Emphasized" style={{ marginTop: '1rem' }}>
                        Démarrer une conversation
                      </Button>
                    </div>
                  </Card>
                </FlexBox>

                <Card
                  header={
                    <CardHeader
                      titleText="Modules disponibles"
                      subtitleText="Activez les modules dont vous avez besoin"
                    />
                  }
                  className="modules-card"
                  style={{ marginTop: '2rem' }}
                >
                  <div className="modules-grid">
                    <div className="module-item">
                      <Icon name="wallet" className="module-icon" />
                      <h4>Comptabilité</h4>
                      <p>Gestion financière complète</p>
                      <Button design="Transparent">Activer</Button>
                    </div>
                    <div className="module-item">
                      <Icon name="employee" className="module-icon" />
                      <h4>RH</h4>
                      <p>Ressources Humaines</p>
                      <Button design="Transparent">Activer</Button>
                    </div>
                    <div className="module-item">
                      <Icon name="product" className="module-icon" />
                      <h4>Stocks</h4>
                      <p>Gestion d'inventaire</p>
                      <Button design="Transparent">Activer</Button>
                    </div>
                    <div className="module-item">
                      <Icon name="sales-order" className="module-icon" />
                      <h4>CRM</h4>
                      <p>Gestion clients</p>
                      <Button design="Transparent">Activer</Button>
                    </div>
                  </div>
                </Card>
              </FlexBox>
            </Page>
          </div>
        </FlexBox>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
