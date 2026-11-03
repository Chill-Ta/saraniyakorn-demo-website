import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Search,
  Menu,
  X,
} from 'lucide-react';
import logoGoz from '../../assets/logo_goz.png';

interface GozAdminLayoutProps {
  children: ReactNode;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  showTopSearch?: boolean;
}

export function GozAdminLayout({
  children,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'ค้นหา...',
  showTopSearch = true,
}: GozAdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard Overview',
      path: '/admin',
      isActive: (pathname: string) =>
        pathname === '/admin' ||
        pathname === '/admin/dashboard' ||
        pathname === '/dashboard',
    },
    {
      id: 'users',
      icon: Users,
      label: 'User Management',
      path: '/admin/users',
      isActive: (pathname: string) => pathname === '/admin/users',
    },
    // Note: 'Approval' menu is removed from sidebar as requested by the user
    {
      id: 'audit-log',
      icon: FileText,
      label: 'Audit Log',
      path: '/admin/audit-log',
      isActive: (pathname: string) => pathname === '/admin/audit-log',
    },
  ];

  const handleSignOut = () => {
    navigate('/yellow-card/backoffice');
  };

  const renderSidebarContent = (onItemClick?: () => void) => (
    <div className="flex flex-col h-full justify-between" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
      <div>
        {/* Brand Header with Peacock Logo */}
        <div
          className="flex items-center gap-3 px-5 py-6 cursor-pointer border-b border-[#F0F0F0]"
          onClick={() => {
            navigate('/admin');
            onItemClick?.();
          }}
        >
          <img
            src={logoGoz}
            alt="Arts Student Committee Logo"
            className="w-10 h-10 object-contain shrink-0"
          />
          <div className="flex flex-col">
            <span
              className="font-bold text-[#1A1C1C] text-[15px] leading-tight"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              คณะกรรมการ
            </span>
            <span
              className="font-bold text-[#1A1C1C] text-[15px] leading-tight"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              นิสิตอักษรศาสตร์
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-5 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const active = item.isActive(location.pathname);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                id={`sidebar-admin-${item.id}`}
                onClick={() => {
                  navigate(item.path);
                  onItemClick?.();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-[15px] font-bold border-none cursor-pointer transition-all ${
                  active
                    ? 'bg-[#FCEFF4] text-[#DE5D8F] shadow-xs'
                    : 'bg-transparent text-[#545455] hover:bg-[#F9FAFB] hover:text-[#1A1C1C]'
                }`}
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                <Icon
                  size={20}
                  color={active ? '#DE5D8F' : '#545455'}
                  strokeWidth={active ? 2.3 : 1.8}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Sign out */}
      <div className="p-4 border-t border-[#F0F0F0]">
        <button
          type="button"
          id="sidebar-admin-signout"
          onClick={() => {
            handleSignOut();
            onItemClick?.();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-[15px] font-bold text-[#545455] hover:text-[#DE5D8F] hover:bg-[#FCEFF4] bg-transparent border-none cursor-pointer transition-colors"
          style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
        >
          <LogOut size={20} color="#545455" strokeWidth={1.8} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8F9FA]" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
      {/* ─── Desktop Sidebar (>= md) ───────────────────────────────────────── */}
      <aside
        className="hidden md:flex shrink-0 flex-col h-screen sticky top-0 z-30 bg-white border-r border-[#ECECEC] select-none"
        style={{ width: 250 }}
      >
        {renderSidebarContent()}
      </aside>

      {/* ─── Mobile Header (< md) ─────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-[#ECECEC] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg text-[#1A1C1C] hover:bg-gray-100 border-none bg-transparent cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/admin')}>
            <img src={logoGoz} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-[#1A1C1C] text-[16px]">GOZ Admin</span>
          </div>
        </div>
      </header>

      {/* ─── Mobile Drawer (< md) ─────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[270px] h-full bg-white shadow-2xl flex flex-col pt-3 pb-6 overflow-y-auto">
            <div className="flex justify-end px-4 mb-1">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-[#1A1C1C] hover:bg-gray-100 border-none bg-transparent cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            {renderSidebarContent(() => setMobileMenuOpen(false))}
          </div>
        </div>
      )}

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Search Bar */}
        {showTopSearch && (
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#ECECEC] px-4 md:px-8 py-3.5 flex items-center justify-center">
            <div className="w-full max-w-[720px] relative">
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-5 pr-11 rounded-full border border-[#DFDFE0] bg-[#FAFAFA] text-[#1A1C1C] text-[14px] outline-none transition-all focus:bg-white focus:border-[#DE5D8F] focus:shadow-xs"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              />
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8C] pointer-events-none"
              />
            </div>
          </header>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export default GozAdminLayout;
