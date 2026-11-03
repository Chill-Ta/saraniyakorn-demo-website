import { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon/index.js';
import { Button } from '../Button/index.js';

export interface MobileStudentProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  onClose?: () => void;
  studentName?: string;
  studentId?: string;
  major?: string;
  minor?: string;
  avatarUrl?: string;
  onSavedClick?: () => void;
  onHistoryClick?: () => void;
  onManageClick?: () => void;
  onLogout?: () => void;
}

export function MobileStudentProfileCard({
  children,
  className = '',
  onClose,
  studentName = 'ชื่อ นามสกุล',
  studentId = 'xxxxxxx',
  major = 'ศิลปการละคร',
  minor = '-',
  avatarUrl,
  onSavedClick,
  onHistoryClick,
  onManageClick,
  onLogout,
  ...props
}: MobileStudentProfileCardProps) {
  return (
    <div
      className={`absolute left-[39px] top-[92px] w-[297px] h-[661px] bg-[var(--color-background-subtler,#F7F8F9)] border border-[var(--color-border-subtle,#D0D0D1)] rounded-[16px] p-6 shadow-md flex flex-col items-start ${className}`}
      style={{ fontFamily: 'var(--font-serif, ChulaCharasNew, sans-serif)', ...props.style }}
      {...props}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center z-10"
          aria-label="Close"
        >
          <Icon name="X" sizeVariant="md" />
        </button>
      )}
      
      {children || (
        <div className="flex flex-col h-full w-full justify-between pt-2">
          {/* Upper section: Avatar & Student Details */}
          <div className="flex flex-col items-start gap-4">
            {/* Avatar Outline Circle */}
            <div className="w-[90px] h-[90px] rounded-full border border-[var(--color-border-subtle,#D0D0D1)] flex items-center justify-center shrink-0 overflow-hidden bg-white">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Student Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-transparent flex items-center justify-center">
                  <div className="w-[70px] h-[70px] rounded-full border border-[#D0D0D1]/60" />
                </div>
              )}
            </div>

            {/* Details Text */}
            <div className="flex flex-col text-[#404041] select-none">
              <h2 className="text-[20px] font-bold text-[#111827] leading-tight mb-1">{studentName}</h2>
              <p className="text-[15px] leading-relaxed">รหัสนิสิต {studentId}</p>
              <p className="text-[15px] leading-relaxed">เอกสาขาวิชา: {major}</p>
              <p className="text-[15px] leading-relaxed">โทสาขาวิชา: {minor}</p>
            </div>
          </div>

          {/* Middle section: Navigation Links */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-1.5 flex flex-col w-full shadow-[0px_4px_10px_rgba(0,0,0,0.02)] my-4">
            <button
              onClick={onSavedClick}
              className="flex items-center gap-3 px-3 py-[10px] rounded-[12px] font-serif text-[16px] text-[#111827] hover:bg-gray-50 active:scale-[0.99] transition-all cursor-pointer text-left w-full border-none bg-transparent"
            >
              <Icon name="Bookmark" className="fill-current text-[#111827]" sizeVariant="md" />
              <span>ที่บันทึกไว้</span>
            </button>
            <button
              onClick={onHistoryClick}
              className="flex items-center gap-3 px-3 py-[10px] rounded-[12px] font-serif text-[16px] text-[#111827] hover:bg-gray-50 active:scale-[0.99] transition-all cursor-pointer text-left w-full border-none bg-transparent"
            >
              <Icon name="Clock" className="text-[#111827]" sizeVariant="md" />
              <span>ประวัติการวางแผนหน่วยกิต</span>
            </button>
            <button
              onClick={onManageClick}
              className="flex items-center gap-3 px-3 py-[10px] rounded-[12px] font-serif text-[16px] text-[#111827] hover:bg-gray-50 active:scale-[0.99] transition-all cursor-pointer text-left w-full border-none bg-transparent"
            >
              <Icon name="User" className="text-[#111827]" sizeVariant="md" />
              <span>จัดการบัญชี</span>
            </button>
          </div>

          {/* Bottom section: Logout Button */}
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full h-[42px] font-serif text-[15px] font-semibold text-[#111827] border border-[#E5E7EB] bg-white hover:bg-gray-50 active:scale-95 transition-all mt-auto"
          >
            ออกจากระบบ
          </Button>
        </div>
      )}
    </div>
  );
}
