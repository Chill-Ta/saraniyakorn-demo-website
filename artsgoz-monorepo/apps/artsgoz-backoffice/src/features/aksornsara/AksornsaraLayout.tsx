/**
 * SaraniyakornLayout.tsx
 *
 * Shared layout shell for all Saraniyakorn sub-pages.
 * Supports:
 *  - Desktop: Sidebar (248px, fill #FCEFF4) + Topbar (41×41 return button + 601px search bar)
 *  - Mobile (375x812 as per Figma dev notes): Responsive mobile topbar with hamburger drawer
 */

import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LogOut,
  LayoutDashboard,
  BookOpenText,
  Plus,
  Settings,
  Search,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';

// ─── Sidebar Content ─────────────────────────────────────────────────────────

interface SidebarContentProps {
  onItemClick?: () => void;
}

function SidebarContent({ onItemClick }: SidebarContentProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/aksornsara',
      isActive: (pathname: string) =>
        pathname === '/aksornsara' ||
        pathname === '/aksornsara/traffic' ||
        pathname === '/aksornsara/categories' ||
        pathname === '/aksornsara/comments' ||
        pathname === '/aksornsara/activities' ||
        pathname === '/aksornsara/published-articles' ||
        pathname === '/saraniyakorn' ||
        pathname.startsWith('/saraniyakorn/'),
    },
    {
      id: 'articles',
      icon: BookOpenText,
      label: 'All Articles',
      path: '/aksornsara/articles',
      isActive: (pathname: string) =>
        pathname === '/aksornsara/articles' || pathname === '/saraniyakorn/articles',
    },
    {
      id: 'create',
      icon: Plus,
      label: 'Create New',
      path: '/aksornsara/create',
      isActive: (pathname: string) =>
        pathname === '/aksornsara/create' || pathname === '/saraniyakorn/create',
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      path: '/aksornsara/settings',
      isActive: (pathname: string) =>
        pathname === '/aksornsara/settings' || pathname === '/saraniyakorn/settings',
    },
  ];

  return (
    <div className="flex flex-col h-full justify-between" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
      <div className="flex flex-col" style={{ gap: 42 }}>
        {/* Brand — full word บทความอักษรสาร all equal */}
        <div
          className="flex items-center px-6 cursor-pointer select-none"
          style={{ height: 46 }}
          onClick={() => {
            navigate('/aksornsara');
            onItemClick?.();
          }}
        >
          <span
            className="font-bold text-black"
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
              fontSize: 22,
              lineHeight: '30px',
              color: '#1A1C1C',
              whiteSpace: 'nowrap',
            }}
          >
            บทความสาราณียากร
          </span>
        </div>

        {/* Nav items — ChulaCharasNew 700 18px, height 34, gap 16 */}
        <div className="flex flex-col">
          {navItems.map((item) => {
            const active = item.isActive(location.pathname);
            return (
              <div
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  onItemClick?.();
                }}
                className={`flex items-center cursor-pointer transition-all duration-150 select-none ${
                  active
                    ? 'bg-[#F5CDDC] text-[#1A1C1C]'
                    : 'bg-transparent text-[#545455] hover:bg-[#F9DEE8] hover:text-[#1A1C1C] active:bg-[#F0BED2]'
                }`}
                style={{
                  height: 38,
                  gap: 16,
                  paddingLeft: 24,
                  paddingRight: 24,
                }}
              >
                <item.icon
                  size={18}
                  color={active ? '#1A1C1C' : '#545455'}
                  className="transition-colors"
                />
                <span
                  className="font-bold transition-colors"
                  style={{
                    fontFamily: 'ChulaCharasNew, sans-serif',
                    fontSize: 18,
                    color: active ? '#1A1C1C' : '#545455',
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sign out */}
      <div
        onClick={() => {
          navigate('/yellow-card/backoffice');
          onItemClick?.();
        }}
        className="flex items-center cursor-pointer transition-all duration-150 select-none bg-transparent hover:bg-[#F9DEE8] active:bg-[#F0BED2] mb-4"
        style={{ height: 38, gap: 16, paddingLeft: 24, paddingRight: 24 }}
      >
        <LogOut size={18} color="#545455" />
        <span
          className="font-bold"
          style={{ fontFamily: 'ChulaCharasNew, sans-serif', fontSize: 18, color: '#545455' }}
        >
          Sign out
        </span>
      </div>
    </div>
  );
}

// ─── Top Search Bar (Figma node 6572:23485) ──────────────────────────────────

interface TopSearchBarProps {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}

function TopSearchBar({ value, onChange, placeholder = 'ค้นหา...' }: TopSearchBarProps) {
  return (
    <div
      className="flex items-center w-full max-w-[601px]"
      style={{
        height: 41,
        borderRadius: 9999,
        border: '1px solid #8B8B8C',
        backgroundColor: '#FFFFFF',
        padding: '0 16px',
        gap: 12,
        flexShrink: 1,
      }}
    >
      <input
        className="flex-1 bg-transparent outline-none min-w-0"
        style={{
          fontFamily: 'ChulaCharasNew, sans-serif',
          fontWeight: 400,
          fontSize: 18,
          color: '#1A1C1C',
          lineHeight: '17px',
        }}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <Search size={18} color="#33363F" strokeWidth={2} style={{ flexShrink: 0 }} />
    </div>
  );
}

// ─── Layout Shell ─────────────────────────────────────────────────────────────

export interface AksornsaraLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  showTopSearchBar?: boolean;
}

