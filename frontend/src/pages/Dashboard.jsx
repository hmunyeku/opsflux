import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  DynamicPage,
  DynamicPageTitle,
  DynamicPageHeader,
  ObjectPage,
  ObjectPageSection,
  Card,
  CardHeader,
  Button,
  Icon,
  Avatar,
  FlexBox,
  Title,
  Text,
  ObjectStatus,
  Bar,
  Label,
  BusyIndicator,
  List,
  ListItemStandard,
  IllustratedMessage
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData.js';

/**
 * Dashboard OpsFlux
 * Utilise UI5 Web Components v2.15.0 avec React
 * Architecture: ShellBar + SideNavigation + DynamicPage + ObjectPage
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data - À remplacer par appels API
  const [stats] = useState({
    modules: 5,
    users: 12,
    tasks: 24,
    notifications: 8
  });

  const [recentActivities] = useState([]);

  /**
   * Chargement initial et vérification auth
   */
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Erreur parsing user data:', e);
        navigate('/login');
      }
    }

    setLoading(false);

    // Gestionnaires online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  /**
   * Déconnexion
   */
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  /**
   * Navigation
   */
  const handleNavigation = (path) => {
    navigate(path);
  };

  /**
   * Loading state
   */
  if (loading || !user) {
    return (
      <FlexBox
        justifyContent="Center"
        alignItems="Center"
        style={{ height: '100vh' }}
      >
        <BusyIndicator active size="Large" />
      </FlexBox>
    );
  }

  const displayName = user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Utilisateur';
  const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || '') || user.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <ThemeProvider>
      <FlexBox
        direction="Column"
        style={{ height: '100vh', background: 'var(--sapBackgroundColor)' }}
      >
        {/* ShellBar */}
        <ShellBar
          primaryTitle="OpsFlux"
          secondaryTitle="Plateforme Entreprise Intelligente"
          logo={<Icon name="business-suite" />}
          profile={
            <Avatar
              initials={initials}
              size="XS"
              onClick={() => navigate('/profile')}
              style={{ cursor: 'pointer' }}
            />
          }
          onLogoClick={() => navigate('/dashboard')}
          showNotifications
          notificationsCount={stats.notifications.toString()}
          onNotificationsClick={() => console.log('Notifications clicked')}
          showProductSwitch={false}
          showCoPilot={false}
        >
          <Button
            icon="search"
            design="Transparent"
            onClick={() => console.log('Search')}
            tooltip="Rechercher"
          />
          <Button
            icon={isOnline ? 'connected' : 'disconnected'}
            design="Transparent"
            tooltip={isOnline ? 'En ligne' : 'Hors ligne'}
          />
          <Button
            icon="menu2"
            design="Transparent"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            tooltip="Afficher/Masquer menu"
          />
          <Button
            icon="log"
            design="Transparent"
            onClick={handleLogout}
            tooltip="Déconnexion"
          />
        </ShellBar>

        {/* Layout Principal avec SideNavigation */}
        <FlexBox style={{ flex: 1, overflow: 'hidden' }}>
          {/* Side Navigation */}
          {!sidebarCollapsed && (
            <div
              style={{
                width: '16rem',
                borderRight: '1px solid var(--sapGroup_ContentBorderColor)',
                background: 'var(--sapShell_Background)',
                overflowY: 'auto',
                transition: 'width 0.3s ease'
              }}
            >
              <SideNavigation
                onSelectionChange={(e) => {
                  const itemId = e.detail.item.getAttribute('data-id');
                  if (itemId) handleNavigation(itemId);
                }}
              >
                <SideNavigationItem
                  data-id="/dashboard"
                  text="Tableau de bord"
                  icon="home"
                  selected
                />
                <SideNavigationItem
                  data-id="/profile"
                  text="Mon profil"
                  icon="account"
                />
                <SideNavigationItem
                  data-id="/users"
                  text="Utilisateurs"
                  icon="group"
                />
                <SideNavigationItem
                  data-id="/modules"
                  text="Modules"
                  icon="puzzle"
                />
                <SideNavigationItem
                  data-id="/ai"
                  text="Assistant IA"
                  icon="bot"
                />
                <SideNavigationItem
                  data-id="/settings"
                  text="Paramètres"
                  icon="action-settings"
                />
              </SideNavigation>
            </div>
          )}

          {/* DynamicPage - Main Content */}
          <DynamicPage
            headerTitle={
              <DynamicPageTitle
                header={
                  <Title level="H2">
                    Bienvenue, {displayName}
                  </Title>
                }
                subHeader={
                  <Text style={{ color: 'var(--sapNeutralTextColor)' }}>
                    Vue d'ensemble de votre espace de travail
                  </Text>
                }
                actions={
                  <>
                    <Button design="Emphasized" icon="refresh">
                      Actualiser
                    </Button>
                    <Button design="Transparent" icon="action-settings">
                      Paramètres
                    </Button>
                  </>
                }
                navigationActions={
                  <Button
                    design="Transparent"
                    icon="full-screen"
                    onClick={() => console.log('Fullscreen')}
                  />
                }
                breadcrumbs={
                  <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
                    <Icon name="home" style={{ fontSize: '1rem' }} />
                    <Text>/</Text>
                    <Text>Tableau de bord</Text>
                  </FlexBox>
                }
              />
            }
            headerContent={
              <DynamicPageHeader>
                <FlexBox wrap="Wrap" style={{ gap: '2rem', padding: '1rem' }}>
                  {/* KPI Cards */}
                  <FlexBox direction="Column" style={{ minWidth: '10rem' }}>
                    <Label>Modules actifs</Label>
                    <Title level="H3">{stats.modules}</Title>
                    <ObjectStatus state="Success">
                      +2 ce mois
                    </ObjectStatus>
                  </FlexBox>
                  <FlexBox direction="Column" style={{ minWidth: '10rem' }}>
                    <Label>Utilisateurs</Label>
                    <Title level="H3">{stats.users}</Title>
                    <ObjectStatus state="Information">
                      Actifs
                    </ObjectStatus>
                  </FlexBox>
                  <FlexBox direction="Column" style={{ minWidth: '10rem' }}>
                    <Label>Tâches en cours</Label>
                    <Title level="H3">{stats.tasks}</Title>
                    <ObjectStatus state="Warning">
                      À traiter
                    </ObjectStatus>
                  </FlexBox>
                  <FlexBox direction="Column" style={{ minWidth: '10rem' }}>
                    <Label>Statut système</Label>
                    <ObjectStatus
                      state={isOnline ? "Success" : "Error"}
                      icon={isOnline ? 'connected' : 'disconnected'}
                    >
                      {isOnline ? 'En ligne' : 'Hors ligne'}
                    </ObjectStatus>
                  </FlexBox>
                </FlexBox>
              </DynamicPageHeader>
            }
            style={{ flex: 1 }}
          >
            {/* Main Content - ObjectPage Sections */}
            <ObjectPage>
              {/* Section 1: Assistant IA */}
              <ObjectPageSection
                titleText="Assistant IA"
                id="section-ai"
                aria-label="Section Assistant IA"
              >
                <Card
                  header={
                    <CardHeader
                      titleText="Assistant Intelligent"
                      subtitleText="Propulsé par Claude AI"
                      avatar={<Icon name="bot" />}
                      action={
                        <Button design="Transparent" icon="overflow">
                          Actions
                        </Button>
                      }
                    />
                  }
                >
                  <FlexBox
                    direction="Column"
                    style={{ padding: '1.5rem', gap: '1rem' }}
                  >
                    <Text>
                      L'assistant intelligent est prêt à vous aider dans vos tâches quotidiennes.
                      Posez vos questions, demandez des analyses ou obtenez des recommandations.
                    </Text>
                    <FlexBox style={{ gap: '0.5rem' }}>
                      <Button design="Emphasized" icon="conversation">
                        Démarrer une conversation
                      </Button>
                      <Button design="Default" icon="hint">
                        Exemples
                      </Button>
                    </FlexBox>
                  </FlexBox>
                </Card>
              </ObjectPageSection>

              {/* Section 2: Actions Rapides */}
              <ObjectPageSection
                titleText="Actions rapides"
                id="section-actions"
                aria-label="Section Actions rapides"
              >
                <FlexBox wrap="Wrap" style={{ gap: '1rem' }}>
                  <Card style={{ minWidth: '15rem', flex: '1' }}>
                    <FlexBox
                      direction="Column"
                      alignItems="Center"
                      style={{ padding: '2rem', gap: '1rem' }}
                    >
                      <Icon name="add-document" style={{ fontSize: '3rem', color: 'var(--sapBrandColor)' }} />
                      <Title level="H5">Nouveau document</Title>
                      <Button design="Emphasized" icon="add">
                        Créer
                      </Button>
                    </FlexBox>
                  </Card>
                  <Card style={{ minWidth: '15rem', flex: '1' }}>
                    <FlexBox
                      direction="Column"
                      alignItems="Center"
                      style={{ padding: '2rem', gap: '1rem' }}
                    >
                      <Icon name="group" style={{ fontSize: '3rem', color: 'var(--sapBrandColor)' }} />
                      <Title level="H5">Gérer utilisateurs</Title>
                      <Button
                        design="Emphasized"
                        icon="navigation-right-arrow"
                        onClick={() => navigate('/users')}
                      >
                        Accéder
                      </Button>
                    </FlexBox>
                  </Card>
                  <Card style={{ minWidth: '15rem', flex: '1' }}>
                    <FlexBox
                      direction="Column"
                      alignItems="Center"
                      style={{ padding: '2rem', gap: '1rem' }}
                    >
                      <Icon name="puzzle" style={{ fontSize: '3rem', color: 'var(--sapBrandColor)' }} />
                      <Title level="H5">Installer module</Title>
                      <Button
                        design="Emphasized"
                        icon="navigation-right-arrow"
                        onClick={() => navigate('/modules')}
                      >
                        Explorer
                      </Button>
                    </FlexBox>
                  </Card>
                </FlexBox>
              </ObjectPageSection>

              {/* Section 3: Activité Récente */}
              <ObjectPageSection
                titleText="Activité récente"
                id="section-activity"
                aria-label="Section Activité récente"
              >
                <Card
                  header={
                    <CardHeader
                      titleText="Dernières actions"
                      subtitleText="Activité des dernières 24 heures"
                      avatar={<Icon name="activities" />}
                    />
                  }
                >
                  {recentActivities.length === 0 ? (
                    <FlexBox
                      direction="Column"
                      alignItems="Center"
                      justifyContent="Center"
                      style={{ padding: '3rem' }}
                    >
                      <IllustratedMessage
                        name="NoData"
                        titleText="Aucune activité récente"
                        subtitleText="Les actions effectuées apparaîtront ici"
                      />
                    </FlexBox>
                  ) : (
                    <List>
                      {recentActivities.map((activity, index) => (
                        <ListItemStandard
                          key={index}
                          description={activity.description}
                          additionalText={activity.time}
                          icon={activity.icon}
                        >
                          {activity.title}
                        </ListItemStandard>
                      ))}
                    </List>
                  )}
                </Card>
              </ObjectPageSection>
            </ObjectPage>
          </DynamicPage>
        </FlexBox>

        {/* Footer Bar */}
        <Bar
          design="Footer"
          startContent={
            <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
              <Icon name="sys-monitor" />
              <Label>OpsFlux v1.0.0</Label>
            </FlexBox>
          }
          endContent={
            <FlexBox alignItems="Center" style={{ gap: '1rem' }}>
              <Label>
                Statut: {isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}
              </Label>
              <Label>|</Label>
              <Label>Utilisateur: {displayName}</Label>
              <Label>|</Label>
              <Label>© 2025 OpsFlux</Label>
            </FlexBox>
          }
        />
      </FlexBox>
    </ThemeProvider>
  );
};

export default Dashboard;
