import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Import des Web Components natifs UI5 v2.15.0
import '@ui5/webcomponents/dist/Avatar.js';
import '@ui5/webcomponents/dist/Button.js';
import '@ui5/webcomponents/dist/Title.js';
import '@ui5/webcomponents/dist/Text.js';
import '@ui5/webcomponents/dist/Card.js';
import '@ui5/webcomponents/dist/CardHeader.js';
import '@ui5/webcomponents/dist/BusyIndicator.js';
import '@ui5/webcomponents/dist/Tag.js';

import '@ui5/webcomponents-fiori/dist/ShellBar.js';
import '@ui5/webcomponents-fiori/dist/ShellBarBranding.js';
import '@ui5/webcomponents-fiori/dist/ShellBarItem.js';
import '@ui5/webcomponents-fiori/dist/NavigationLayout.js';
import '@ui5/webcomponents-fiori/dist/SideNavigation.js';
import '@ui5/webcomponents-fiori/dist/SideNavigationItem.js';
import '@ui5/webcomponents-fiori/dist/SideNavigationSubItem.js';
import '@ui5/webcomponents-fiori/dist/UserMenu.js';
import '@ui5/webcomponents-fiori/dist/UserMenuAccount.js';
import '@ui5/webcomponents-fiori/dist/UserMenuItem.js';

import '@ui5/webcomponents-icons/dist/home.js';
import '@ui5/webcomponents-icons/dist/account.js';
import '@ui5/webcomponents-icons/dist/group.js';
import '@ui5/webcomponents-icons/dist/puzzle.js';
import '@ui5/webcomponents-icons/dist/bot.js';
import '@ui5/webcomponents-icons/dist/action-settings.js';
import '@ui5/webcomponents-icons/dist/menu2.js';
import '@ui5/webcomponents-icons/dist/sys-help.js';
import '@ui5/webcomponents-icons/dist/log.js';
import '@ui5/webcomponents-icons/dist/business-suite.js';