export type SaraniyakornLayoutProps = AksornsaraLayoutProps;

export function AksornsaraLayout({
  children,
  showBackButton = true,
  onBack,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'ค้นหา...',
  showTopSearchBar = true,
}: AksornsaraLayoutProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="w-full min-h-screen flex flex-col md:flex-row bg-white"
      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
    >
      {/* ── Desktop Sidebar (>= md) ── */}
      <aside
        className="hidden md:flex shrink-0 flex-col h-screen sticky top-0 z-20 overflow-y-auto"
        style={{
          width: 248,
          backgroundColor: '#FCEFF4',
          paddingTop: 22,
          paddingBottom: 21,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Header (< md) ── */}
      <header className="md:hidden sticky top-0 z-30 bg-[#FCEFF4] border-b border-[#F0BED2] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg text-[#1A1C1C] hover:bg-white/50 border-none bg-transparent cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span
            className="font-bold text-[#1A1C1C] text-[18px] cursor-pointer"
            onClick={() => navigate('/aksornsara')}
          >
            บทความอักษรสาร
          </span>
        </div>

        {showBackButton && (
          <button
            type="button"
            onClick={onBack || (() => navigate('/aksornsara'))}
            className="w-8 h-8 rounded-full border border-[#D6C1C7] bg-white flex items-center justify-center cursor-pointer"
            title="ย้อนกลับ"
          >
            <ChevronLeft size={18} color="#1A1C1C" />
          </button>
        )}
      </header>

      {/* ── Mobile Drawer (< md) ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div
            className="relative z-10 w-[270px] h-full bg-[#FCEFF4] shadow-2xl flex flex-col pt-4 pb-6 overflow-y-auto"
          >
            <div className="flex justify-end px-4 mb-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-[#1A1C1C] hover:bg-white/50 border-none bg-transparent cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent onItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 overflow-y-auto min-w-0 bg-white">
        {/* Topbar: Return Button + Search Bar */}
        {(showBackButton || showTopSearchBar) && (
          <div
            className="flex items-center gap-3 md:gap-4 px-4 md:px-10 pt-4 md:pt-6"
          >
            {showBackButton && (
              <button
                type="button"
                onClick={onBack || (() => navigate('/aksornsara'))}
                className="hidden md:flex items-center justify-center cursor-pointer shrink-0 transition-colors hover:bg-[#FCEFF4]"
                style={{
                  width: 41,
                  height: 41,
                  borderRadius: 9999,
                  border: '1px solid #D6C1C7',
                  backgroundColor: '#FFFFFF',
                }}
                title="ย้อนกลับ"
              >
                <ChevronLeft size={20} color="#1A1C1C" strokeWidth={2} />
              </button>
            )}

            {showTopSearchBar && (
              <TopSearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
              />
            )}
          </div>
        )}

        {/* Page children */}
        <div className="p-4 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export { AksornsaraLayout as SaraniyakornLayout };
export default AksornsaraLayout;
