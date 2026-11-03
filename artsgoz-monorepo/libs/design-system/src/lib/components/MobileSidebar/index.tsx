import React from 'react';
import logoImg from '../../assets/logo_goz_horizontal.ico';
import { CULoginButton } from '../CULoginButton/index.js';

export interface MobileSidebarItem {
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  menuItems: MobileSidebarItem[];
}

export function MobileSidebar({
  isOpen,
  onClose,
  isLoggedIn,
  onLogin,
  onLogout,
  menuItems,
}: MobileSidebarProps) {
  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Drawer Wrapper */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar container with the exact requested CSS */}
        <div
          className="bg-[var(--color-pink-50,#fceff4)] flex flex-col pt-10 px-6 gap-6 shadow-xl border-r border-gray-100/50 transition-all duration-300"
          style={{
            position: 'relative',
            width: isLoggedIn ? '255px' : '290px',
            height: '100%',
          }}
        >
          {/* Logo Area */}
          <div className="flex items-center justify-start pl-2">
            <img
              src={logoImg}
              alt="Artsgoz Logo"
              className="w-[180px] object-contain"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3 mt-4">
            {menuItems.map((item) => (
              <div
                key={item.label}
                onClick={item.onClick}
                className={`flex items-center gap-4 px-4 py-3 rounded-[12px] font-serif text-[18px] font-normal transition-all cursor-pointer ${
                  item.active
                    ? 'bg-[#FFF] text-[#111827]'
                    : 'text-gray-600 hover:bg-white/40'
                }`}
              >
                {item.icon}
                <span className="leading-none">{item.label}</span>
              </div>
            ))}

            {/* Login / Logout Button inside Sidebar */}
            <div className="px-2 mt-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    console.log('ออกจากระบบผ่านมือถือ');
                    onLogout();
                    onClose();
                  }}
                  className="flex items-center justify-center bg-white border border-[#E5E7EB] cursor-pointer hover:bg-gray-50 active:scale-95 transition-all text-gray-800 text-[16px] font-bold w-full shrink-0 whitespace-nowrap"
                  style={{
                    height: '42px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-serif, ChulaCharasNew, sans-serif)',
                  }}
                >
                  ออกจากระบบ
                </button>
              ) : (
                <CULoginButton
                  onClick={() => {
                    console.log('ล็อกอินผ่านมือถือ');
                    onLogin();
                    onClose();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
