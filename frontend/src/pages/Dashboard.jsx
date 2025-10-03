import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  ShellBar,
  ShellBarItem,
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  Card,
  CardHeader,
  Title,
  FlexBox,
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
  };

  if (!user) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="dashboard-container">
        <ShellBar
          primaryTitle="OpsFlux"
          secondaryTitle="Plateforme Entreprise"
          logo={<Icon name="business-suite" />}
          profile={
            <Avatar initials={user.username?.charAt(0).toUpperCase() || 'U'} />
          }
          onProfileClick={handleProfileClick}
          onLogoClick={() => handleNavigation('dashboard')}
        >
          <ShellBarItem
            icon="log"
            text="Déconnexion"
            onClick={handleLogout}
          />
        </ShellBar>

        <FlexBox style={{ height: 'calc(100vh - 44px)' }}>
          <SideNavigation
            onSelectionChange={(e) => handleNavigation(e.detail.item.id)}
            style={{ width: '15rem', borderRight: '1px solid var(--sapGroup_ContentBorderColor)' }}
          >
            <SideNavigationItem
              id="dashboard"
              text="Tableau de bord"
              icon="home"
              selected={selectedItem === 'dashboard'}
            />

            <SideNavigationItem
              id="settings"
              text="Paramètres"
              icon="action-settings"
              selected={selectedItem === 'settings'}
            />
          </SideNavigation>

          <div style={{ flex: 1, padding: '2rem', overflow: 'auto', backgroundColor: 'var(--sapBackgroundColor)' }}>
            <Title level="H3" style={{ marginBottom: '2rem' }}>
              Bienvenue, {user.username} 👋
            </Title>

            <FlexBox wrap="Wrap" style={{ gap: '1rem', marginBottom: '2rem' }}>
              <Card
                header={
                  <CardHeader
                    titleText="Statistiques"
                    subtitleText="Vue d'ensemble"
                    avatar={<Icon name="chart-table-view" />}
                  />
                }
                style={{ minWidth: '20rem', flex: '1' }}
              >
                <div style={{ padding: '1rem' }}>
                  <FlexBox direction="Column" style={{ gap: '1rem' }}>
                    <FlexBox justifyContent="SpaceBetween">
                      <span>Modules actifs</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--sapPositiveColor)' }}>5</span>
                    </FlexBox>
                    <FlexBox justifyContent="SpaceBetween">
                      <span>Utilisateurs</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--sapInformationColor)' }}>12</span>
                    </FlexBox>
                    <FlexBox justifyContent="SpaceBetween">
                      <span>Tâches</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--sapNeutralColor)' }}>24</span>
                    </FlexBox>
                  </FlexBox>
                </div>
              </Card>

              <Card
                header={
                  <CardHeader
                    titleText="Activité"
                    subtitleText="Dernières 24h"
                    avatar={<Icon name="activities" />}
                  />
                }
                style={{ minWidth: '20rem', flex: '1' }}
              >
                <div style={{ padding: '1rem' }}>
                  <span style={{ color: 'var(--sapNeutralTextColor)' }}>
                    Aucune activité récente
                  </span>
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
                style={{ minWidth: '20rem', flex: '1' }}
              >
                <div style={{ padding: '1rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    L'assistant IA est prêt à vous aider
                  </div>
                  <Button
                    design="Emphasized"
                    icon="conversation"
                    tooltip="Démarrer une conversation"
                  />
                </div>
              </Card>
            </FlexBox>

            <Card
              header={
                <CardHeader
                  titleText="Actions rapides"
                  subtitleText="Accédez aux fonctionnalités principales"
                />
              }
            >
              <div style={{ padding: '1rem' }}>
                <FlexBox wrap="Wrap" style={{ gap: '1rem' }}>
                  <Button
                    design="Emphasized"
                    icon="settings"
                    onClick={() => handleNavigation('settings')}
                    style={{ minWidth: '200px' }}
                  >
                    Gérer les paramètres
                  </Button>
                </FlexBox>
              </div>
            </Card>
          </div>
        </FlexBox>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
