import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from './useLocalStorage.js';
import type { StudentProfile, YellowCardSubject, YellowCardCategory, TrackerSubject } from '../types.js';
import { DEFAULT_PROFILE, INITIAL_SUBJECTS, LOCAL_STORAGE_KEYS, CATEGORIES_CONFIG } from '../constants.js';
import {
  mapTrackerSubjectToYellowCard,
  mergeImportedSubjects,
} from '../utils/yellowCardUtils.js';

export function useYellowCardState() {
  const navigate = useNavigate();
  const { t } = useTranslation('yellow_card');

  // App step: pdpa agreed or not
  const [pdpaAgreed, setPdpaAgreed] = useLocalStorage<boolean>(
    LOCAL_STORAGE_KEYS.PDPA_AGREED,
    false
  );

  // Core persistent data
  const [profile, setProfile] = useLocalStorage<StudentProfile>(
    LOCAL_STORAGE_KEYS.PROFILE,
    DEFAULT_PROFILE
  );
  const [subjects, setSubjects] = useLocalStorage<YellowCardSubject[]>(
    LOCAL_STORAGE_KEYS.SUBJECTS,
    INITIAL_SUBJECTS
  );

  // UI state
  const [showWarningBanner, setShowWarningBanner] = useState<boolean>(true);
  const [showAdvisorModal, setShowAdvisorModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Ref to hold the success message timeout for proper cleanup
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerSuccessMessage = useCallback((message: string, duration = 3000) => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    setSuccessMessage(message);
    successTimeoutRef.current = setTimeout(() => {
      setSuccessMessage(null);
    }, duration);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handleConfirmPDPA = useCallback(() => {
    setPdpaAgreed(true);
  }, [setPdpaAgreed]);

  const handleProfileChange = useCallback(
    (updatedProfile: StudentProfile) => {
      setProfile(updatedProfile);
    },
    [setProfile]
  );

  const handleUpdateSubject = useCallback(
    (updatedSubject: YellowCardSubject) => {
      setSubjects((prev) =>
        prev.map((sub) => (sub.id === updatedSubject.id ? updatedSubject : sub))
      );
    },
    [setSubjects]
  );

  const handleAddSubject = useCallback(
    (groupName: string) => {
      let category: YellowCardCategory = 'credit_tracking.categories.basic';
      const catConfig = CATEGORIES_CONFIG.find((c) => c.groups.includes(groupName));
      if (catConfig) {
        category = catConfig.category as YellowCardCategory;
      }

      const newSubject: YellowCardSubject = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        code: '',
        nameKey: '',
        semester: '',
        credits: '3',
        grade: '',
        category,
        group: groupName,
      };

      setSubjects((prev) => [...prev, newSubject]);
    },
    [setSubjects]
  );

  const handleDeleteSubject = useCallback(
    (id: string) => {
      setSubjects((prev) => prev.filter((sub) => sub.id !== id));
    },
    [setSubjects]
  );

  const handleImportFromTracker = useCallback(() => {
    try {
      const savedTrackerSubjects = localStorage.getItem(LOCAL_STORAGE_KEYS.TRACKER_SUBJECTS);
      if (!savedTrackerSubjects) {
        alert(t('state.no_tracker_data'));
        return;
      }

      const trackerSubjects = JSON.parse(savedTrackerSubjects) as TrackerSubject[];
      const imported: YellowCardSubject[] = trackerSubjects.map((ts) =>
        mapTrackerSubjectToYellowCard(ts, profile.studentId)
      );

      setSubjects((prev) => mergeImportedSubjects(prev, imported));
      triggerSuccessMessage(t('state.import_success'), 3000);
    } catch (e) {
      console.error('Failed to import tracker subjects', e);
      alert(t('state.import_error'));
    }
  }, [profile.studentId, setSubjects, triggerSuccessMessage, t]);

  const handleSaveYellowCard = useCallback(() => {
    setShowAdvisorModal(true);
  }, []);

  const handleConfirmSubmit = useCallback(() => {
    setShowAdvisorModal(false);
    triggerSuccessMessage(t('state.save_success'), 4000);
  }, [triggerSuccessMessage, t]);

  const handleDismissAdvisorModal = useCallback(() => {
    setShowAdvisorModal(false);
  }, []);

  const handleDismissWarningBanner = useCallback(() => {
    setShowWarningBanner(false);
  }, []);

  return {
    pdpaAgreed,
    profile,
    subjects,
    showWarningBanner,
    showAdvisorModal,
    successMessage,
    navigate,
    handleConfirmPDPA,
    handleProfileChange,
    handleUpdateSubject,
    handleAddSubject,
    handleDeleteSubject,
    handleImportFromTracker,
    handleSaveYellowCard,
    handleConfirmSubmit,
    handleDismissAdvisorModal,
    handleDismissWarningBanner,
  };
}
