import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { StudentProfile } from '../types.js';

interface StudentProfileFormProps {
  profile: StudentProfile;
  onChange: (updatedProfile: StudentProfile) => void;
}

// Simple XSS sanitization that strips HTML tags
const sanitizeText = (input: string): string => {
  if (!input) return '';
  return input.replace(/<[^>]*>?/gm, '').trim();
};

export function StudentProfileForm({ profile, onChange }: StudentProfileFormProps) {
  const { t } = useTranslation('yellow_card');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StudentProfile>(profile);
  const [errors, setErrors] = useState<{ studentId?: string; phone?: string; name?: string }>({});

  const validate = (): boolean => {
    const newErrors: { studentId?: string; phone?: string; name?: string } = {};

    // Validate Student ID (10 digits)
    const sanitizedStudentId = sanitizeText(editedProfile.studentId);
    if (!sanitizedStudentId) {
      newErrors.studentId = 'กรุณากรอกเลขประจำตัวนิสิต';
    } else if (!/^\d{10}$/.test(sanitizedStudentId)) {
      newErrors.studentId = 'เลขประจำตัวนิสิตต้องเป็นตัวเลข 10 หลัก';
    }

    // Validate Phone (10 digits or 9-10 digits)
    const sanitizedPhone = sanitizeText(editedProfile.phone);
    if (sanitizedPhone && !/^\d{9,10}$/.test(sanitizedPhone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก)';
    }

    // Validate Name
    const sanitizedName = sanitizeText(editedProfile.name);
    if (!sanitizedName) {
      newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const cleanedProfile: StudentProfile = {
      ...editedProfile,
      name: sanitizeText(editedProfile.name),
      studentId: sanitizeText(editedProfile.studentId),
      major: sanitizeText(editedProfile.major),
      minor: sanitizeText(editedProfile.minor),
      curriculum: sanitizeText(editedProfile.curriculum),
      advisor: sanitizeText(editedProfile.advisor),
      address: sanitizeText(editedProfile.address),
      phone: sanitizeText(editedProfile.phone),
    };

    onChange(cleanedProfile);
    setEditedProfile(cleanedProfile);
    setIsEditing(false);
    setErrors({});
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="w-full bg-white border border-[#D0D0D1]/30 rounded-[16px] p-5 sm:p-6 shadow-sm font-[ChulaCharasNew] mb-8 select-none min-w-0">
      {/* Header with Title and Action Buttons (No absolute overlap on mobile) */}
      <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-[#D0D0D1]/20">
        <h3 className="text-[17px] sm:text-[18px] font-bold text-black truncate">
          {t('profile_form.title', 'ข้อมูลนิสิต')}
        </h3>
        <div className="shrink-0">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-[14px] font-bold text-[#DE5D8F] hover:text-[#ca5582] transition-colors cursor-pointer border border-[#DE5D8F]/20 hover:border-[#DE5D8F] rounded-[8px] py-1.5 px-3.5 bg-white"
            >
              {t('profile_form.edit')}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="text-[14px] font-bold text-[#6D6D6D] hover:text-[#545455] transition-colors cursor-pointer border border-[#D0D0D1] rounded-[8px] py-1 px-3 bg-white"
              >
                {t('credit_tracking.planner.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="text-[14px] font-bold text-white bg-[#E992B4] hover:bg-[#DE5D8F] transition-colors cursor-pointer rounded-[8px] py-1 px-3 border-none"
              >
                {t('credit_tracking.planner.save')}
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0">
          {/* Name */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">
              {t('profile_form.name_label')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editedProfile.name}
              onChange={(e) => {
                setEditedProfile({ ...editedProfile, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={`w-full h-[40px] px-3 border rounded-[8px] text-black text-[16px] focus:outline-none ${
                errors.name ? 'border-red-500' : 'border-[#D0D0D1] focus:border-[#DE5D8F]'
              }`}
            />
            {errors.name && <span className="text-red-500 text-[12px]">{errors.name}</span>}
          </div>

          {/* Student ID */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">
              {t('profile_form.student_id_label')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={editedProfile.studentId}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setEditedProfile({ ...editedProfile, studentId: val });
                if (errors.studentId) setErrors({ ...errors, studentId: undefined });
              }}
              placeholder="67XXXXXXXX"
              className={`w-full h-[40px] px-3 border rounded-[8px] text-black text-[16px] focus:outline-none ${
                errors.studentId ? 'border-red-500' : 'border-[#D0D0D1] focus:border-[#DE5D8F]'
              }`}
            />
            {errors.studentId && <span className="text-red-500 text-[12px]">{errors.studentId}</span>}
          </div>

          {/* Major */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('credit_tracking.profile.major_label')}</label>
            <input
              type="text"
              value={editedProfile.major}
              onChange={(e) => setEditedProfile({ ...editedProfile, major: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>

          {/* Minor */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('credit_tracking.profile.minor_label')}</label>
            <input
              type="text"
              value={editedProfile.minor}
              onChange={(e) => setEditedProfile({ ...editedProfile, minor: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>

          {/* Curriculum */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('credit_tracking.profile.curriculum_label')}</label>
            <input
              type="text"
              value={editedProfile.curriculum}
              onChange={(e) => setEditedProfile({ ...editedProfile, curriculum: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>

          {/* Advisor */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('profile_form.advisor_label')}</label>
            <input
              type="text"
              value={editedProfile.advisor}
              onChange={(e) => setEditedProfile({ ...editedProfile, advisor: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5 md:col-span-2 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('profile_form.address_label')}</label>
            <textarea
              value={editedProfile.address}
              onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
              rows={2}
              className="w-full p-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F] resize-none"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('profile_form.phone_label')}</label>
            <input
              type="tel"
              inputMode="tel"
              maxLength={10}
              placeholder="08XXXXXXXX"
              value={editedProfile.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setEditedProfile({ ...editedProfile, phone: val });
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              className={`w-full h-[40px] px-3 border rounded-[8px] text-black text-[16px] focus:outline-none ${
                errors.phone ? 'border-red-500' : 'border-[#D0D0D1] focus:border-[#DE5D8F]'
              }`}
            />
            {errors.phone && <span className="text-red-500 text-[12px]">{errors.phone}</span>}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-6 text-[15px] sm:text-[16px] min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-[100px] shrink-0 font-bold text-[#6D6D6D] truncate">{t('profile_form.student_info_label')}</span>
            <span className="text-[#1A1A1A] font-semibold truncate">{profile.name}</span>
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <span className="w-[100px] shrink-0 font-bold text-[#6D6D6D] truncate">{t('profile_form.student_id_short')}</span>
            <span className="text-[#1A1A1A] font-mono font-semibold truncate">{profile.studentId}</span>
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <span className="w-[100px] shrink-0 font-bold text-[#6D6D6D] truncate">{t('credit_tracking.profile.major_label')}</span>
            <span className="text-[#404041] truncate">{profile.major || '-'}</span>
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <span className="w-[100px] shrink-0 font-bold text-[#6D6D6D] truncate">{t('credit_tracking.profile.minor_label')}</span>
            <span className="text-[#404041] truncate">{profile.minor || t('profile_form.no_minor')}</span>
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <span className="w-[100px] shrink-0 font-bold text-[#6D6D6D] truncate">{t('credit_tracking.profile.curriculum_label')}</span>
            <span className="text-[#404041] truncate">{profile.curriculum || '-'}</span>
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <span className="w-[100px] shrink-0 font-bold text-[#6D6D6D] truncate">{t('profile_form.advisor_label')}</span>
            <span className="text-[#404041] truncate">{profile.advisor || '-'}</span>
          </div>

          <div className="flex items-start gap-3 md:col-span-2 min-w-0">
            <span className="w-[100px] shrink-0 font-bold text-[#6D6D6D] pt-0.5 truncate">{t('profile_form.address_label')}</span>
            <span className="text-[#404041] leading-relaxed break-words flex-1 min-w-0">{profile.address || '-'}</span>
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <span className="w-[100px] shrink-0 font-bold text-[#6D6D6D] truncate">{t('profile_form.phone_label')}</span>
            <span className="text-[#404041] font-mono truncate">{profile.phone || '-'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
