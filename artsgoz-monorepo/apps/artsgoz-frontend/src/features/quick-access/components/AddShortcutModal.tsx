import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@artsgoz/design-system';
import { X, HelpCircle } from 'lucide-react';
import { ICON_MAP, ALL_EXISTING_SERVICES } from '../constants.js';
import { FeatureMenu } from '../types.js';

interface AddShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMenus: FeatureMenu[];
  onAdd: (menu: { title: string; description: string; iconName: string; href: string; isExternal?: boolean }) => void;
}

export function AddShortcutModal({ isOpen, onClose, currentMenus, onAdd }: AddShortcutModalProps) {
  const { t } = useTranslation('home');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter out services that are already added as shortcuts
  const availableServices = ALL_EXISTING_SERVICES.filter((service) => {
    return !currentMenus.some(
      (menu) => menu.title === service.title || menu.href === service.href
    );
  });

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    setSelectedIndex(0);
  }

  if (!isOpen) return null;

  const selectedService = availableServices[selectedIndex];
  const IconComponent = selectedService
    ? (ICON_MAP[selectedService.iconName] || HelpCircle)
    : HelpCircle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    onAdd({
      title: selectedService.title,
      description: selectedService.description,
      iconName: selectedService.iconName,
      href: selectedService.href,
      isExternal: (selectedService as any).isExternal,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 max-w-[500px] w-full shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <span className="font-serif text-[20px] sm:text-[22px] font-bold text-gray-900">{t('quick_access.modal.title')}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-none bg-transparent focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {availableServices.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-[#fceff4] text-[#de5d8f] flex items-center justify-center mb-4">
              <HelpCircle size={32} />
            </div>
            <h4 className="font-serif text-[18px] font-bold text-gray-800">{t('quick_access.modal.empty_title')}</h4>
            <p className="text-[14px] text-gray-500 mt-2 max-w-xs leading-relaxed">
              {t('quick_access.modal.empty_desc')}
            </p>
            <Button
              type="button"
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-[#de5d8f] hover:bg-[#ca5582] text-white border-none text-[15px] font-bold"
            >
              {t('quick_access.modal.ok')}
            </Button>
          </div>
        ) : (
          /* Form Selection */
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-serif text-[14px] font-bold text-gray-700">
                {t('quick_access.modal.select_label')} <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-[#de5d8f] focus:outline-none text-[15px] bg-white transition-all"
              >
                {availableServices.map((service, index) => (
                  <option key={service.href} value={index}>
                    {t(service.title)}
                  </option>
                ))}
              </select>
            </div>

            {selectedService && (
              /* Live Preview Card */
              <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-[#DE5D8F]/30 bg-[#fceff4]/20 text-center select-none animate-in fade-in zoom-in-95 duration-200">
                <span className="text-[11px] font-bold text-[#DE5D8F] uppercase tracking-widest mb-3">{t('quick_access.modal.preview_label')}</span>
                <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm mb-3">
                  <IconComponent size={36} className="text-[#E992B4]" />
                </div>
                <h4 className="font-serif text-[18px] font-bold text-gray-800 leading-tight">
                  {t(selectedService.title)}
                </h4>
                <p className="text-[13px] text-gray-500 max-w-sm mt-2 leading-relaxed">
                  {t(selectedService.description)}
                </p>
                <div className="flex items-center gap-1.5 mt-4">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-100 px-2 py-0.5 rounded border border-gray-150 font-mono">
                    {(selectedService as any).isExternal ? t('quick_access.modal.link_type_external') : t('quick_access.modal.link_type_internal')}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-5 py-2.5 text-[15px] font-bold"
              >
                {t('quick_access.modal.cancel')}
              </Button>
              <Button
                type="submit"
                className="px-5 py-2.5 bg-[#de5d8f] hover:bg-[#ca5582] text-white border-none text-[15px] font-bold"
              >
                {t('quick_access.modal.add')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
