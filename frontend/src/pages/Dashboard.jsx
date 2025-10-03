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
  Avatar,
  FlexBox,
  Title,
  Text,
  ObjectStatus,
  spacing
} from '@ui5/webcomponents-react';
import {
  FlexBoxDirection,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
  FlexBoxWrap,
  TitleLevel,
  ButtonDesign,
  ValueState
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';

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
      <FlexBox
        direction={FlexBoxDirection.Column}
        style={{ height: '100vh', background: 'var(--sapBackgroundColor)' }}
      >
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
        <FlexBox style={{ flex: 1, overflow: 'hidden' }}>
          {/* Sidebar Navigation */}
          <div
            style={{
              width: '15rem',
              borderRight: '1px solid var(--sapGroup_ContentBorderColor)',
              background: 'var(--sapShell_Background)',
              overflowY: 'auto'
            }}
          >
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
          <FlexBox
            direction={FlexBoxDirection.Column}
            style={{ flex: 1, overflowY: 'auto', background: 'var(--sapBackgroundColor)' }}
          >
            <div style={spacing.sapUiContentPadding}>
              {/* Welcome Header */}
              <FlexBox
                direction={FlexBoxDirection.Column}
                style={{ marginBottom: '2rem' }}
              >
                <Title level={TitleLevel.H2}>
                  Bienvenue, {displayName}
                </Title>
                <Text style={{ color: 'var(--sapNeutralTextColor)', marginTop: '0.5rem' }}>
                  Voici un aperçu de votre espace de travail
                </Text>
              </FlexBox>

              {/* Statistics Grid */}
              <FlexBox
                wrap={FlexBoxWrap.Wrap}
                style={{ gap: '1rem', marginBottom: '2rem' }}
              >
                {/* Stat Card 1 */}
                <Card
                  style={{ minWidth: '18rem', flex: '1' }}
                  header={
                    <CardHeader
                      titleText="Modules actifs"
                      avatar={<Icon name="puzzle" />}
                      action={
                        <ObjectStatus state={ValueState.Information}>
                          5
                        </ObjectStatus>
                      }
                    />
                  }
                >
                  <div style={spacing.sapUiContentPadding}>
                    <Text>
                      Modules installés et opérationnels
                    </Text>
                  </div>
                </Card>

                {/* Stat Card 2 */}
                <Card
                  style={{ minWidth: '18rem', flex: '1' }}
                  header={
                    <CardHeader
                      titleText="Utilisateurs"
                      avatar={<Icon name="group" />}
                      action={
                        <ObjectStatus state={ValueState.Success}>
                          12
                        </ObjectStatus>
                      }
                    />
                  }
                >
                  <div style={spacing.sapUiContentPadding}>
                    <Text>
                      Utilisateurs actifs dans le système
                    </Text>
                  </div>
                </Card>

                {/* Stat Card 3 */}
                <Card
                  style={{ minWidth: '18rem', flex: '1' }}
                  header={
                    <CardHeader
                      titleText="Tâches"
                      avatar={<Icon name="task" />}
                      action={
                        <ObjectStatus state={ValueState.Warning}>
                          24
                        </ObjectStatus>
                      }
                    />
                  }
                >
                  <div style={spacing.sapUiContentPadding}>
                    <Text>
                      Tâches en attente de traitement
                    </Text>
                  </div>
                </Card>

                {/* Stat Card 4 */}
                <Card
                  style={{ minWidth: '18rem', flex: '1' }}
                  header={
                    <CardHeader
                      titleText="Notifications"
                      avatar={<Icon name="bell" />}
                      action={
                        <ObjectStatus state={ValueState.Information}>
                          8
                        </ObjectStatus>
                      }
                    />
                  }
                >
                  <div style={spacing.sapUiContentPadding}>
                    <Text>
                      Nouvelles notifications
                    </Text>
                  </div>
                </Card>
              </FlexBox>

              {/* AI Assistant Card */}
              <Card
                style={{ marginBottom: '2rem' }}
                header={
                  <CardHeader
                    titleText="Assistant IA"
                    subtitleText="Propulsé par Claude AI"
                    avatar={<Icon name="bot" />}
                  />
                }
              >
                <FlexBox
                  direction={FlexBoxDirection.Column}
                  style={{ ...spacing.sapUiContentPadding, gap: '1rem' }}
                >
                  <Text>
                    L'assistant intelligent est prêt à vous aider dans vos tâches quotidiennes.
                    Posez vos questions, demandez des analyses ou obtenez des recommandations.
                  </Text>
                  <Button design={ButtonDesign.Emphasized} icon="conversation">
                    Démarrer une conversation
                  </Button>
                </FlexBox>
              </Card>

              {/* Quick Actions */}
              <Card
                style={{ marginBottom: '2rem' }}
                header={
                  <CardHeader
                    titleText="Actions rapides"
                    subtitleText="Accédez rapidement aux fonctionnalités principales"
                    avatar={<Icon name="action" />}
                  />
                }
              >
                <FlexBox
                  wrap={FlexBoxWrap.Wrap}
                  style={{ ...spacing.sapUiContentPadding, gap: '0.5rem' }}
                >
                  <Button design={ButtonDesign.Emphasized} icon="add">
                    Nouveau document
                  </Button>
                  <Button
                    design={ButtonDesign.Emphasized}
                    icon="group"
                    onClick={() => handleNavigation('users')}
                  >
                    Gérer utilisateurs
                  </Button>
                  <Button
                    design={ButtonDesign.Emphasized}
                    icon="puzzle"
                    onClick={() => handleNavigation('modules')}
                  >
                    Installer module
                  </Button>
                  <Button
                    design={ButtonDesign.Emphasized}
                    icon="action-settings"
                    onClick={() => handleNavigation('settings')}
                  >
                    Configuration
                  </Button>
                </FlexBox>
              </Card>

              {/* Recent Activity */}
              <Card
                header={
                  <CardHeader
                    titleText="Activité récente"
                    subtitleText="Dernières actions effectuées"
                    avatar={<Icon name="activities" />}
                  />
                }
              >
                <FlexBox
                  direction={FlexBoxDirection.Column}
                  alignItems={FlexBoxAlignItems.Center}
                  justifyContent={FlexBoxJustifyContent.Center}
                  style={{ ...spacing.sapUiContentPadding, minHeight: '10rem' }}
                >
                  <Icon name="inbox" style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }} />
                  <Text style={{ color: 'var(--sapNeutralTextColor)' }}>
                    Aucune activité récente
                  </Text>
                </FlexBox>
              </Card>
            </div>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </ThemeProvider>
  );
};

export default Dashboard;
