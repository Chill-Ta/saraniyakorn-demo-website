import { useTranslation } from 'react-i18next';

export type ActiveTab = 'curriculum' | 'planner' | 'summary';

interface AcademicTrackerNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  showSummary: boolean;
}

export function AcademicTrackerNavBar({ activeTab, onTabChange, showSummary }: AcademicTrackerNavBarProps) {
  const { t } = useTranslation('credit_tracking');

  const tabs: { key: ActiveTab; labelKey: string }[] = [
    { key: 'curriculum', labelKey: 'navbar.curriculum' },
    { key: 'planner', labelKey: 'navbar.planner' },
    ...(showSummary ? [{ key: 'summary' as ActiveTab, labelKey: 'navbar.summary' }] : []),
  ];

  return (
    <div
      className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-none pb-1"
      style={{ minHeight: '56px' }}
    >
      {/* Background bar */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '52px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
        }}
      />

      {/* Tabs row — floats over the bar */}
      <div
        className="relative left-0 flex items-end gap-[16px]"
        style={{ minHeight: '56px' }}
      >
        {tabs.map(({ key, labelKey }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              id={`tab-${key}`}
              onClick={() => onTabChange(key)}
              className={`cursor-pointer transition-all border-none outline-none whitespace-nowrap flex items-center justify-center font-[ChulaCharasNew] font-bold px-4 sm:px-11 py-2.5 sm:py-3.5 min-h-[44px] sm:min-h-[54px] text-[16px] sm:text-[21px] leading-tight rounded-t-[10px] sm:rounded-t-[14px] ${
                isActive
                  ? 'text-white bg-[#DE5D8F] shadow-[0px_4px_12px_rgba(222,93,143,0.35)]'
                  : 'text-[#DE5D8F] bg-white shadow-[0px_2px_6px_rgba(0,0,0,0.12)]'
              }`}
            >
              {t(labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
