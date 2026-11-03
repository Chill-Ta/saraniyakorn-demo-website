import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, Download, Target, Shield, BookOpen, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@artsgoz/design-system';
import { Footer } from '../../../components/Footer/index.js';

// Assets
import logoGoz from '../../../assets/about/logo_goz.png';
import gozDisbursement from '../../../assets/about/goz_disbursement.png';

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionItem({ title, icon, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className="w-full border-b border-[#ECECEC] overflow-hidden py-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 cursor-pointer bg-transparent text-[#404041] hover:text-[#DE5D8F] transition-colors duration-200 text-left focus:outline-none group"
      >
        <div className="flex items-center gap-4">
          <div className="text-[#DE5D8F] shrink-0">
            {icon}
          </div>
          <span className="text-[20px] md:text-[24px] font-bold font-serif leading-none transition-colors duration-200 group-hover:text-[#DE5D8F]">
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#DE5D8F] shrink-0"
        >
          <ChevronDown size={24} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AboutPage() {
  const { t } = useTranslation('about');
  const [openSection, setOpenSection] = useState<string | null>('vision');

  const toggleSection = (section: string) => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  const visionPoints = (t('vision_points', { returnObjects: true }) as string[]) || [];
  const policyPoints = (t('policy_points', { returnObjects: true }) as string[]) || [];

  const downloadForms = [
    {
      name: t('download_forms.form1.name'),
      desc: t('download_forms.form1.desc'),
      format: 'PDF / DOCX',
      size: '1.2 MB'
    },
    {
      name: t('download_forms.form2.name'),
      desc: t('download_forms.form2.desc'),
      format: 'PDF / XLSX',
      size: '980 KB'
    },
    {
      name: t('download_forms.form3.name'),
      desc: t('download_forms.form3.desc'),
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      name: t('download_forms.form4.name'),
      desc: t('download_forms.form4.desc'),
      format: 'PDF',
      size: '640 KB'
    }
  ];

  return (
    <>
      <div className="w-full bg-white min-h-screen">
        {/* ── Main Content ── */}
        <div className="max-w-[1097px] mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col gap-16 md:gap-24">
          
          {/* ── Hero / Intro Row ── */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-20">
            {/* Logo Image */}
            <div className="w-[220px] md:w-[254px] aspect-[254/239] shrink-0 overflow-hidden">
              <img 
                src={logoGoz} 
                alt={t('logo_alt')} 
                className="w-full h-full object-contain drop-shadow-sm select-none"
              />
            </div>
            
            {/* Description Text */}
            <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
              <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#404041] font-serif leading-tight">
                {t('title')}
              </h2>
              <p className="text-[18px] md:text-[20px] font-normal text-[#6D6D6D] font-serif leading-relaxed text-justify">
                {t('description')}
              </p>
            </div>
          </div>

          {/* ── Accordion Collapse Sections ── */}
          <div className="max-w-[902px] w-full mx-auto flex flex-col gap-5">
            
            {/* 1. วิสัยทัศน์ */}
            <AccordionItem
              title={t('vision_title')}
              icon={<Target size={26} />}
              isOpen={openSection === 'vision'}
              onToggle={() => toggleSection('vision')}
            >
              <ul className="flex flex-col gap-4 font-serif text-[16px] md:text-[18px] text-[#404041] leading-relaxed py-2">
                {visionPoints.map((point, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <span className="text-[#6D6D6D] shrink-0">-</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>

            {/* 2. นโยบาย */}
            <AccordionItem
              title={t('policy_title')}
              icon={<Shield size={26} />}
              isOpen={openSection === 'policy'}
              onToggle={() => toggleSection('policy')}
            >
              <ul className="flex flex-col gap-4 font-serif text-[16px] md:text-[18px] text-[#404041] leading-relaxed py-2">
                {policyPoints.map((point, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <span className="text-[#6D6D6D] shrink-0">-</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>

            {/* 3. ดาวน์โหลด */}
            <AccordionItem
              title={t('download_title')}
              icon={<BookOpen size={26} />}
              isOpen={openSection === 'downloads'}
              onToggle={() => toggleSection('downloads')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                {downloadForms.map((form, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border border-gray-100 bg-[#FDF8FA]/50 hover:bg-[#FDF8FA] transition-colors flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-start gap-2.5">
                        <FileText size={20} className="text-[#DE5D8F] shrink-0 mt-0.5" />
                        <h4 className="font-bold text-[15px] md:text-[16px] text-[#404041] font-serif leading-tight">
                          {form.name}
                        </h4>
                      </div>
                      <p className="text-[13px] text-gray-500 font-serif leading-normal pl-7">
                        {form.desc}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pl-7 border-t border-gray-50 pt-2.5">
                      <span className="text-[12px] text-gray-400 font-sans">
                        {form.format} • {form.size}
                      </span>
                      <a 
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-1 text-[13px] font-bold text-[#DE5D8F] hover:text-[#CA5582] transition-colors"
                      >
                        <Download size={14} />
                        {t('download_btn')}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionItem>

            {/* 4. ระเบียบการเบิกจ่าย ก.อศ. */}
            <AccordionItem
              title={t('download_flowchart_title')}
              icon={<Layers size={26} />}
              isOpen={openSection === 'regulations'}
              onToggle={() => toggleSection('regulations')}
            >
              <div className="flex flex-col items-center gap-6 py-4">
                {/* Regulations flowchart image */}
                <div className="w-full max-w-[580px] rounded-xl overflow-hidden border border-[#ECECEC] shadow-sm">
                  <img 
                    src={gozDisbursement} 
                    alt={t('download_flowchart_title')} 
                    className="w-full object-cover select-none"
                  />
                </div>
                
                {/* Download Flowchart Button */}
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = gozDisbursement;
                    link.download = 'goz_disbursement_regulations.png';
                    link.click();
                  }}
                  variant="outline"
                  className="font-serif border-[#DE5D8F] text-[#DE5D8F] hover:bg-[#FDF8FA] h-[46px] rounded-xl font-bold text-[15px]"
                >
                  <Download size={16} />
                  {t('download_flowchart_btn')}
                </Button>
              </div>
            </AccordionItem>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
