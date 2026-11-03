import { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Download, 
  BookOpen, 
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@artsgoz/design-system';
import { Footer } from '../../../components/Footer/index.js';

interface MajorInfo {
  id: string;
  nameKey: string;
  pdfUrl: string;
  descKey: string;
  reqKey: string;
  color: string;
  bgGradient: string;
  initials: string;
  creditsRange: string;
  duration: string;
  structure: {
    titleKey: string;
    descKey: string;
    credits: number;
  }[];
}

export default function CurriculumPage() {
  const { t } = useTranslation('curriculum');
  const [selectedMajor, setSelectedMajor] = useState<string>('thai');
  const [activeTab, setActiveTab] = useState<'about' | 'structure' | 'tuition' | 'admission'>('about');
  
  // Accordion expansion states
  const [expandedStructure, setExpandedStructure] = useState<number | null>(0);
  const [expandedTuition, setExpandedTuition] = useState<number | null>(0);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const MAJORS: MajorInfo[] = useMemo(() => [
    {
      id: 'thai',
      nameKey: 'majors.thai.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/1-สาขาวิชาภาษาไทย.pdf',
      descKey: 'majors.thai.description',
      reqKey: 'majors.thai.requirements',
      color: '#de5d8f', // Design system pink-500
      bgGradient: 'from-[#fceff4] to-[#f5cddc]', // Design system pink-50 to pink-100
      initials: 'TH',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'english',
      nameKey: 'majors.english.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/2-สาขาวิชาภาษาอังกฤษ.pdf',
      descKey: 'majors.english.description',
      reqKey: 'majors.english.requirements',
      color: '#0165f8', // Design system blue-500
      bgGradient: 'from-[#e6f0fe] to-[#b0cffd]', // Design system blue-50 to blue-100
      initials: 'EN',
      creditsRange: '138',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 57 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'history',
      nameKey: 'majors.history.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/3-สาขาวิชาประวัติศาสตร์.pdf',
      descKey: 'majors.history.description',
      reqKey: 'majors.history.requirements',
      color: '#f8c135', // Design system yellow-500
      bgGradient: 'from-[#fef9eb] to-[#fdecc0]', // Design system yellow-50 to yellow-100
      initials: 'HI',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 51 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'geography',
      nameKey: 'majors.geography.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/4-สาขาวิชาภูมิศาสตร์.pdf',
      descKey: 'majors.geography.description',
      reqKey: 'majors.geography.requirements',
      color: '#3d940b', // Design system green-500
      bgGradient: 'from-[#ecf4e7] to-[#c3deb3]', // Design system green-50 to green-100
      initials: 'GE',
      creditsRange: '141',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 60 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'philosophy',
      nameKey: 'majors.philosophy.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/5-สาขาวิชาปรัชญา.pdf',
      descKey: 'majors.philosophy.description',
      reqKey: 'majors.philosophy.requirements',
      color: '#bc58fd', // Design system purple-500
      bgGradient: 'from-[#f8eeff] to-[#eacbfe]', // Design system purple-50 to purple-100
      initials: 'PH',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'information',
      nameKey: 'majors.information.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/6-สาขาวิชาสารสนเทศศึกษา.pdf',
      descKey: 'majors.information.description',
      reqKey: 'majors.information.requirements',
      color: '#99999a', // Design system grey-500
      bgGradient: 'from-[#f7f8f9] to-[#dfdfe0]', // Design system grey-25 to grey-100
      initials: 'IS',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'french',
      nameKey: 'majors.french.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/7-สาขาวิชาภาษาฝรั่งเศส.pdf',
      descKey: 'majors.french.description',
      reqKey: 'majors.french.requirements',
      color: '#0165f8', // Design system blue-500
      bgGradient: 'from-[#e6f0fe] to-[#b0cffd]',
      initials: 'FR',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'german',
      nameKey: 'majors.german.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/8-สาขาวิชาภาษาเยอรมัน.pdf',
      descKey: 'majors.german.description',
      reqKey: 'majors.german.requirements',
      color: '#3d940b', // Design system green-500
      bgGradient: 'from-[#ecf4e7] to-[#c3deb3]',
      initials: 'DE',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'japanese',
      nameKey: 'majors.japanese.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/9-สาขาวิชาภาษาญี่ปุ่น.pdf',
      descKey: 'majors.japanese.description',
      reqKey: 'majors.japanese.requirements',
      color: '#ea234f', // Design system red-500
      bgGradient: 'from-[#fde9ed] to-[#f8bbc8]', // Design system red-50 to red-100
      initials: 'JA',
      creditsRange: '138',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 57 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'chinese',
      nameKey: 'majors.chinese.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/10-สาขาวิชาภาษาจีน.pdf',
      descKey: 'majors.chinese.description',
      reqKey: 'majors.chinese.requirements',
      color: '#f8c135', // Design system yellow-500
      bgGradient: 'from-[#fef9eb] to-[#fdecc0]',
      initials: 'ZH',
      creditsRange: '138',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 57 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'pali',
      nameKey: 'majors.pali.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/11-สาขาวิชาภาษาบาลีและสันสกฤต.pdf',
      descKey: 'majors.pali.description',
      reqKey: 'majors.pali.requirements',
      color: '#bc58fd', // Design system purple-500
      bgGradient: 'from-[#f8eeff] to-[#eacbfe]',
      initials: 'PA',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'spanish',
      nameKey: 'majors.spanish.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/12-สาขาวิชาภาษาสเปน.pdf',
      descKey: 'majors.spanish.description',
      reqKey: 'majors.spanish.requirements',
      color: '#ea6d24', // Design system orange-500
      bgGradient: 'from-[#fdf0e9] to-[#f8d2bb]', // Design system orange-50 to orange-100
      initials: 'ES',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'italian',
      nameKey: 'majors.italian.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/13-สาขาวิชาภาษาอิตาเลียน.pdf',
      descKey: 'majors.italian.description',
      reqKey: 'majors.italian.requirements',
      color: '#3d940b', // Design system green-500
      bgGradient: 'from-[#ecf4e7] to-[#c3deb3]',
      initials: 'IT',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'korean',
      nameKey: 'majors.korean.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/14-สาขาวิชาภาษาเกาหลี.pdf',
      descKey: 'majors.korean.description',
      reqKey: 'majors.korean.requirements',
      color: '#0165f8', // Design system blue-500
      bgGradient: 'from-[#e6f0fe] to-[#b0cffd]',
      initials: 'KO',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'arabic',
      nameKey: 'majors.arabic.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/15-สาขาวิชาภาษาอาหรับ.pdf',
      descKey: 'majors.arabic.description',
      reqKey: 'majors.arabic.requirements',
      color: '#99999a', // Design system grey-500
      bgGradient: 'from-[#f7f8f9] to-[#dfdfe0]',
      initials: 'AR',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'south_asian',
      nameKey: 'majors.south_asian.title',
      pdfUrl: 'https://www.arts.chula.ac.th/th/wp-content/uploads/2023/06/16-สาขาวิชาภาษาเอเชียใต้.pdf',
      descKey: 'majors.south_asian.description',
      reqKey: 'majors.south_asian.requirements',
      color: '#bc58fd', // Design system purple-500
      bgGradient: 'from-[#f8eeff] to-[#eacbfe]',
      initials: 'SA',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    },
    {
      id: 'balac',
      nameKey: 'majors.balac.title',
      pdfUrl: 'http://www.balac.arts.chula.ac.th/',
      descKey: 'majors.balac.description',
      reqKey: 'majors.balac.requirements',
      color: '#de5d8f', // Design system pink-500
      bgGradient: 'from-[#fceff4] to-[#f5cddc]',
      initials: 'BC',
      creditsRange: '135',
      duration: '4',
      structure: [
        { titleKey: 'structure_faculty_core', descKey: 'structure_faculty_core_desc', credits: 27 },
        { titleKey: 'structure_major_courses', descKey: 'structure_major_courses_desc', credits: 54 },
        { titleKey: 'structure_gen_ed', descKey: 'structure_gen_ed_desc', credits: 30 }
      ]
    }
  ], []);

  const activeMajor = useMemo(() => {
    return MAJORS.find((m) => m.id === selectedMajor) || MAJORS[0];
  }, [selectedMajor, MAJORS]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 260;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="bg-white min-h-screen pb-16 font-serif">
        <div className="max-w-[1282px] mx-auto px-4 lg:px-6 w-full py-12 md:py-16 flex flex-col">
          
          {/* Header Row: Title & Selector Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-8 w-full">
            <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-bold text-black font-serif leading-tight">
              {t('select_major_label')}
            </h1>
            
            {/* Dropdown Selector */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between px-5 w-full sm:w-[240px] md:w-[275px] h-[40px] bg-[#ECECEC] rounded-lg font-serif text-[15px] font-bold text-black shadow-xs hover:bg-[#E0E0E0] transition-all cursor-pointer border-none"
              >
                <span>{t(activeMajor.nameKey)}</span>
                <ChevronDown className="w-4 h-4 text-black" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute left-0 sm:left-auto sm:right-0 mt-1 w-full sm:w-[240px] md:w-[275px] bg-[#ECECEC] rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    <div className="flex flex-col py-1">
                      {MAJORS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedMajor(m.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-5 py-2.5 text-[14px] font-serif font-bold transition-colors cursor-pointer border-none hover:bg-gray-200/50 bg-transparent ${
                            selectedMajor === m.id ? 'text-[#DE5D8F]' : 'text-black'
                          }`}
                        >
                          {t(m.nameKey)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Figma Style Major Slider Carousel (Desktop Carousel 1) */}
          <div className="relative w-full mb-12 sm:mb-16 flex items-center group">
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute left-[-8px] sm:left-[-16px] z-10 w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] md:w-[76px] md:h-[76px] rounded-full bg-white shadow-md border border-gray-150 flex items-center justify-center text-gray-500 hover:text-black hover:shadow-lg transition-all cursor-pointer"
              aria-label="Previous major"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </button>

            <div 
              ref={carouselRef}
              className="flex flex-row overflow-x-auto gap-4 sm:gap-8 px-6 sm:px-8 py-4 w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
            >
              {MAJORS.map((m) => {
                const isSelected = selectedMajor === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMajor(m.id)}
                    className="flex flex-col items-center gap-3 sm:gap-4 cursor-pointer select-none shrink-0"
                  >
                    {/* Circle Ellipse with Shadow */}
                    <div 
                      className={`w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] md:w-[200px] md:h-[200px] rounded-full flex items-center justify-center transition-all duration-300 relative group/circle border-2 ${
                        isSelected 
                          ? 'shadow-lg scale-102' 
                          : 'border-gray-100 shadow-md hover:border-gray-300 hover:scale-105'
                      }`}
                      style={{ 
                        borderColor: isSelected ? m.color : undefined,
                        background: isSelected 
                          ? `linear-gradient(135deg, ${m.color} 0%, ${m.color}cc 100%)` 
                          : 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)' 
                      }}
                    >
                      {/* Initials Text */}
                      <span 
                        className={`font-serif text-[24px] sm:text-[28px] md:text-[42px] font-extrabold tracking-wider select-none transition-colors duration-300 ${
                          isSelected ? 'text-white' : 'opacity-80'
                        }`}
                        style={{ color: isSelected ? '#FFFFFF' : m.color }}
                      >
                        {m.initials}
                      </span>
                    </div>
                    
                    {/* Centered Name / Download Link */}
                    <a
                      href={m.pdfUrl}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-serif text-[13px] sm:text-[14px] md:text-[18px] font-bold text-center underline tracking-wide max-w-[130px] sm:max-w-[160px] md:max-w-[200px] transition-colors leading-tight"
                      style={{ color: isSelected ? m.color : '#000000' }}
                    >
                      {t(m.nameKey)}
                    </a>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => scrollCarousel('right')}
              className="absolute right-[-8px] sm:right-[-16px] z-10 w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] md:w-[76px] md:h-[76px] rounded-full bg-white shadow-md border border-gray-150 flex items-center justify-center text-gray-500 hover:text-black hover:shadow-lg transition-all cursor-pointer"
              aria-label="Next major"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Horizontal Tabs Bar */}
          <div className="flex flex-row items-center overflow-x-auto gap-10 border-b border-gray-100 pb-0.5 mb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(['about', 'structure', 'tuition', 'admission'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-serif text-[20px] md:text-[28px] lg:text-[32px] font-bold cursor-pointer relative bg-transparent border-none transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab ? 'text-black' : 'text-[#6D6D6D] hover:text-black/80'
                }`}
              >
                {t(`tab_${tab}`)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="curriculumTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#de5d8f] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Information Details */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + selectedMajor}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                
                {/* 1. เกี่ยวกับหลักสูตร (About Tab) - Horizontal Layout */}
                {activeTab === 'about' && (
                  <div className="flex flex-col lg:flex-row items-stretch gap-10 w-full">
                    {/* Left: Aspect Image Placeholder */}
                    <div 
                      className={`w-full lg:w-[514px] min-h-[300px] lg:h-[490px] rounded-2xl flex flex-col items-center justify-center p-8 bg-gradient-to-br ${activeMajor.bgGradient} border border-gray-100 shadow-xs shrink-0`}
                    >
                      <div className="w-20 h-20 rounded-full bg-white shadow-xs flex items-center justify-center mb-4">
                        <BookOpen className="w-10 h-10" style={{ color: activeMajor.color }} />
                      </div>
                      <span className="text-[20px] font-bold text-black text-center">{t(activeMajor.nameKey)}</span>
                      <span className="text-[13px] text-gray-400 font-sans mt-1">Faculty of Arts, Chulalongkorn University</span>
                      
                      <Button
                        onClick={() => window.open(activeMajor.pdfUrl, '_blank')}
                        variant="primary"
                        className="mt-8 shadow-xs border-none font-serif text-[14px] h-[44px] rounded-[10px]"
                        style={{ backgroundColor: activeMajor.color }}
                      >
                        <Download size={14} />
                        {t('download_pdf')}
                      </Button>
                    </div>

                    {/* Right: Gray Description Block */}
                    <div className="w-full bg-[#F2F2F2] rounded-2xl p-8 md:p-12 flex flex-col justify-center gap-6">
                      <p className="text-[17px] md:text-[20px] text-black leading-relaxed font-serif text-justify whitespace-pre-line">
                        {t(activeMajor.descKey)}
                      </p>
                      
                      <div className="border-t border-gray-300 pt-6 flex flex-col gap-2">
                        <h5 className="text-[15px] font-bold text-[#6D6D6D] uppercase tracking-wide">
                          {t('admission.requirements_title')}
                        </h5>
                        <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed text-justify">
                          {t(activeMajor.reqKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. โครงสร้างหลักสูตร (Structure Tab) - Stacked Gray/Pink Accordions */}
                {activeTab === 'structure' && (
                  <div className="flex flex-col gap-6">
                    {/* Header Credits Summary */}
                    <h3 className="text-[20px] md:text-[28px] font-bold text-black font-serif leading-tight">
                      {t('total_credits_label')} {activeMajor.creditsRange} {t('credits')} &nbsp;|&nbsp; {t('duration_label')} {t('duration_val')}
                    </h3>

                    {/* Collapsible Container */}
                    <div className="flex flex-col gap-4">
                      {activeMajor.structure.map((item, idx) => {
                        const isExpanded = expandedStructure === idx;
                        return (
                          <div 
                            key={idx}
                            className={`rounded-2xl transition-all duration-300 ${
                              isExpanded 
                                ? 'bg-[#de5d8f] text-white p-6 shadow-md' 
                                : 'bg-[#F2F2F2] text-[#404040] px-6 py-1 border border-gray-250/20'
                            }`}
                          >
                            <button
                              onClick={() => setExpandedStructure(isExpanded ? null : idx)}
                              className="w-full flex items-center justify-between py-4 cursor-pointer text-left border-none bg-transparent"
                            >
                              <span className={`text-[20px] md:text-[28px] font-bold ${isExpanded ? 'text-white' : 'text-[#404040]'}`}>
                                {t(item.titleKey)}
                              </span>
                              <ChevronDown 
                                className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'text-white rotate-180' : 'text-[#636363]'}`} 
                              />
                            </button>

                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="pb-4 pt-2 flex flex-col gap-4 font-serif">
                                    {idx === 0 && (
                                      <div className="flex flex-col gap-3">
                                        <h6 className="text-[16px] md:text-[18px] font-bold text-white/95">
                                          กลุ่มวิชาบังคับพื้นฐาน
                                        </h6>
                                        <ul className="flex flex-col gap-2 text-[14px] md:text-[16px] text-white/80 list-disc pl-5">
                                          <li>{t('subjects.b1111')}</li>
                                          <li>{t('subjects.b1112')}</li>
                                          <li>{t('subjects.b1121')}</li>
                                          <li>{t('subjects.b1122')}</li>
                                          <li>{t('subjects.b1211')}</li>
                                          <li>{t('subjects.b1221')}</li>
                                        </ul>
                                      </div>
                                    )}
                                    {idx === 1 && (
                                      <div className="flex flex-col gap-3">
                                        <h6 className="text-[16px] md:text-[18px] font-bold text-white/95">
                                          กลุ่มวิชาเอกบังคับเฉพาะสาขา
                                        </h6>
                                        <p className="text-[14px] md:text-[16px] text-white/80 leading-relaxed text-justify">
                                          {t(item.descKey)}
                                        </p>
                                      </div>
                                    )}
                                    {idx === 2 && (
                                      <div className="flex flex-col gap-3">
                                        <h6 className="text-[16px] md:text-[18px] font-bold text-white/95">
                                          กลุ่มวิชาศึกษาทั่วไปที่แนะนำ
                                        </h6>
                                        <ul className="flex flex-col gap-2 text-[14px] md:text-[16px] text-white/80 list-disc pl-5">
                                          <li>{t('subjects.g227')}</li>
                                          <li>{t('subjects.g105')}</li>
                                          <li>{t('subjects.g261')}</li>
                                          <li>{t('subjects.g261n')}</li>
                                        </ul>
                                      </div>
                                    )}
                                    <div className="text-[13px] md:text-[14px] font-bold text-white/70 border-t border-white/20 pt-3">
                                      {t('total_credits_label')} {item.credits} {t('credits')}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. ค่าเล่าเรียน (Tuition Tab) - Stacked Gray/Pink Accordions */}
                {activeTab === 'tuition' && (
                  <div className="flex flex-col gap-6">
                    <h3 className="text-[20px] md:text-[28px] font-bold text-black font-serif leading-tight">
                      {t('tuition_rates')}
                    </h3>

                    {/* Collapsible Container */}
                    <div className="flex flex-col gap-4">
                      
                      {/* Accordion 1: B.A. */}
                      <div 
                        className={`rounded-2xl transition-all duration-300 ${
                          expandedTuition === 0 
                            ? 'bg-[#de5d8f] text-white p-6 shadow-md' 
                            : 'bg-[#F2F2F2] text-[#404040] px-6 py-1 border border-gray-250/20'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedTuition(expandedTuition === 0 ? null : 0)}
                          className="w-full flex items-center justify-between py-4 cursor-pointer text-left border-none bg-transparent"
                        >
                          <span className={`text-[20px] md:text-[28px] font-bold ${expandedTuition === 0 ? 'text-white' : 'text-[#404040]'}`}>
                            {t('tuition_regular')}
                          </span>
                          <ChevronDown 
                            className={`w-6 h-6 transition-transform duration-300 ${expandedTuition === 0 ? 'text-white rotate-180' : 'text-[#636363]'}`} 
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedTuition === 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="pb-4 pt-2 flex flex-col gap-4 font-serif">
                                <p className="text-[14px] md:text-[16px] text-white/80 leading-normal">
                                  {t('tuition_regular_desc')}
                                </p>
                                <div className="flex flex-col gap-2.5 border-t border-white/20 pt-4 text-[15px] md:text-[18px] text-white">
                                  <div>{t('tuition_details.regular.sem_regular')}</div>
                                  <div>{t('tuition_details.regular.sem_summer')}</div>
                                  <div>{t('tuition_details.regular.sem_inter')}</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Accordion 2: BALAC */}
                      <div 
                        className={`rounded-2xl transition-all duration-300 ${
                          expandedTuition === 1 
                            ? 'bg-[#de5d8f] text-white p-6 shadow-md' 
                            : 'bg-[#F2F2F2] text-[#404040] px-6 py-1 border border-gray-250/20'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedTuition(expandedTuition === 1 ? null : 1)}
                          className="w-full flex items-center justify-between py-4 cursor-pointer text-left border-none bg-transparent"
                        >
                          <span className={`text-[20px] md:text-[28px] font-bold ${expandedTuition === 1 ? 'text-white' : 'text-[#404040]'}`}>
                            {t('tuition_international')}
                          </span>
                          <ChevronDown 
                            className={`w-6 h-6 transition-transform duration-300 ${expandedTuition === 1 ? 'text-white rotate-180' : 'text-[#636363]'}`} 
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedTuition === 1 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="pb-4 pt-2 flex flex-col gap-4 font-serif">
                                <p className="text-[14px] md:text-[16px] text-white/80 leading-normal">
                                  {t('tuition_international_desc')}
                                </p>
                                <div className="flex flex-col gap-2.5 border-t border-white/20 pt-4 text-[15px] md:text-[18px] text-white">
                                  <div>{t('tuition_details.balac.sem_thai')}</div>
                                  <div>{t('tuition_details.balac.sem_inter')}</div>
                                  <div>{t('tuition_details.balac.sem_summer')}</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </div>
                )}

                {/* 4. ข้อมูลการรับสมัคร (Admission Tab) */}
                {activeTab === 'admission' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                      <h3 className="text-[20px] md:text-[28px] font-bold text-black font-serif leading-tight">
                        {t('admission_title')}
                      </h3>

                      <Button
                        onClick={() => window.open("https://course.mytcas.com/universities/001/faculties/22/fields/90_43", "_blank")}
                        variant="outline"
                        className="font-serif border-black text-black bg-white hover:bg-gray-50 h-[44px] rounded-[10px]"
                      >
                        {t('visit_mytcas_btn')}
                        <ExternalLink size={14} />
                      </Button>
                    </div>

                    <p className="text-[15px] md:text-[17px] text-gray-500 leading-relaxed -mt-2">
                      {t('admission_desc')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col gap-3 shadow-2xs">
                        <span className="w-8 h-8 rounded-full bg-black/5 text-black flex items-center justify-center text-[15px] font-bold">1</span>
                        <h5 className="font-bold text-[16px] md:text-[18px] text-black leading-tight">{t('admission.tcas_round1')}</h5>
                        <p className="text-[13px] md:text-[15px] text-gray-500 leading-relaxed text-justify">{t('admission.tcas_round1_desc')}</p>
                      </div>

                      <div className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col gap-3 shadow-2xs">
                        <span className="w-8 h-8 rounded-full bg-black/5 text-black flex items-center justify-center text-[15px] font-bold">2</span>
                        <h5 className="font-bold text-[16px] md:text-[18px] text-black leading-tight">{t('admission.tcas_round2')}</h5>
                        <p className="text-[13px] md:text-[15px] text-gray-500 leading-relaxed text-justify">{t('admission.tcas_round2_desc')}</p>
                      </div>

                      <div className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col gap-3 shadow-2xs">
                        <span className="w-8 h-8 rounded-full bg-black/5 text-black flex items-center justify-center text-[15px] font-bold">3</span>
                        <h5 className="font-bold text-[16px] md:text-[18px] text-black leading-tight">{t('admission.tcas_round3')}</h5>
                        <p className="text-[13px] md:text-[15px] text-gray-500 leading-relaxed text-justify">{t('admission.tcas_round3_desc')}</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-150 flex flex-col gap-3.5 mt-2">
                      <h5 className="font-bold text-[16px] text-black flex items-center gap-2">
                        {t('admission.requirements_title')}
                      </h5>
                      <ul className="flex flex-col gap-2.5 text-[14px] md:text-[16px] text-gray-600 pl-4 list-disc">
                        <li>{t('admission.gpa_req')}</li>
                        <li>{t('admission.tgas_req')}</li>
                      </ul>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
