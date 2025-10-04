import React, { useEffect } from 'react';
import '@ui5/webcomponents-fiori/dist/UserMenu.js';
import '@ui5/webcomponents-fiori/dist/UserMenuItem.js';
import '@ui5/webcomponents-fiori/dist/UserMenuAccount.js';
import '@ui5/webcomponents-icons/dist/action-settings.js';
import '@ui5/webcomponents-icons/dist/account.js';
import '@ui5/webcomponents-icons/dist/log.js';

/**
 * Composant UserMenu
 * Menu utilisateur qui s'ouvre depuis la ShellBar
 * Contient le compte utilisateur et les actions rapides
 */
const UserMenu = ({ user, onSettingsClick, onProfileClick, onLogout, menuId = 'userMenu' }) => {
  useEffect(() => {
    const menuElement = document.getElementById(menuId);
    if (!menuElement) return;

    const handleItemClick = (event) => {
      const itemId = event.detail.item.getAttribute('data-id');

      switch (itemId) {
        case 'settings':
          if (onSettingsClick) onSettingsClick();
          break;
        case 'profile':
          if (onProfileClick) onProfileClick();
          break;
        case 'logout':
          if (onLogout) onLogout();
          break;
        default:
          break;
      }
    };

    menuElement.addEventListener('item-click', handleItemClick);

    return () => {
      menuElement.removeEventListener('item-click', handleItemClick);
    };
  }, [menuId, onSettingsClick, onProfileClick, onLogout]);

  const displayName = user?.display_name || user?.username || 'Utilisateur';
  const avatarUrl = user?.avatar_url || '';

  return (
    <ui5-user-menu id={menuId}>
      <ui5-user-menu-account
        slot="accounts"
        avatar-src={avatarUrl}
        title-text={displayName}
        subtitle-text={user?.email || ''}
        description={user?.role || 'Utilisateur'}
        selected
      />
      <ui5-user-menu-item
        icon="account"
        text="Mon profil"
        data-id="profile"
      />
      <ui5-user-menu-item
        icon="action-settings"
        text="Paramètres"
        data-id="settings"
      />
      <ui5-user-menu-item
        icon="log"
        text="Déconnexion"
        data-id="logout"
      />
    </ui5-user-menu>
  );
};

export default UserMenu;
