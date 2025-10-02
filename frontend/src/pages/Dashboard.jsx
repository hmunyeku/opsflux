import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  Card,
  CardHeader,
  Title,
  FlexBox,
  Icon,
  Avatar,
  Button,
  Text
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
          secondaryTitle="ERP Modulaire"
          logo={<Icon name="business-suite" />}
          profile={
            <Avatar>
              <Text>{user.username?.charAt(0).toUpperCase() || 'U'}</Text>
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
              id="modules"
              text="Modules"
              icon="grid"
              expanded
            >
              <SideNavigationSubItem
                id="finance"
                text="Finance"
                icon="wallet"
              />
              <SideNavigationSubItem
                id="hr"
                text="RH"
                icon="employee"
              />
              <SideNavigationSubItem
                id="inventory"
                text="Stocks"
                icon="product"
              />
              <SideNavigationSubItem
                id="sales"
                text="CRM"
                icon="sales-order"
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
                      <Text>Modules actifs</Text>
                      <Text style={{ fontWeight: 'bold', color: 'var(--sapPositiveColor)' }}>5</Text>
                    </FlexBox>
                    <FlexBox justifyContent="SpaceBetween">
                      <Text>Utilisateurs</Text>
                      <Text style={{ fontWeight: 'bold', color: 'var(--sapInformationColor)' }}>12</Text>
                    </FlexBox>
                    <FlexBox justifyContent="SpaceBetween">
                      <Text>Tâches</Text>
                      <Text style={{ fontWeight: 'bold', color: 'var(--sapNeutralColor)' }}>24</Text>
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
                  <Text style={{ color: 'var(--sapNeutralTextColor)' }}>
                    Aucune activité récente
                  </Text>
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
                  <Text style={{ marginBottom: '1rem', display: 'block' }}>
                    L'assistant IA est prêt à vous aider
                  </Text>
                  <Button design="Emphasized" icon="conversation">
                    Nouvelle conversation
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
              <div style={{ padding: '1rem' }}>
                <FlexBox wrap="Wrap" style={{ gap: '1.5rem' }}>
                  {[
                    { icon: 'wallet', title: 'Comptabilité', desc: 'Gestion financière' },
                    { icon: 'employee', title: 'RH', desc: 'Ressources humaines' },
                    { icon: 'product', title: 'Stocks', desc: 'Inventaire' },
                    { icon: 'sales-order', title: 'CRM', desc: 'Gestion clients' },
                    { icon: 'factory', title: 'Production', desc: 'Manufacturing' },
                    { icon: 'business-objects-experience', title: 'Analytics', desc: 'Reporting' }
                  ].map((module, index) => (
                    <Card
                      key={index}
                      style={{
                        minWidth: '12rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <div style={{ padding: '1.5rem' }}>
                        <Icon
                          name={module.icon}
                          style={{
                            fontSize: '2.5rem',
                            color: 'var(--sapBrandColor)',
                            marginBottom: '0.75rem'
                          }}
                        />
                        <Title level="H5" style={{ marginBottom: '0.25rem' }}>
                          {module.title}
                        </Title>
                        <Text style={{ fontSize: '0.875rem', color: 'var(--sapNeutralTextColor)', marginBottom: '1rem', display: 'block' }}>
                          {module.desc}
                        </Text>
                        <Button design="Transparent" icon="add">
                          Activer
                        </Button>
                      </div>
                    </Card>
                  ))}
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
