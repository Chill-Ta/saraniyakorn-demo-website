import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  CULoginButton,
  SearchInput,
  LoginDropdown,
  StudentProfileCard,
  ManageAccountCard,
} from '@artsgoz/design-system';
import { useClickOutside } from './useClickOutside.js';
import { LanguageSwitcher } from '../LanguageSwitcher/index.js';

interface NavActionsProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function NavActions({ isLoggedIn, onLogin, onLogout }: NavActionsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileView, setProfileView] = useState<'profile' | 'manage'>('profile');
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setIsLoginOpen(false);
    setIsProfileOpen(false);
    setProfileView('profile');
  });

  const handleLoginClick = () => {
    onLogin();
    setIsLoginOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsProfileOpen(false);
    setProfileView('profile');
  };

  return (
    <>
      <div className="hidden md:block">
        <SearchInput placeholder={t('navbar.search_placeholder')} />
      </div>
      <div className="hidden md:block">
        <LanguageSwitcher />
      </div>
      <div className="hidden sm:block relative" ref={containerRef}>
        {isLoggedIn ? (
          <>
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="w-[40px] h-[40px] rounded-full border border-[var(--color-border-subtle,#D0D0D1)] bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 active:scale-95 transition-all shadow-sm shrink-0"
              aria-label="User profile menu"
            >
              {/* Circular placeholder representation */}
              <div className="w-[30px] h-[30px] rounded-full border border-[#D0D0D1]/60" />
            </button>

            {isProfileOpen && (
              <>
                {profileView === 'profile' ? (
                  <StudentProfileCard
                    onLogout={handleLogoutClick}
                    onManageClick={() => setProfileView('manage')}
                    onSavedClick={() => {
                      navigate('/articles?tab=saved');
                      setIsProfileOpen(false);
                    }}
                    onHistoryClick={() => {
                      console.log('เมนูประวัติการวางแผนหน่วยกิตถูกคลิก');
                      setIsProfileOpen(false);
                    }}
                    style={{ left: 'auto', right: 0, top: 'calc(100% + 12px)' }}
                    className="shadow-[4px_8px_10.2px_rgba(0,0,0,0.25)] z-50"
                  />
                ) : (
                  <ManageAccountCard
                    onBack={() => setProfileView('profile')}
                    onEditClick={() => console.log('คลิกแก้ไขโปรไฟล์')}
                    onAvatarUpload={() => console.log('คลิกอัปโหลดรูปโปรไฟล์')}
                    style={{ left: 'auto', right: 0, top: 'calc(100% + 12px)' }}
                    className="shadow-[4px_8px_10.2px_rgba(0,0,0,0.25)] z-50"
                  />
                )}
              </>
            )}
          </>
        ) : (
          <>
            <CULoginButton onClick={() => setIsLoginOpen((prev) => !prev)} />
            {isLoginOpen && (
              <LoginDropdown
                onClose={() => setIsLoginOpen(false)}
                onLogin={handleLoginClick}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

