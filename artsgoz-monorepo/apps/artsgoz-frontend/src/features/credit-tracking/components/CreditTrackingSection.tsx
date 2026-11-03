import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { AcademicProfile, Subject, CategoryProgress } from '../types.js';
import { CATEGORIES_CONFIG, MAJOR_OPTIONS, MINOR_OPTIONS, CURRICULUM_OPTIONS } from '../constants.js';
import { DropdownMenuContainer } from './DropdownMenuContainer.js';
import { PDPAForm } from './PDPAForm.js';
import { ProfileSetupForm } from './ProfileSetupForm.js';
import { CreditsSummaryCard } from './CreditsSummaryCard.js';
import { CurriculumView } from './CurriculumView.js';
import { PlannerView } from './PlannerView.js';
import { AcademicTrackerNavBar, type ActiveTab } from './AcademicTrackerNavBar.js';
import { SummaryView } from './SummaryView.js';

import { generateSubjectsForProfile } from '../utils/subjectGenerator.js';

type AppStep = 'pdpa' | 'setup' | 'dashboard';

export function CreditTrackingSection() {
  const { t } = useTranslation('credit_tracking');
  const [step, setStep] = useState<AppStep>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedStep = localStorage.getItem('tracker_step');
        if (savedStep) return savedStep as AppStep;
      } catch (e) {
        console.error('Failed to load tracker_step', e);
      }
    }
    return 'pdpa';
  });
  const [profile, setProfile] = useState<AcademicProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProfile = localStorage.getItem('tracker_profile');
        if (savedProfile) return JSON.parse(savedProfile);
      } catch (e) {
        console.error('Failed to load tracker_profile', e);
      }
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('curriculum');

  const [showSummaryTab, setShowSummaryTab] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tracker_show_summary');
        return saved === 'true';
      } catch (e) {
        console.error('Failed to load tracker_show_summary', e);
      }
    }
    return false;
  });

  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('tracker_last_saved_time') || '';
      } catch (e) {
        console.error('Failed to load tracker_last_saved_time', e);
      }
    }
    return '';
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProfile = localStorage.getItem('tracker_profile');
        const parsedProfile = savedProfile ? JSON.parse(savedProfile) : null;
        if (parsedProfile?.major) {
          const generated = generateSubjectsForProfile(parsedProfile.major, parsedProfile.minor || '');
          const savedSubjects = localStorage.getItem('tracker_subjects');
          if (savedSubjects) {
            const parsed = JSON.parse(savedSubjects) as Subject[];
            const merged = [...parsed];
            generated.forEach((gen) => {
              if (!merged.some((s) => s.code === gen.code)) {
                merged.push(gen);
              }
            });
            return merged;
          }
          return generated;
        }
      } catch (e) {
        console.error('Failed to load tracker_subjects', e);
      }
    }
    return generateSubjectsForProfile('credit_tracking.majors.thai', '');
  });

  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      setStorageError(customEvent.detail?.message || 'ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบการตั้งค่าเบราว์เซอร์');
    };
    window.addEventListener('localstorage-error', handleError);
    return () => window.removeEventListener('localstorage-error', handleError);
  }, []);

  // Save states helper
  const saveState = (newStep: AppStep, newProfile: AcademicProfile | null, newSubjects: Subject[]) => {
    try {
      localStorage.setItem('tracker_step', newStep);
      if (newProfile) {
        localStorage.setItem('tracker_profile', JSON.stringify(newProfile));
      } else {
        localStorage.removeItem('tracker_profile');
      }
      localStorage.setItem('tracker_subjects', JSON.stringify(newSubjects));
    } catch (e) {
      console.error('Failed to save tracker state', e);
      setStorageError('ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบการตั้งค่าเบราว์เซอร์');
    }
  };

  const handleConfirmPDPA = () => {
    setStep('setup');
    saveState('setup', profile, subjects);
  };

  const handleConfirmSetup = (setupProfile: AcademicProfile) => {
    const newSubjects = generateSubjectsForProfile(setupProfile.major, setupProfile.minor);
    setProfile(setupProfile);
    setSubjects(newSubjects);
    setStep('dashboard');
    saveState('dashboard', setupProfile, newSubjects);
  };

  const handleToggleSubject = (id: string) => {
    const nextSubjects = subjects.map((sub) =>
      sub.id === id ? { ...sub, completed: !sub.completed } : sub
    );
    setSubjects(nextSubjects);
    saveState(step, profile, nextSubjects);
  };

  const handleAddSubject = (newSub: Subject) => {
    const nextSubjects = [...subjects, newSub];
    setSubjects(nextSubjects);
    saveState(step, profile, nextSubjects);
  };

  const handleDeleteSubject = (id: string) => {
    const nextSubjects = subjects.filter((sub) => sub.id !== id);
    setSubjects(nextSubjects);
    saveState(step, profile, nextSubjects);
  };

  const handleUpdateMajor = (newMajor: string) => {
    if (!profile) return;
    const newMajorKey = newMajor.replace(/^credit_tracking\./, '').replace(/^majors\./, '');
    const currentMinorKey = profile.minor ? profile.minor.replace(/^credit_tracking\./, '').replace(/^minors\./, '') : '';
    const nextMinor = (newMajorKey && currentMinorKey === newMajorKey) ? 'minors.none' : profile.minor;
    const nextProfile = { ...profile, major: newMajor, minor: nextMinor };
    const nextSubjects = generateSubjectsForProfile(newMajor, nextMinor);
    setProfile(nextProfile);
    setSubjects(nextSubjects);
    saveState(step, nextProfile, nextSubjects);
  };

  const handleUpdateMinor = (newMinor: string) => {
    if (!profile) return;
    const nextProfile = { ...profile, minor: newMinor };
    const nextSubjects = generateSubjectsForProfile(profile.major, newMinor);
    setProfile(nextProfile);
    setSubjects(nextSubjects);
    saveState(step, nextProfile, nextSubjects);
  };

  const handleUpdateCurriculum = (newCurriculum: string) => {
    if (!profile) return;
    const nextProfile = { ...profile, curriculum: newCurriculum };
    setProfile(nextProfile);
    saveState(step, nextProfile, subjects);
  };

  const handleConfirmPlan = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    setShowSummaryTab(true);
    setLastSavedTime(timeStr);
    setActiveTab('summary');

    try {
      localStorage.setItem('tracker_show_summary', 'true');
      localStorage.setItem('tracker_last_saved_time', timeStr);
    } catch (e) {
      console.error('Failed to save summary confirmation state', e);
    }
  };

  // Calculate live progress for each category
  const progressList = useMemo<CategoryProgress[]>(() => {
    return CATEGORIES_CONFIG.map((cfg) => {
      const catCompleted = subjects
        .filter((sub) => sub.category === cfg.category && sub.completed)
        .reduce((sum, sub) => sum + sub.credits, 0);

      return {
        category: cfg.category,
        completed: catCompleted,
        required: cfg.required,
      };
    });
  }, [subjects]);

  // Handle rendering of current step
  if (step === 'pdpa') {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh] px-4">
        <PDPAForm onConfirm={handleConfirmPDPA} />
      </div>
    );
  }

  if (step === 'setup' || !profile) {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh] px-4">
        <ProfileSetupForm onSetupComplete={handleConfirmSetup} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-16 font-[ChulaCharasNew] min-w-0">
      {/* Top Header Section with profile display */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-16 lg:mb-24 min-w-0">
        <div className="min-w-0">
          <h1 className="text-black text-[28px] sm:text-[36px] font-bold leading-none mb-2 truncate">{t('title')}</h1>
          <h2 className="text-[#6D6D6D] text-[16px] sm:text-[20px] font-medium truncate">{t('subtitle')}</h2>
        </div>

        {/* Selected Major/Minor/Curriculum details */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 items-start sm:items-end min-w-0 w-full sm:w-auto">
          <DropdownMenuContainer
            id="select-major"
            label={t('profile.major_label')}
            value={profile.major}
            options={MAJOR_OPTIONS}
            placeholder="profile.select_major"
            onChange={handleUpdateMajor}
            width={220}
          />
          <DropdownMenuContainer
            id="select-minor"
            label={t('profile.minor_label')}
            value={profile.minor}
            options={MINOR_OPTIONS.filter(opt => {
              if (opt === 'profile.select_minor' || opt === 'minors.none') return true;
              const currentMajorKey = profile.major ? profile.major.replace(/^credit_tracking\./, '').replace(/^majors\./, '') : '';
              const minorKey = opt.replace(/^credit_tracking\./, '').replace(/^minors\./, '');
              return minorKey !== currentMajorKey;
            })}
            placeholder="profile.select_minor"
            onChange={handleUpdateMinor}
            width={220}
          />
          <DropdownMenuContainer
            id="select-curriculum"
            label={t('profile.curriculum_label')}
            value={profile.curriculum}
            options={CURRICULUM_OPTIONS}
            placeholder="profile.select_curriculum"
            onChange={handleUpdateCurriculum}
            width={220}
          />
        </div>
      </div>

      {/* Credit Summary */}
      <div className="w-full flex justify-center mt-6 sm:mt-[54px] mb-8 sm:mb-[78px]">
        <CreditsSummaryCard progressList={progressList} />
      </div>

      {/* Navigation Tabs Bar */}
      <div className="w-full max-w-[1062px] mb-10 overflow-hidden">
        <AcademicTrackerNavBar activeTab={activeTab} onTabChange={setActiveTab} showSummary={showSummaryTab} />
      </div>

      {/* Main Tab Views Switch */}
      <div className="mt-8 min-w-0">
        {activeTab === 'curriculum' && (
          <CurriculumView subjects={subjects} onToggleSubject={handleToggleSubject} profile={profile} />
        )}
        {activeTab === 'planner' && (
          <PlannerView
            subjects={subjects}
            onToggleSubject={handleToggleSubject}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
            profile={profile}
            onConfirmPlan={handleConfirmPlan}
          />
        )}
        {activeTab === 'summary' && (
          <SummaryView
            subjects={subjects}
            profile={profile}
            lastSavedTime={lastSavedTime}
          />
        )}
      </div>

      {storageError && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#DE5D8F] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 font-[ChulaCharasNew] text-[15px] font-bold">
          <span>{storageError}</span>
          <button
            type="button"
            onClick={() => setStorageError(null)}
            className="text-white hover:opacity-80 font-bold ml-2 border-none bg-transparent cursor-pointer text-lg leading-none"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
