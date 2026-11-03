import { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@artsgoz/design-system';
import { HomeBanner } from '../../../features/banner-carousel/index.js';
import { AgendaWidgets } from '../../../features/agenda/index.js';
import { QuickAccessSection, useQuickAccess, AddShortcutModal } from '../../../features/quick-access/index.js';
import { ArticlesSection } from '../../../features/articles/index.js';
import { ClubsSection } from '../../../features/clubs/index.js';
import { Footer } from '../../../components/Footer/index.js';

function NoiseOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.018] mix-blend-overlay">
      <svg className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2 select-none pointer-events-none animate-[noiseShift_0.6s_infinite_steps(8)]">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
      <style>{`
        @keyframes noiseShift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(-2%, 1%); }
          30% { transform: translate(1%, -2%); }
          40% { transform: translate(-1%, 3%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(1%, 2%); }
          70% { transform: translate(2%, -2%); }
          80% { transform: translate(-1%, 1%); }
          90% { transform: translate(1%, 3%); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}

export function HomePage() {
  const { menus, addMenu, deleteMenu } = useQuickAccess();
  const { t } = useTranslation('home');
  const [isManageMode, setIsManageMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="mt-[-65px] lg:mt-[-81px] pt-[65px] lg:pt-[81px] w-full bg-white overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col">
      {/* Section 1: Hero Banner — Responsive height */}
      <div className="w-full h-[280px] sm:h-[400px] md:h-[520px] lg:h-[80vh] bg-gray-200 shrink-0 relative overflow-hidden">
        <HomeBanner />
        <NoiseOverlay />
      </div>

      {/* Section 2: บริการนิสิต — Left: title+description, Right: 3×2 QuickAccess grid */}
      <div 
        id="student-services-section"
        className="w-full bg-white mt-4 sm:mt-8 lg:mt-16 py-10 sm:py-16 md:py-24 lg:py-32 scroll-mt-[85px] lg:scroll-mt-[105px] relative overflow-hidden"
      >
        <div className="max-w-[1282px] mx-auto px-4 lg:px-6 w-full flex flex-col gap-8 relative z-10">
          <div className="w-full flex flex-col lg:flex-row items-start gap-12 lg:gap-24">
            {/* Left: Section title + description */}
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col justify-start lg:pt-4">
              <h2 className="font-serif text-[40px] lg:text-[48px] font-bold leading-[1.2] text-[#404041] mb-4">
                {t('home.student_services_title')}
              </h2>
              <p className="font-serif text-[16px] leading-[24px] text-[#6D6D6D]">
                {t('home.student_services_desc')}
              </p>
            </div>
            {/* Right: Quick Access cards grid */}
            <div className="flex-1 min-w-0">
              <QuickAccessSection 
                hideHeading 
                showActionButtons={false} 
                menus={menus}
                isManageMode={isManageMode}
                onDeleteMenu={deleteMenu}
              />
            </div>
          </div>
          {/* Action buttons spanning full width under both columns */}
          <div className="flex flex-row justify-end items-center gap-4 mt-4 w-full border-t border-gray-100 pt-6">
            {isManageMode ? (
              <Button 
                onClick={() => setIsManageMode(false)}
                className="flex items-center gap-2 bg-[#de5d8f] hover:bg-[#ca5582] text-white border-none active:scale-95 transition-all"
              >
                {t('home.done')}
              </Button>
            ) : (
              <Button 
                onClick={() => setIsManageMode(true)}
                variant="outline"
                className="flex items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Settings size={16} />
                {t('home.manage_menu')}
              </Button>
            )}
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
            >
              <Plus size={16} />
              {t('home.add_shortcut')}
            </Button>
          </div>
        </div>
        <NoiseOverlay />
      </div>

      {/* Section 3: ปฏิทินกิจกรรมและกำหนดการ */}
      <div className="w-full bg-white py-10 sm:py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-[1282px] mx-auto px-4 lg:px-6 w-full relative z-10">
          <AgendaWidgets />
        </div>
        <NoiseOverlay />
      </div>

      {/* Section 4: Articles (White Band) */}
      <div className="w-full bg-white py-10 sm:py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-[1282px] mx-auto px-4 lg:px-6 w-full relative z-10">
          <ArticlesSection />
        </div>
        <NoiseOverlay />
      </div>

      {/* Section 5: Clubs */}
      <div className="w-full bg-white py-10 sm:py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-[1282px] mx-auto px-4 lg:px-6 w-full relative z-10">
          <ClubsSection />
        </div>
        <NoiseOverlay />
      </div>

      {/* Section 6: Footer */}
      <div className="w-full">
        <Footer />
      </div>

      {/* Add Shortcut dialog popup */}
      <AddShortcutModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        currentMenus={menus}
        onAdd={addMenu}
      />
    </div>
  );
}

export default HomePage;
