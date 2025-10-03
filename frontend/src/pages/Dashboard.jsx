import React, { useEffect, useState, useRef } from 'react';
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
  Popover,
  List,
  StandardListItem,
  Input,
  Badge,
  Breadcrumbs,
  BreadcrumbsItem,
  BusyIndicator,
  Bar,
  Label
} from '@ui5/webcomponents-react';
import {
  FlexBoxDirection,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
  FlexBoxWrap,
  TitleLevel,
  ButtonDesign,
  ValueState,
  BarDesign,
  PopoverPlacementType,
  AvatarSize
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for Popovers
  const profilePopoverRef = useRef(null);
  const notificationPopoverRef = useRef(null);
  const searchPopoverRef = useRef(null);
  const profileButtonRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const searchButtonRef = useRef(null);

  // Mock notifications
  const [notifications] = useState([
    { id: 1, title: 'Nouvelle tâche assignée', description: 'Vous avez été assigné à une nouvelle tâche', time: 'Il y a 5 min', unread: true },
    { id: 2, title: 'Mise à jour système', description: 'Le système a été mis à jour avec succès', time: 'Il y a 1h', unread: true },
    { id: 3, title: 'Rapport disponible', description: 'Votre rapport mensuel est prêt', time: 'Il y a 2h', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

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

    // Online/Offline status listener
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

  const toggleProfilePopover = (e) => {
    if (profilePopoverRef.current) {
      profilePopoverRef.current.showAt(e.detail.targetRef || profileButtonRef.current);
    }
  };

  const toggleNotificationPopover = (e) => {
    if (notificationPopoverRef.current) {
      notificationPopoverRef.current.showAt(e.detail.targetRef || notificationButtonRef.current);
    }
  };

  const toggleSearchPopover = (e) => {
    if (searchPopoverRef.current) {
      searchPopoverRef.current.showAt(e.detail.targetRef || searchButtonRef.current);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search logic here
  };

  if (!user) {
    return (
      <FlexBox
        justifyContent={FlexBoxJustifyContent.Center}
        alignItems={FlexBoxAlignItems.Center}
        style={{ height: '100vh' }}
      >
        <BusyIndicator active size="Large" />
      </FlexBox>
    );
  }

  const displayName = user.display_name || user.username || 'Utilisateur';
  const initials = user.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <ThemeProvider>
      <FlexBox
        direction={FlexBoxDirection.Column}
        style={{ height: '100vh', background: 'var(--sapBackgroundColor)' }}
      >
        {/* ShellBar Header with all features */}
        <ShellBar
          primaryTitle="OpsFlux"
          secondaryTitle="Plateforme Entreprise"
          logo={<Icon name="business-suite" />}
          profile={
            <div ref={profileButtonRef}>
              <Avatar
                initials={initials}
                size={AvatarSize.XS}
                style={{ cursor: 'pointer' }}
              />
            </div>
          }
          onProfileClick={toggleProfilePopover}
          onLogoClick={() => handleNavigation('dashboard')}
          showProductSwitch={false}
          showCoPilot={false}
        >
          {/* Search Button */}
          <ShellBarItem
            icon="search"
            text="Rechercher"
            ref={searchButtonRef}
            onClick={toggleSearchPopover}
          />

          {/* Notifications with Badge */}
          <div ref={notificationButtonRef} style={{ position: 'relative' }}>
            <ShellBarItem
              icon="bell"
              text="Notifications"
              onClick={toggleNotificationPopover}
            />
            {unreadCount > 0 && (
              <Badge
                colorScheme="8"
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  pointerEvents: 'none'
                }}
              >
                {unreadCount}
              </Badge>
            )}
          </div>

          {/* Online/Offline Status */}
          <ShellBarItem
            icon={isOnline ? 'connected' : 'disconnected'}
            text={isOnline ? 'En ligne' : 'Hors ligne'}
          />

          {/* Sidebar Toggle */}
          <ShellBarItem
            icon={sidebarCollapsed ? 'open-command-field' : 'close-command-field'}
            text={sidebarCollapsed ? 'Afficher menu' : 'Masquer menu'}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </ShellBar>

        {/* Profile Popover */}
        <Popover
          ref={profilePopoverRef}
          placementType={PopoverPlacementType.Bottom}
          headerText={displayName}
        >
          <List>
            <StandardListItem
              icon="account"
              onClick={() => {
                profilePopoverRef.current?.close();
                handleProfileClick();
              }}
            >
              Mon profil
            </StandardListItem>
            <StandardListItem
              icon="action-settings"
              onClick={() => {
                profilePopoverRef.current?.close();
                handleNavigation('settings');
              }}
            >
              Paramètres
            </StandardListItem>
            <StandardListItem
              type="Active"
              icon="log"
              onClick={() => {
                profilePopoverRef.current?.close();
                handleLogout();
              }}
            >
              Déconnexion
            </StandardListItem>
          </List>
        </Popover>

        {/* Notification Popover */}
        <Popover
          ref={notificationPopoverRef}
          placementType={PopoverPlacementType.Bottom}
          headerText="Notifications"
          style={{ width: '20rem' }}
        >
          <List>
            {notifications.map(notif => (
              <StandardListItem
                key={notif.id}
                description={notif.time}
                additionalText={notif.description}
                icon={notif.unread ? 'message-warning' : 'message-information'}
                onClick={() => notificationPopoverRef.current?.close()}
              >
                {notif.title}
              </StandardListItem>
            ))}
          </List>
        </Popover>

        {/* Search Popover */}
        <Popover
          ref={searchPopoverRef}
          placementType={PopoverPlacementType.Bottom}
          headerText="Recherche globale"
          style={{ width: '20rem' }}
        >
          <div style={{ padding: '1rem' }}>
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onInput={handleSearch}
              icon={<Icon name="search" />}
              style={{ width: '100%' }}
            />
          </div>
        </Popover>

        {/* Layout Principal */}
        <FlexBox style={{ flex: 1, overflow: 'hidden' }}>
          {/* Sidebar Navigation - Collapsible */}
          {!sidebarCollapsed && (
            <div
              style={{
                width: '15rem',
                borderRight: '1px solid var(--sapGroup_ContentBorderColor)',
                background: 'var(--sapShell_Background)',
                overflowY: 'auto',
                transition: 'width 0.3s ease'
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
          )}

          {/* Content Area */}
          <FlexBox
            direction={FlexBoxDirection.Column}
            style={{ flex: 1, background: 'var(--sapBackgroundColor)' }}
          >
            {/* Breadcrumbs */}
            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--sapGroup_ContentBorderColor)' }}>
              <Breadcrumbs>
                <BreadcrumbsItem href="#" onClick={(e) => { e.preventDefault(); handleNavigation('dashboard'); }}>
                  Accueil
                </BreadcrumbsItem>
                <BreadcrumbsItem>
                  Tableau de bord
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>

            {/* Main Content Area with scroll */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {/* Loading Indicator */}
              {loading && (
                <FlexBox
                  justifyContent={FlexBoxJustifyContent.Center}
                  style={{ padding: '2rem' }}
                >
                  <BusyIndicator active size="Medium" text="Chargement en cours..." />
                </FlexBox>
              )}

              {/* Welcome Header */}
              {!loading && (
                <>
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
                  <div style={{ padding: '1rem' }}>
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
                  <div style={{ padding: '1rem' }}>
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
                  <div style={{ padding: '1rem' }}>
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
                  <div style={{ padding: '1rem' }}>
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
                  style={{ padding: '1rem', gap: '1rem' }}
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
                  style={{ padding: '1rem', gap: '0.5rem' }}
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
                  style={{ padding: '1rem', minHeight: '10rem' }}
                >
                  <Icon name="inbox" style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }} />
                  <Text style={{ color: 'var(--sapNeutralTextColor)' }}>
                    Aucune activité récente
                  </Text>
                </FlexBox>
              </Card>
                </>
              )}
            </div>

            {/* Footer Toolbar */}
            <Bar
              design={BarDesign.Footer}
              startContent={
                <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                  <Icon name="sys-monitor" />
                  <Label>OpsFlux v1.0.0</Label>
                </FlexBox>
              }
              endContent={
                <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '1rem' }}>
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
        </FlexBox>
      </FlexBox>
    </ThemeProvider>
  );
};

export default Dashboard;
