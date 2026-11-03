import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS, DROPDOWN_ITEMS } from './navConfig.js';
import { MegaMenu } from './MegaMenu.js';
import type { MegaMenuCategory } from './MegaMenu.js';

export const menuTextStyle = {
  color: 'var(--Navbar-color-frame-text-default, #404041)',
  fontFamily:
    'var(--typography-desktop-body-xl-font-family, ChulaCharasNew, sans-serif)',
  fontSize: 'var(--typography-desktop-body-xl-size, 20px)',
  fontWeight: '400',
  lineHeight: 'var(--typography-desktop-body-xl-line-height, 28px)',
};

function useClickOutside(ref: React.RefObject<HTMLElement | null>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

export function DesktopMenu() {
  const location = useLocation();
  const { t } = useTranslation('common');

  // Simple dropdown (ฝึกงาน)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  // Mega-menu (hover-triggered)
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuCategory[] | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  const openMegaMenu = useCallback((categories: MegaMenuCategory[]) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMegaMenu(categories);
  }, []);

  const closeMegaMenuDelayed = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMegaMenu(null), 300);
  }, []);

  // Close mega-menu on route change
  useEffect(() => {
    setActiveMegaMenu(null);
  }, [location.pathname]);

  // Close mega-menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveMegaMenu(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Backdrop — dims content when mega-menu is open */}
      {activeMegaMenu && (
        <div
          className="fixed inset-0 z-30 bg-black/10"
          style={{ top: '81px' }}
          onClick={() => setActiveMegaMenu(null)}
        />
      )}

      <div
        ref={menuBarRef}
        className="hidden lg:flex items-center gap-[38px] h-[81px]"
      >
        {NAV_ITEMS.map((item) => {
          // ── Mega-menu item ──────────────────────────────────────────────
          if (item.hasMegaMenu && item.megaMenu) {
            const isMenuOpen = activeMegaMenu === item.megaMenu;
            return (
              <div
                key={item.label}
                className="group relative h-[81px] flex items-center cursor-pointer"
                onMouseEnter={() => openMegaMenu(item.megaMenu!)}
                onMouseLeave={closeMegaMenuDelayed}
              >
                <Link
                  to={item.path}
                  style={{
                    ...menuTextStyle,
                    color: isMenuOpen || isActive(item.path) ? '#CA5582' : menuTextStyle.color,
                  }}
                  className="group-hover:!text-[#CA5582] transition-colors text-center whitespace-nowrap block"
                  onClick={() => setActiveMegaMenu(null)}
                >
                  {t(item.label)}
                </Link>

                {/* Instant Hover Mega-Menu (both React state & CSS hover supported) */}
                <div
                  className={isMenuOpen ? 'block' : 'hidden group-hover:block'}
                  onMouseEnter={() => openMegaMenu(item.megaMenu!)}
                  onMouseLeave={closeMegaMenuDelayed}
                >
                  <MegaMenu
                    categories={item.megaMenu}
                    onClose={() => setActiveMegaMenu(null)}
                  />
                </div>
              </div>
            );
          }

          // ── Simple dropdown item (ฝึกงาน) ───────────────────────────────
          if (item.hasDropdown) {
            return (
              <div
                key={item.label}
                className="relative flex items-center gap-[8px] cursor-pointer select-none group"
                style={menuTextStyle}
                ref={dropdownRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="hover:opacity-75 transition-opacity whitespace-nowrap">{t(item.label)}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="11"
                  viewBox="0 0 17 11"
                  fill="none"
                  className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    d="M9.0831 9.83574C8.73362 10.2231 8.12575 10.2231 7.77627 9.83574L0.229012 1.46951C-0.281642 0.903441 0.120062 5.91278e-05 0.882427 5.91278e-05L15.9769 5.91278e-05C16.7393 5.91278e-05 17.141 0.903443 16.6304 1.46951L9.0831 9.83574Z"
                    fill="#636363"
                  />
                </svg>

                {isDropdownOpen && (
                  <div className="absolute top-[130%] right-0 bg-[#FFF] border border-[#E5E7EB] rounded-md shadow-lg py-2 flex flex-col min-w-[160px] z-50">
                    {DROPDOWN_ITEMS.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.label}
                        to={dropdownItem.path}
                        className="px-4 py-2 text-left hover:bg-pink-50/50 hover:!text-[#CA5582] transition-colors text-[16px]"
                        style={{
                          fontFamily: menuTextStyle.fontFamily,
                          color: menuTextStyle.color,
                        }}
                      >
                        {t(dropdownItem.label)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // ── Plain link ──────────────────────────────────────────────────
          return (
            <Link
              key={item.label}
              to={item.path}
              style={{
                ...menuTextStyle,
                color: isActive(item.path) ? '#CA5582' : menuTextStyle.color,
              }}
              className="hover:opacity-75 transition-opacity text-center whitespace-nowrap"
            >
              {t(item.label)}
            </Link>
          );
        })}
      </div>

    </>
  );
}
