import { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon/index.js';

export interface MobileManageAccountCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  onBack?: () => void;
  studentName?: string;
  studentId?: string;
  major?: string;
  minor?: string;
  avatarUrl?: string;
  onEditClick?: () => void;
  onAvatarUpload?: () => void;
}

export function MobileManageAccountCard({
  children,
  className = '',
  onBack,
  studentName = 'ชื่อ นามสกุล',
  studentId = 'xxxxxxx',
  major = 'ศิลปการละคร',
  minor = '-',
  avatarUrl,
  onEditClick,
  onAvatarUpload,
  ...props
}: MobileManageAccountCardProps) {
  return (
    <div
      className={`absolute left-[39px] top-[92px] w-[297px] h-[661px] bg-[var(--color-background-subtler,#F7F8F9)] border border-[var(--color-border-subtle,#D0D0D1)] rounded-[16px] p-6 shadow-md flex flex-col items-center ${className}`}
      style={{ fontFamily: 'var(--font-serif, ChulaCharasNew, sans-serif)', ...props.style }}
      {...props}
    >
      {/* Header section with back button and title */}
      <div className="w-full flex items-center justify-center relative mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute left-0 text-[#111827] hover:text-gray-600 transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center p-1"
            aria-label="Back"
          >
            <Icon name="ChevronLeft" sizeVariant="md" />
          </button>
        )}
        <h2 className="text-[18px] font-bold text-[#111827] leading-none select-none">
          จัดการบัญชี
        </h2>
      </div>

      {children || (
        <div className="flex flex-col h-full w-full items-center justify-between">
          {/* Avatar Upload Section */}
          <div className="flex-1 flex items-center justify-center my-4">
            <button
              onClick={onAvatarUpload}
              className="w-[110px] h-[110px] rounded-full border border-[var(--color-border-subtle,#D0D0D1)] flex items-center justify-center shrink-0 overflow-hidden bg-white hover:bg-gray-50 active:scale-95 transition-all cursor-pointer relative group"
            >
              {avatarUrl ? (
                <>
                  <img src={avatarUrl} alt="Student Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="Camera" className="text-white" sizeVariant="md" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Icon
                    name="ImagePlus"
                    className="text-[var(--color-background-primary-default,#E992B4)] w-10 h-10"
                    sizeVariant="md"
                  />
                </div>
              )}
            </button>
          </div>

          {/* Details & Edit Section */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-4 w-full flex justify-between items-center shadow-[0px_4px_10px_rgba(0,0,0,0.02)] select-none">
            <div className="flex flex-col text-[#404041] select-none text-left">
              <h3 className="text-[16px] font-bold text-[#111827] leading-tight mb-1">{studentName}</h3>
              <p className="text-[14px] leading-relaxed">รหัสนิสิต {studentId}</p>
              <p className="text-[14px] leading-relaxed">เอกสาขาวิชา: {major}</p>
              <p className="text-[14px] leading-relaxed">โทสาขาวิชา: {minor}</p>
            </div>

            {/* Circular Pink Edit Pencil Button */}
            <button
              onClick={onEditClick}
              className="w-[40px] h-[40px] rounded-full bg-[var(--color-background-primary-default,#E992B4)] hover:bg-[var(--color-background-primary-dark,#DE5D8F)] text-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0"
              aria-label="Edit Profile"
            >
              <Icon name="Pencil" sizeVariant="sm" className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
