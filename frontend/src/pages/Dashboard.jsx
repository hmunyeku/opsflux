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

        <FlexBox style={{ flex: 1 }}>
          <SideNavigation
            onSelectionChange={(e) => handleNavigation(e.detail.item.id)}
            style={{ width: '250px' }}
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

          <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
            <Page
              header={
                <Title level="H3">
                  Bienvenue, {user.username}!
                </Title>
              }
            >
              <FlexBox direction="Column" style={{ gap: '1.5rem' }}>
                <FlexBox wrap="Wrap" style={{ gap: '1.5rem' }}>
                  <Card
                    header={
                      <CardHeader
                        titleText="Statistiques rapides"
                        subtitleText="Vue d'ensemble"
                        avatar={<Icon name="Chart-Tree-Map" />}
                      />
                    }
                    style={{ minWidth: '300px', flex: 1 }}
                  >
                    <FlexBox direction="Column" style={{ padding: '1rem', gap: '0.5rem' }}>
                      <FlexBox justifyContent="SpaceBetween">
                        <span>Modules actifs</span>
                        <strong>5</strong>
                      </FlexBox>
                      <FlexBox justifyContent="SpaceBetween">
                        <span>Utilisateurs</span>
                        <strong>12</strong>
                      </FlexBox>
                      <FlexBox justifyContent="SpaceBetween">
                        <span>Tâches en cours</span>
                        <strong>24</strong>
                      </FlexBox>
                    </FlexBox>
                  </Card>

                  <Card
                    header={
                      <CardHeader
                        titleText="Activité récente"
                        subtitleText="Dernières 24h"
                        avatar={<Icon name="activities" />}
                      />
                    }
                    style={{ minWidth: '300px', flex: 1 }}
                  >
                    <div style={{ padding: '1rem' }}>
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
                    style={{ minWidth: '300px', flex: 1 }}
                  >
                    <div style={{ padding: '1rem' }}>
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
                >
                  <FlexBox wrap="Wrap" style={{ padding: '1rem', gap: '1rem' }}>
                    <FlexBox direction="Column" alignItems="Center" style={{ minWidth: '150px', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                      <Icon name="wallet" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                      <strong>Comptabilité</strong>
                      <span style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Gestion financière</span>
                      <Button design="Transparent">Activer</Button>
                    </FlexBox>
                    <FlexBox direction="Column" alignItems="Center" style={{ minWidth: '150px', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                      <Icon name="employee" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                      <strong>RH</strong>
                      <span style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Ressources Humaines</span>
                      <Button design="Transparent">Activer</Button>
                    </FlexBox>
                    <FlexBox direction="Column" alignItems="Center" style={{ minWidth: '150px', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                      <Icon name="product" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                      <strong>Stocks</strong>
                      <span style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Inventaire</span>
                      <Button design="Transparent">Activer</Button>
                    </FlexBox>
                    <FlexBox direction="Column" alignItems="Center" style={{ minWidth: '150px', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                      <Icon name="sales-order" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                      <strong>CRM</strong>
                      <span style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Gestion clients</span>
                      <Button design="Transparent">Activer</Button>
                    </FlexBox>
                  </FlexBox>
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
