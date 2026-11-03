import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu, X, BookOpen, Bookmark, User } from 'lucide-react';
import { Button, MobileSidebar } from '@artsgoz/design-system';
import { NAV_ITEMS } from './navConfig.js';
import { LanguageSwitcher } from '../LanguageSwitcher/index.js';
import { PATHS } from '../../routes/paths.js';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuToggle({ isOpen, onClick }: MobileMenuToggleProps) {
  return (
    <Button
      variant="outline"
      className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors border-none bg-transparent hover:bg-transparent shadow-none w-[44px] h-[44px] flex items-center justify-center"
      onClick={onClick}
    >
      {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
    </Button>
  );
}

interface MobileMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onAccountClick?: () => void;
}

export function MobileMenuPanel({
  isOpen,
  onClose,
  isLoggedIn,
  onLogin,
  onLogout,
  onAccountClick,
}: MobileMenuPanelProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('common');

  const isActive = (path: string) => {
    const isItemSaved = path.includes('tab=saved');
    const searchParams = new URLSearchParams(location.search);
    const currentIsSaved = searchParams.get('tab') === 'saved';

    if (isItemSaved) {
      return currentIsSaved;
    }

    return (
      !currentIsSaved &&
      (location.pathname === PATHS.ROOT || location.pathname.startsWith(PATHS.ARTICLES))
    );
  };

  // Map icons based on nav item path
  const getIconByPath = (path: string) => {
    if (path.includes('tab=saved')) {
      return <Bookmark size={20} className="text-gray-400 shrink-0" />;
    }
    if (path === '#') {
      return <User size={20} className="text-gray-400 shrink-0" />;
    }
    return <BookOpen size={20} className="text-gray-400 shrink-0" />;
  };

  // Generate dynamic items based on login status
  const currentMenuItems = [...NAV_ITEMS];
  if (isLoggedIn) {
    currentMenuItems.push({ label: 'navbar.account', path: '#' });
  }

  const mappedMenuItems = currentMenuItems.map((item) => ({
    label: t(item.label),
    active: isActive(item.path),
    icon: getIconByPath(item.path),
    onClick: () => {
      if (item.label === 'navbar.account' && onAccountClick) {
        onAccountClick();
      } else {
        navigate(item.path);
      }
      onClose();
    },
  }));

  return (
    <>
      <MobileSidebar
        isOpen={isOpen}
        onClose={onClose}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        onLogout={onLogout}
        menuItems={mappedMenuItems}
      />
      {/* Language switcher within mobile panel — rendered below menu items */}
      {isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
          <LanguageSwitcher compact />
        </div>
      )}
    </>
  );
}
