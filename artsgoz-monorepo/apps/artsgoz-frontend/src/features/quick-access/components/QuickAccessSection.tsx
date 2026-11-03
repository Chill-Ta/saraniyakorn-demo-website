import { Plus, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionHeading, Button } from '@artsgoz/design-system';
import { FeatureCard } from './FeatureCard.js';
import { QUICK_ACCESS_MENUS } from '../constants.js';

import { FeatureMenu } from '../types.js';

interface QuickAccessSectionProps {
  hideHeading?: boolean;
  showActionButtons?: boolean;
  menus?: FeatureMenu[];
  isManageMode?: boolean;
  onDeleteMenu?: (index: number) => void;
}

export function QuickAccessSection({ 
  hideHeading = false,
  showActionButtons = true,
  menus = QUICK_ACCESS_MENUS,
  isManageMode = false,
  onDeleteMenu
}: QuickAccessSectionProps) {
  const { t } = useTranslation('home');
  return (
    <section className="w-full flex flex-col">
      {!hideHeading && (
        <SectionHeading title={t('quick_access.section_title')} description={t('quick_access.section_desc')} />
      )}
      <div className={`flex flex-col gap-2 w-full ${!hideHeading ? 'mt-6' : ''}`}>
        {/* 3-column × 2-row grid matching wireframe */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {menus.map((feature, idx) => (
            <FeatureCard
              key={idx}
              title={t(feature.title)}
              description={t(feature.description ?? '')}
              icon={feature.icon}
              href={feature.href}
              size="sm"
              isManageMode={isManageMode}
              onDelete={() => onDeleteMenu?.(idx)}
            />
          ))}
        </div>
      </div>
      {showActionButtons && (
        <div className="flex flex-row justify-end items-center gap-4 mt-6 w-full border-t border-gray-100 pt-5">
          <Button variant="outline">
            <Settings size={16} />
            {t('quick_access.manage_menu')}
          </Button>
          <Button variant="outline">
            <Plus size={16} />
            {t('quick_access.add_shortcut')}
          </Button>
        </div>
      )}
    </section>
  );
}