/**
 * Dashboard OpsFlux
 * Utilise UI5 Web Components natifs v2.15.0
 * Architecture: NavigationLayout + ShellBar + SideNavigation
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const navigationLayoutRef = useRef(null);
  const shellbarRef = useRef(null);
  const userMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        return;
      }
    }

    setLoading(false);
  }, [navigate]);

  /**
   * Configuration des event listeners après le montage
   */
  useEffect(() => {
    if (!user) return;

    const navigationLayout = navigationLayoutRef.current;
    const shellbar = shellbarRef.current;
    const userMenu = userMenuRef.current;
    const menuButton = menuButtonRef.current;

    // Gestion du bouton menu
    const handleMenuClick = () => {
      if (navigationLayout) {
        navigationLayout.mode = navigationLayout.isSideCollapsed() ? 'Expanded' : 'Collapsed';
      }
    };

    // Gestion du profil
    const handleProfileClick = (event) => {
      if (userMenu) {
        userMenu.opener = event.detail.targetRef;
        userMenu.open = true;
      }
    };

    // Gestion de la déconnexion
    const handleSignOut = (event) => {
      event.preventDefault();
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      navigate('/login');
    };

    // Gestion des items du menu utilisateur
    const handleUserMenuItem = (event) => {
      const itemId = event.detail.item?.getAttribute('data-id');
      if (itemId === 'settings') {
        navigate('/settings');
      }
    };

    // Gestion de la navigation
    const handleNavigation = (event) => {
      const item = event.detail.item;
      const path = item?.getAttribute('data-path');
      if (path) {
        navigate(path);
      }
    };

    if (menuButton) {
      menuButton.addEventListener('click', handleMenuClick);
    }
    if (shellbar) {
      shellbar.addEventListener('ui5-profile-click', handleProfileClick);
    }
    if (userMenu) {
      userMenu.addEventListener('sign-out-click', handleSignOut);
      userMenu.addEventListener('item-click', handleUserMenuItem);
    }
    if (navigationLayout) {
      const sideNav = navigationLayout.querySelector('ui5-side-navigation');
      if (sideNav) {
        sideNav.addEventListener('selection-change', handleNavigation);
      }
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener('click', handleMenuClick);
      }
      if (shellbar) {
        shellbar.removeEventListener('ui5-profile-click', handleProfileClick);
      }
      if (userMenu) {
        userMenu.removeEventListener('sign-out-click', handleSignOut);
        userMenu.removeEventListener('item-click', handleUserMenuItem);
      }
      if (navigationLayout) {
        const sideNav = navigationLayout.querySelector('ui5-side-navigation');
        if (sideNav) {
          sideNav.removeEventListener('selection-change', handleNavigation);
        }
      }
    };
  }, [user, navigate]);

  if (loading || !user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--sapBackgroundColor)'
      }}>
        <ui5-busy-indicator active size="Large"></ui5-busy-indicator>
      </div>
    );
  }

  const displayName = user.display_name ||
    `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
    user.username || 'Utilisateur';

  const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || '') ||
    user.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div style={{ height: '100vh', background: 'var(--sapBackgroundColor)' }}>
      <ui5-navigation-layout ref={navigationLayoutRef}>
        {/* ShellBar */}
        <ui5-shellbar
          ref={shellbarRef}
          slot="header"
          notifications-count="0"
          show-notifications={false}
          show-product-switch={false}
        >
          <ui5-shellbar-branding slot="branding">
            OpsFlux
            <ui5-icon slot="logo" name="business-suite"></ui5-icon>
          </ui5-shellbar-branding>

          <ui5-button
            ref={menuButtonRef}
            icon="menu2"
            slot="startButton"
            tooltip="Afficher/Masquer menu"
          ></ui5-button>

          <ui5-tag design="Set2" color-scheme="7" slot="content">
            v1.0.0
          </ui5-tag>

          <ui5-shellbar-item
            icon="sys-help"
            text="Aide"
            slot="content"
          ></ui5-shellbar-item>

          <ui5-avatar
            slot="profile"
            initials={initials}
          ></ui5-avatar>
        </ui5-shellbar>

        {/* User Menu */}
        <ui5-user-menu
          ref={userMenuRef}
          show-manage-account={false}
          show-other-accounts={false}
        >
          <ui5-user-menu-account
            slot="accounts"
            title-text={displayName}
            subtitle-text={user.email || ''}
            description={user.role || 'Utilisateur'}
            avatar-initials={initials}
            selected
          ></ui5-user-menu-account>

          <ui5-user-menu-item
            icon="action-settings"
            text="Paramètres"
            data-id="settings"
          ></ui5-user-menu-item>
        </ui5-user-menu>

        {/* Side Navigation */}
        <ui5-side-navigation
          slot="sideContent"
          accessible-name="Navigation principale"
          className="sideNavigation"
        >
          <ui5-side-navigation-item
            text="Tableau de bord"
            icon="home"
            data-path="/dashboard"
            selected
          ></ui5-side-navigation-item>

          <ui5-side-navigation-item
            text="Mon profil"
            icon="account"
            data-path="/profile"
          ></ui5-side-navigation-item>

          <ui5-side-navigation-item
            text="Utilisateurs"
            icon="group"
            data-path="/users"
          ></ui5-side-navigation-item>

          <ui5-side-navigation-item
            text="Modules"
            icon="puzzle"
            data-path="/modules"
          ></ui5-side-navigation-item>

          <ui5-side-navigation-item
            text="Assistant IA"
            icon="bot"
            data-path="/ai"
          ></ui5-side-navigation-item>

          <ui5-side-navigation-item
            slot="fixedItems"
            text="Paramètres"
            icon="action-settings"
            data-path="/settings"
          ></ui5-side-navigation-item>
        </ui5-side-navigation>

        {/* Main Content */}
        <div className="mainContent">
          <ui5-title level="H2">Bienvenue, {displayName}</ui5-title>
          <br />
          <ui5-text>
            Vue d'ensemble de votre espace de travail OpsFlux
          </ui5-text>
          <br /><br />

          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <ui5-card>
              <ui5-card-header
                slot="header"
                title-text="Modules actifs"
                subtitle-text="Nombre de modules installés"
              ></ui5-card-header>
              <div style={{ padding: '1rem' }}>
                <ui5-title level="H3">5</ui5-title>
                <ui5-text>+2 ce mois</ui5-text>
              </div>
            </ui5-card>

            <ui5-card>
              <ui5-card-header
                slot="header"
                title-text="Utilisateurs"
                subtitle-text="Utilisateurs actifs"
              ></ui5-card-header>
              <div style={{ padding: '1rem' }}>
                <ui5-title level="H3">12</ui5-title>
                <ui5-text>Actifs</ui5-text>
              </div>
            </ui5-card>

            <ui5-card>
              <ui5-card-header
                slot="header"
                title-text="Tâches en cours"
                subtitle-text="Tâches assignées"
              ></ui5-card-header>
              <div style={{ padding: '1rem' }}>
                <ui5-title level="H3">24</ui5-title>
                <ui5-text>À traiter</ui5-text>
              </div>
            </ui5-card>
          </div>

          {/* Actions rapides */}
          <ui5-title level="H3">Actions rapides</ui5-title>
          <br />
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <ui5-button design="Emphasized" icon="add">
              Nouveau document
            </ui5-button>
            <ui5-button design="Default" icon="group" onClick={() => navigate('/users')}>
              Gérer utilisateurs
            </ui5-button>
            <ui5-button design="Default" icon="puzzle" onClick={() => navigate('/modules')}>
              Installer module
            </ui5-button>
          </div>
        </div>
      </ui5-navigation-layout>
    </div>
  );
};

export default Dashboard;
