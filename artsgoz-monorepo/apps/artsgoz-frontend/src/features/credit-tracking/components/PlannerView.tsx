import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Trash2, Check, X, Sparkles } from 'lucide-react';
import type { Subject, SubjectCategory, AcademicProfile } from '../types.js';
import { SystemBanner } from '../../../components/SystemBanner/index.js';
import { motion, AnimatePresence } from 'framer-motion';
import { getMajorGroups, getMinorGroups, getGroupLabel } from '../utils/subjectGenerator.js';

interface PlannerViewProps {
  subjects: Subject[];
  onToggleSubject: (id: string) => void;
  onAddSubject: (newSubject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  profile: AcademicProfile;
  onConfirmPlan?: () => void;
}

export function PlannerView({
  subjects,
  onToggleSubject,
  onAddSubject,
  onDeleteSubject,
  profile,
  onConfirmPlan,
}: PlannerViewProps) {
  const { t } = useTranslation('credit_tracking');

  // Collapse/Expand state for sub-groups (defaults to expanded unless false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('planner_expanded_groups');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load planner_expanded_groups', e);
      }
    }
    return {};
  });

  // Active custom subject deletion confirmation ID state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Translation key helper to strip any legacy credit_tracking. prefix
  const translateKey = (key: string): string => {
    if (!key) return '';
    const cleanKey = key.replace(/^credit_tracking\./, '');
    return t(cleanKey);
  };

  // Add custom subject modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetCategory, setTargetCategory] = useState<SubjectCategory>('categories.general');
  const [targetGroup, setTargetGroup] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseNameTh, setCourseNameTh] = useState('');
  const [courseCredits, setCourseCredits] = useState('3');
  const [courseSemester, setCourseSemester] = useState('1');

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Group helper – subjects now store the canonical group key directly
  const getSubjectGroup = (subject: Subject): string => {
    if (subject.group) return subject.group.replace(/^credit_tracking\./, '');
    if (subject.category === 'categories.basic' || subject.category === 'credit_tracking.categories.basic') {
      return 'planner.groups.basic.g1';
    }
    if (subject.category === 'categories.general' || subject.category === 'credit_tracking.categories.general') {
      return 'planner.groups.general.g1';
    }
    if (subject.category === 'categories.free' || subject.category === 'credit_tracking.categories.free') {
      return 'planner.groups.free.g1';
    }
    if (subject.category === 'categories.major' || subject.category === 'credit_tracking.categories.major') {
      return 'major-compulsory';
    }
    if (subject.category === 'categories.minor' || subject.category === 'credit_tracking.categories.minor') {
      return 'minor-compulsory';
    }
    return '';
  };

  // Dynamically derive major/minor groups from loaded subjects
  const dynamicMajorGroups = useMemo(() => getMajorGroups(subjects), [subjects]);
  const dynamicMinorGroups = useMemo(() => getMinorGroups(subjects), [subjects]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = {
        ...prev,
        [groupName]: prev[groupName] === false ? true : false,
      };
      try {
        localStorage.setItem('planner_expanded_groups', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save planner_expanded_groups', e);
      }
      return next;
    });
  };

  const isGroupExpanded = (groupName: string): boolean => {
    return expandedGroups[groupName] !== false; // defaults to true (open)
  };

  const openAddCourse = (category: SubjectCategory, groupName: string) => {
    setTargetCategory(category);
    setTargetGroup(groupName);
    setCourseCode('');
    setCourseNameTh('');
    setCourseCredits('3');
    setCourseSemester('1');
    setShowAddModal(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseNameTh.trim()) {
      alert(t('planner.fill_alert'));
      return;
    }

    const newSubject: Subject = {
      id: `custom-${Date.now()}`,
      code: courseCode.trim(),
      nameKey: courseNameTh.trim(), // custom subject input serves directly as the name key
      credits: Number(courseCredits) || 3,
      category: targetCategory,
      group: targetGroup,
      completed: false,
      isCustom: true,
      semester: Number(courseSemester) || 1,
    };

    onAddSubject(newSubject);
    setShowAddModal(false);
  };

  const handleConfirmAction = () => {
    setShowConfirmModal(false);
    setSuccessBanner(t('planner.success_banner'));
    setTimeout(() => setSuccessBanner(null), 4000);
    if (onConfirmPlan) {
      setTimeout(() => {
        onConfirmPlan();
      }, 800);
    }
  };

  const getCategoryCredits = (cat: SubjectCategory): string => {
    const cleanCat = cat.replace(/^credit_tracking\./, '');
    if (cleanCat === 'categories.basic') return t('curriculum.credits_val', { count: 27 });
    if (cleanCat === 'categories.general') return t('curriculum.credits_val', { count: 30 });
    if (cleanCat === 'categories.free') return t('curriculum.credits_val', { count: 6 });
    if (cleanCat === 'categories.major') return t('curriculum.credits_val', { count: 48 });
    if (cleanCat === 'categories.minor') return t('curriculum.credits_val', { count: 18 });
    return '';
  };

  const leftSections: { category: SubjectCategory; instructionsKeys?: string[]; groups: string[] }[] = [
    {
      category: 'categories.basic',
      instructionsKeys: [
        'planner.instructions.basic1',
        'planner.instructions.basic2',
      ],
      groups: ['planner.groups.basic.g1'],
    },
    {
      category: 'categories.general',
      groups: ['planner.groups.general.g1'],
    },
    {
      category: 'categories.free',
      groups: ['planner.groups.free.g1'],
    },
  ];

  const rightSections: { category: SubjectCategory; groups: string[] }[] = [
    {
      category: 'categories.major',
      groups: dynamicMajorGroups.length > 0 ? dynamicMajorGroups : ['major-compulsory', 'major-specified', 'major-specialized'],
    },
    {
      category: 'categories.minor',
      groups: dynamicMinorGroups.length > 0 ? dynamicMinorGroups : ['minor-compulsory', 'minor-elective'],
    },
  ];

  const canAddCustom = (category: SubjectCategory, group: string): boolean => {
    if (category === 'categories.general' || category === 'credit_tracking.categories.general') return true;
    if (category === 'categories.free' || category === 'credit_tracking.categories.free') return true;
    if ((category === 'categories.major' || category === 'credit_tracking.categories.major') &&
        (group === 'major-specified' || group === 'major-specialized' || group === 'major-elective' || group === 'major-required-elective')) return true;
    if ((category === 'categories.minor' || category === 'credit_tracking.categories.minor') &&
        (group === 'minor-elective' || group === 'minor-required-elective')) return true;
    return false;
  };

  const getColTotalCredits = (categoriesList: SubjectCategory[]): number => {
    return subjects
      .filter((s) => categoriesList.includes(s.category))
      .reduce((sum, s) => sum + s.credits, 0);
  };

  const getSubjectRemark = (sub: Subject): string => {
    if (sub.isCustom) return t('planner.custom_remark');
    return '';
  };

  const renderSubjectRow = (sub: Subject) => {
    const isDeleting = deletingId === sub.id;

    if (isDeleting) {
      return (
        <div
          key={sub.id}
          className="grid grid-cols-[20px_90px_1fr] gap-x-6 items-start py-3.5 bg-[#FFF5F7] rounded-[6px] px-2 border border-[#D52048]/10 animate-fade-in min-w-0"
        >
          <span></span>
          <span className="font-mono text-[#D52048] text-[16px] font-bold pt-0.5">
            {sub.code}
          </span>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 min-w-0 flex-1">
            <div className="flex flex-col min-w-0">
              <span className="text-[#D52048] text-[16px] font-bold leading-snug break-words">
                {sub.nameKey}
              </span>
              <span className="text-[#EA6D24] text-[14px] italic mt-0.5 font-bold truncate">
                {getSubjectRemark(sub)}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-center">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex items-center justify-center bg-[#A6CE8F] hover:bg-[#92b87c] text-[#000000] rounded-[8px] h-[36px] px-4 text-[14px] font-bold transition-colors cursor-pointer border-none"
              >
                {t('planner.btn_cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteSubject(sub.id);
                  setDeletingId(null);
                }}
                className="flex items-center justify-center bg-[#EE4F72] hover:bg-[#d94363] text-white rounded-[8px] h-[36px] px-4 gap-1.5 text-[14px] font-bold transition-colors cursor-pointer border-none"
              >
                <Trash2 size={14} />
                <span>{t('planner.btn_delete')}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={sub.id}
        className="grid grid-cols-[20px_90px_1fr_60px] gap-x-6 items-start py-3.5 hover:bg-black/[0.02] rounded-[6px] px-1 transition-colors text-[16px] min-w-0"
      >
        <button
          type="button"
          onClick={() => onToggleSubject(sub.id)}
          className={`w-[20px] h-[20px] shrink-0 border rounded flex items-center justify-center transition-all mt-1 cursor-pointer ${
            sub.completed
              ? 'bg-white border-[#8B8B8C] text-black'
              : 'border-[#D0D0D1] bg-white hover:border-[#DE5D8F]'
          }`}
        >
          {sub.completed && <Check size={12} strokeWidth={3} className="text-black" />}
        </button>

        <span className="font-mono text-[#000000] text-[16px] pt-0.5 shrink-0">
          {sub.code}
        </span>

        <div className="flex flex-col min-w-0">
          <span className="text-black text-[16px] font-normal leading-snug break-words">
            {sub.nameKey}
          </span>
          <span className="text-[#EA6D24] text-[15px] italic mt-0.5 truncate">
            {getSubjectRemark(sub)}
          </span>
        </div>

        <div className="flex items-start justify-end gap-2 text-right shrink-0">
          <span className="font-mono text-black text-[16px] pt-0.5 pr-1">
            {sub.credits}
          </span>
          {sub.isCustom && (
            <button
              type="button"
              onClick={() => setDeletingId(sub.id)}
              className="text-[#6D6D6D] hover:text-[#EE4F72] cursor-pointer transition-colors p-0.5 mt-0.5 border-none bg-transparent"
              aria-label={t('planner.btn_delete')}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full font-[ChulaCharasNew] pb-20 text-black min-w-0">
      {/* Success Banner Notification */}
      {successBanner && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 shadow-lg animate-fade-in min-w-[320px] md:min-w-[480px]">
          <SystemBanner
            type="success"
            emphasis="subtle"
            message={successBanner}
          />
        </div>
      )}

      {/* Top Controller Row */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between border-b border-[#D0D0D1]/30 pb-6 mb-8 gap-4 min-w-0">
        <div className="min-w-0">
          <h3 className="text-black text-[28px] font-bold truncate">{t('planner.title')}</h3>
          <p className="text-[#6D6D6D] text-[18px] break-words">{t('planner.desc')}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="flex items-center justify-center bg-[#64A93C] hover:bg-[#528f2e] text-white rounded-[8px] h-[52px] px-8 gap-2 text-[16px] font-bold shadow-md cursor-pointer transition-all shrink-0 border-none"
        >
          <span>{t('planner.confirm_info')}</span>
        </button>
      </div>

      {/* Dropdown 2-Column Columns Workspace Container */}
      <div className="w-full flex flex-col xl:flex-row gap-8 justify-center items-start min-w-0">
        {/* Left Column */}
        <div className="w-full xl:w-[518px] flex flex-col gap-8 shrink-0 min-w-0">
          <div className="w-full h-[60px] bg-[#E992B4] rounded-[8px] px-5 flex items-end justify-between pb-3">
            <span className="text-[#000000] text-[18px] font-bold truncate pr-2">{t('curriculum.title')}</span>
            <span className="text-[#000000] text-[16px] font-bold shrink-0">
              {t('planner.total_credits', { credits: getColTotalCredits(['categories.basic', 'categories.general', 'categories.free', 'credit_tracking.categories.basic', 'credit_tracking.categories.general', 'credit_tracking.categories.free']) })}
            </span>
          </div>

          {/* Left Column Sections */}
          {leftSections.map((sec) => (
            <div key={sec.category} className="w-full flex flex-col gap-6 min-w-0">
              {/* Soft Pink Header */}
              <div className="w-full h-[60px] bg-[#F5CDDC] rounded-[8px] px-5 flex items-end justify-between pb-3">
                <span className="text-black text-[18px] font-bold truncate pr-2">{translateKey(sec.category)}</span>
                <span className="text-black text-[18px] font-bold shrink-0">
                  {getCategoryCredits(sec.category)}
                </span>
              </div>

              {/* Detail Content */}
              <div className="flex flex-col gap-6 mt-2 min-w-0">
                {sec.instructionsKeys && (
                  <div className="flex flex-col gap-2 text-black text-[16px] leading-relaxed">
                    {sec.instructionsKeys.map((instKey) => (
                      <p key={instKey} className="break-words">{translateKey(instKey)}</p>
                    ))}
                  </div>
                )}

                {/* Collapsible Accordion Groups */}
                {sec.groups.map((group) => {
                  const groupSubjects = subjects.filter(
                    (s) => s.category === sec.category && getSubjectGroup(s) === group
                  );
                  const isExpanded = isGroupExpanded(group);

                  return (
                    <div key={group} className="w-full flex flex-col min-w-0 border-b border-[#D0D0D1]/20 pb-2">
                      <div
                        onClick={() => toggleGroup(group)}
                        className="flex items-center justify-between cursor-pointer py-3 hover:opacity-80 transition-opacity"
                      >
                        <span className="text-[16px] font-bold text-black flex-1 pr-4 break-words">
                          {getGroupLabel(group)}
                        </span>
                        <ChevronDown
                          size={20}
                          className="text-black shrink-0 transition-transform duration-300 ease-in-out"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="w-full overflow-hidden"
                          >
                            <div className="w-full mt-2 flex flex-col pb-3 min-w-0">

                              {groupSubjects.length > 0 && (
                                <div className="w-full flex flex-col min-w-0 overflow-auto">
                                  {/* Header row */}
                                  <div className="grid grid-cols-[20px_90px_1fr_60px] gap-x-6 items-center text-black font-bold text-[16px] pb-2 border-b border-[#D0D0D1]/30 min-w-[320px]">
                                    <span></span>
                                    <span className="text-left">{t('planner.col_code')}</span>
                                    <span className="text-left">{t('planner.col_name')}</span>
                                    <span className="text-right">{t('planner.col_credits')}</span>
                                  </div>

                                  {/* Subject Rows */}
                                  <div className="flex flex-col gap-0.5 mt-2 min-w-[320px]">
                                    {groupSubjects.map((sub) => renderSubjectRow(sub))}
                                  </div>
                                </div>
                              )}

                              {groupSubjects.length === 0 && (
                                <p className="text-center text-[#99999A] py-3 text-[14px] italic break-words">
                                  {t('planner.empty_group')}
                                </p>
                              )}

                              {/* Plus Add Button */}
                              {canAddCustom(sec.category, group) && (
                                <button
                                  type="button"
                                  onClick={() => openAddCourse(sec.category, group)}
                                  className="w-[48px] h-[48px] bg-[#E992B4] hover:bg-[#DE5D8F] text-white rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md mx-auto mt-4 border-none"
                                  title={t('planner.add_course_title')}
                                >
                                  <Plus size={24} />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="w-full xl:w-[518px] flex flex-col gap-8 shrink-0 min-w-0">
          <div className="w-full h-[60px] bg-[#E992B4] rounded-[8px] px-5 flex items-end justify-between pb-3">
            <span className="text-[#000000] text-[18px] font-bold truncate pr-2">
              {t('profile.major_label')}: {profile.major && profile.major !== 'profile.select_major' && profile.major !== 'credit_tracking.profile.select_major' ? translateKey(profile.major) : t('majors.default')}
            </span>
            <span className="text-[#000000] text-[16px] font-bold shrink-0">
              {t('planner.total_credits', { credits: getColTotalCredits(['categories.major', 'categories.minor', 'credit_tracking.categories.major', 'credit_tracking.categories.minor']) })}
            </span>
          </div>

          {/* Right Column Sections */}
          {rightSections.map((sec) => (
            <div key={sec.category} className="w-full flex flex-col gap-6 min-w-0">
              <div className="w-full h-[60px] bg-[#F5CDDC] rounded-[8px] px-5 flex items-end justify-between pb-3">
                <span className="text-black text-[18px] font-bold truncate pr-2">{translateKey(sec.category)}</span>
                <span className="text-black text-[18px] font-bold shrink-0">
                  {getCategoryCredits(sec.category)}
                </span>
              </div>

              {/* Detail Content */}
              <div className="flex flex-col gap-6 mt-2 min-w-0">
                {sec.groups.map((group) => {
                  const groupSubjects = subjects.filter(
                    (s) => s.category === sec.category && getSubjectGroup(s) === group
                  );
                  const isExpanded = isGroupExpanded(group);

                  return (
                    <div key={group} className="w-full flex flex-col min-w-0 border-b border-[#D0D0D1]/20 pb-2">
                      <div
                        onClick={() => toggleGroup(group)}
                        className="flex items-center justify-between cursor-pointer py-3 hover:opacity-80 transition-opacity"
                      >
                        <span className="text-[16px] font-bold text-black flex-1 pr-4 break-words">
                          {getGroupLabel(group)}
                        </span>
                        <ChevronDown
                          size={20}
                          className="text-black shrink-0 transition-transform duration-300 ease-in-out"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="w-full overflow-hidden"
                          >
                            <div className="w-full mt-2 flex flex-col pb-3 min-w-0">

                              {groupSubjects.length > 0 && (
                                <div className="w-full flex flex-col min-w-0 overflow-auto">
                                  {/* Header row */}
                                  <div className="grid grid-cols-[20px_90px_1fr_60px] gap-x-6 items-center text-black font-bold text-[16px] pb-2 border-b border-[#D0D0D1]/30 min-w-[320px]">
                                    <span></span>
                                    <span className="text-left">{t('planner.col_code')}</span>
                                    <span className="text-left">{t('planner.col_name')}</span>
                                    <span className="text-right">{t('planner.col_credits')}</span>
                                  </div>

                                  {/* Subject Rows */}
                                  <div className="flex flex-col gap-0.5 mt-2 min-w-[320px]">
                                    {groupSubjects.map((sub) => renderSubjectRow(sub))}
                                  </div>
                                </div>
                              )}

                              {groupSubjects.length === 0 && (
                                <p className="text-center text-[#99999A] py-3 text-[14px] italic break-words">
                                  {t('planner.empty_group')}
                                </p>
                              )}

                              {/* Plus Add Button */}
                              {canAddCustom(sec.category, group) && (
                                <button
                                  type="button"
                                  onClick={() => openAddCourse(sec.category, group)}
                                  className="w-[48px] h-[48px] bg-[#E992B4] hover:bg-[#DE5D8F] text-white rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md mx-auto mt-4 border-none"
                                  title={t('planner.add_course_title')}
                                >
                                  <Plus size={24} />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Subject Overlay Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-[ChulaCharasNew]">
          <div className="bg-white border border-[#D0D0D1]/30 rounded-[16px] shadow-2xl p-6 md:p-8 max-w-[500px] w-full text-black">
            <div className="flex items-center justify-between border-b border-[#D0D0D1]/20 pb-4 mb-6">
              <h3 className="text-[22px] font-bold flex items-center gap-2 text-[#DE5D8F] truncate">
                <Sparkles size={20} />
                <span>{t('planner.add_course_title')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#6D6D6D] hover:text-black cursor-pointer p-1 border-none bg-transparent"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-[14px] font-bold text-[#6D6D6D]">{t('planner.selected_group_label')}</label>
                <div className="bg-[#F7F8F9] px-3 py-2.5 rounded-[8px] text-[15px] font-bold text-black border border-[#D0D0D1]/30 truncate">
                  {getGroupLabel(targetGroup)}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-course-code" className="text-[14px] font-bold text-[#6D6D6D]">{t('planner.course_code_label')} *</label>
                <input
                  type="text"
                  id="modal-course-code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder={t('planner.placeholder_code')}
                  required
                  className="w-full border border-[#D0D0D1] hover:border-[#DE5D8F]/50 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-[8px] px-3 h-[42px] outline-none text-[16px] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-course-name-th" className="text-[14px] font-bold text-[#6D6D6D]">{t('planner.course_name_th_label')} *</label>
                <input
                  type="text"
                  id="modal-course-name-th"
                  value={courseNameTh}
                  onChange={(e) => setCourseNameTh(e.target.value)}
                  placeholder={t('planner.placeholder_name')}
                  required
                  className="w-full border border-[#D0D0D1] hover:border-[#DE5D8F]/50 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-[8px] px-3 h-[42px] outline-none text-[16px] transition-all"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="modal-course-credits" className="text-[14px] font-bold text-[#6D6D6D]">{t('planner.col_credits')}</label>
                  <select
                    id="modal-course-credits"
                    value={courseCredits}
                    onChange={(e) => setCourseCredits(e.target.value)}
                    className="w-full border border-[#D0D0D1] hover:border-[#DE5D8F]/50 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-[8px] px-3 h-[42px] outline-none text-[16px] transition-all bg-white"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="modal-course-semester" className="text-[14px] font-bold text-[#6D6D6D]">{t('planner.semester_label')}</label>
                  <select
                    id="modal-course-semester"
                    value={courseSemester}
                    onChange={(e) => setCourseSemester(e.target.value)}
                    className="w-full border border-[#D0D0D1] hover:border-[#DE5D8F]/50 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-[8px] px-3 h-[42px] outline-none text-[16px] transition-all bg-white"
                  >
                    <option value="1">{t('planner.semesters.1')}</option>
                    <option value="2">{t('planner.semesters.2')}</option>
                    <option value="3">{t('planner.semesters.3')}</option>
                    <option value="4">{t('planner.semesters.4')}</option>
                    <option value="5">{t('planner.semesters.5')}</option>
                    <option value="6">{t('planner.semesters.6')}</option>
                    <option value="7">{t('planner.semesters.7')}</option>
                    <option value="8">{t('planner.semesters.8')}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D0D0D1]/20 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 h-[42px] rounded-[8px] font-bold text-[#6D6D6D] hover:text-black transition-colors cursor-pointer border-none bg-transparent"
                >
                  {t('planner.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-[#E992B4] hover:bg-[#DE5D8F] text-white font-bold px-6 h-[42px] rounded-[8px] shadow-sm transition-colors cursor-pointer border-none"
                >
                  {t('planner.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-[ChulaCharasNew]">
          <div className="bg-white border border-[#D0D0D1]/30 rounded-[16px] shadow-2xl p-6 md:p-8 max-w-[480px] w-full text-black">
            <h3 className="text-black text-[22px] font-bold mb-4">{t('planner.confirm_modal_title')}</h3>
            <p className="text-[#6D6D6D] text-[16px] leading-relaxed mb-6">
              {t('planner.confirm_modal_desc')}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-5 h-[42px] rounded-[8px] font-bold text-[#6D6D6D] hover:text-black transition-colors cursor-pointer border-none bg-transparent"
              >
                {t('planner.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="bg-[#64A93C] hover:bg-[#528f2e] text-white font-bold px-6 h-[42px] rounded-[8px] shadow-md transition-colors cursor-pointer border-none"
              >
                {t('planner.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
