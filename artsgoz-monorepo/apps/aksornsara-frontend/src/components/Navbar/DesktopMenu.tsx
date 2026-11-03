import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS } from './navConfig.js';
import { PATHS } from '../../routes/paths.js';

export const menuTextStyle = {
  color: 'var(--Navbar-color-frame-text-default, #404041)',
  fontFamily:
    'var(--typography-desktop-body-xl-font-family, ChulaCharasNew, sans-serif)',
  fontSize: 'var(--typography-desktop-body-xl-size, 20px)',
  fontWeight: '400',
  lineHeight: 'var(--typography-desktop-body-xl-line-height, 28px)',
};

export function DesktopMenu() {
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

  return (
    <div className="hidden lg:flex items-center gap-[38px] h-[81px]">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.label}
            to={item.path}
            style={{
              ...menuTextStyle,
              color: active ? '#CA5582' : menuTextStyle.color,
              fontWeight: active ? '700' : '400',
            }}
            className="hover:!text-[#CA5582] transition-colors text-center whitespace-nowrap"
          >
            {t(item.label)}
          </Link>
        );
      })}
    </div>
  );
}
