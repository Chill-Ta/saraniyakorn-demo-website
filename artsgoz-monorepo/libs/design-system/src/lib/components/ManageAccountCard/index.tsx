import { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon/index.js';

export interface ManageAccountCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  studentName?: string;
  studentId?: string;
  major?: string;
  minor?: string;
  avatarUrl?: string;
  onBack?: () => void;
  onEditClick?: () => void;
  onAvatarUpload?: () => void;
}

export function ManageAccountCard({
  children,
  className = '',
  studentName = 'ชื่อ นามสกุล',
  studentId = 'xxxxxxx',
  major = 'ศิลปการละคร',
  minor = '-',
  avatarUrl,
  onBack,
  onEditClick,
  onAvatarUpload,
  ...props
}: ManageAccountCardProps) {
  return (
    <div
      className={`absolute left-[628px] top-[111px] w-[613px] h-[585px] bg-[var(--color-background-subtler,#F7F8F9)] border border-[var(--color-border-subtle,#D0D0D1)] rounded-[16px] p-8 shadow-sm ${className}`}
      style={{ fontFamily: 'var(--font-serif, ChulaCharasNew, sans-serif)', ...props.style }}
      {...props}
    >
      {children || (
        <div className="flex flex-col h-full items-center">
          {/* Header section with back arrow and title */}
          <div className="w-full flex items-center relative mb-8">
            <button
              onClick={onBack}
              className="absolute left-0 text-[#111827] hover:text-gray-600 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center p-1"
              aria-label="Back"
            >
              <Icon name="ChevronLeft" sizeVariant="lg" />
            </button>
            <h2 className="w-full text-center text-[22px] font-bold text-[#111827] leading-none select-none">
              จัดการบัญชี
            </h2>
          </div>

          {/* Avatar Upload Circle Section */}
          <div className="flex-1 flex items-center justify-center mb-6">
            <button
              onClick={onAvatarUpload}
              className="w-[150px] h-[150px] rounded-full border border-[var(--color-border-subtle,#D0D0D1)] flex items-center justify-center shrink-0 overflow-hidden bg-white hover:bg-gray-50 active:scale-95 transition-all cursor-pointer relative group"
            >
              {avatarUrl ? (
                <>
                  <img src={avatarUrl} alt="Student Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="Camera" className="text-white" sizeVariant="lg" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Icon
                    name="ImagePlus"
                    className="text-[var(--color-background-primary-default,#E992B4)] w-12 h-12"
                    sizeVariant="lg"
                  />
                </div>
              )}
            </button>
          </div>

          {/* Details & Edit Section */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 w-full flex justify-between items-center shadow-[0px_4px_10px_rgba(0,0,0,0.02)] select-none">
            <div className="flex flex-col text-[#404041] select-none text-left">
              <h3 className="text-[20px] font-bold text-[#111827] leading-tight mb-2">{studentName}</h3>
              <p className="text-[16px] leading-relaxed">รหัสนิสิต {studentId}</p>
              <p className="text-[16px] leading-relaxed">เอกสาขาวิชา: {major}</p>
              <p className="text-[16px] leading-relaxed">โทสาขาวิชา: {minor}</p>
            </div>

            {/* Circular Pink Edit Pencil Button */}
            <button
              onClick={onEditClick}
              className="w-[48px] h-[48px] rounded-full bg-[var(--color-background-primary-default,#E992B4)] hover:bg-[var(--color-background-primary-dark,#DE5D8F)] text-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0"
              aria-label="Edit Profile"
            >
              <Icon name="Pencil" sizeVariant="md" className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
