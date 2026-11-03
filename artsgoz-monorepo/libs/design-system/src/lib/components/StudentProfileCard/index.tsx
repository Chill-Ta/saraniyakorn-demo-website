import { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon/index.js';
import { Button } from '../Button/index.js';

export interface StudentProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
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

export function StudentProfileCard({
  children,
  className = '',
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
}: StudentProfileCardProps) {
  return (
    <div
      className={`absolute left-[628px] top-[111px] w-[613px] h-[585px] bg-[var(--color-background-subtler,#F7F8F9)] border border-[var(--color-border-subtle,#D0D0D1)] rounded-[16px] p-8 ${className}`}
      style={{ fontFamily: 'var(--font-serif, ChulaCharasNew, sans-serif)', ...props.style }}
      {...props}
    >
      {children || (
        <div className="flex flex-col h-full justify-between">
          {/* Upper section: Avatar & Student Details */}
          <div className="flex flex-row items-center gap-8">
            {/* Avatar Outline Circle */}
            <div className="w-[130px] h-[130px] rounded-full border border-[var(--color-border-subtle,#D0D0D1)] flex items-center justify-center shrink-0 overflow-hidden bg-white">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Student Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-transparent flex items-center justify-center">
                  {/* Empty outline circle as shown in the screenshot */}
                  <div className="w-[100px] h-[100px] rounded-full border border-[#D0D0D1]/60" />
                </div>
              )}
            </div>

            {/* Details Text */}
            <div className="flex flex-col text-[#404041] select-none">
              <h2 className="text-[24px] font-bold text-[#111827] leading-tight mb-2">{studentName}</h2>
              <p className="text-[18px] leading-relaxed">รหัสนิสิต {studentId}</p>
              <p className="text-[18px] leading-relaxed">เอกสาขาวิชา: {major}</p>
              <p className="text-[18px] leading-relaxed">โทสาขาวิชา: {minor}</p>
            </div>
          </div>

          {/* Middle section: Navigation Links */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-2 flex flex-col w-full shadow-[0px_4px_10px_rgba(0,0,0,0.02)]">
            <button
              onClick={onSavedClick}
              className="flex items-center gap-4 px-4 py-[14px] rounded-[12px] font-serif text-[18px] text-[#111827] hover:bg-gray-50 active:scale-[0.99] transition-all cursor-pointer text-left w-full border-none bg-transparent"
            >
              <Icon name="Bookmark" className="fill-current text-[#111827]" sizeVariant="md" />
              <span>ที่บันทึกไว้</span>
            </button>
            <button
              onClick={onHistoryClick}
              className="flex items-center gap-4 px-4 py-[14px] rounded-[12px] font-serif text-[18px] text-[#111827] hover:bg-gray-50 active:scale-[0.99] transition-all cursor-pointer text-left w-full border-none bg-transparent"
            >
              <Icon name="Clock" className="text-[#111827]" sizeVariant="md" />
              <span>ประวัติการวางแผนหน่วยกิต</span>
            </button>
            <button
              onClick={onManageClick}
              className="flex items-center gap-4 px-4 py-[14px] rounded-[12px] font-serif text-[18px] text-[#111827] hover:bg-gray-50 active:scale-[0.99] transition-all cursor-pointer text-left w-full border-none bg-transparent"
            >
              <Icon name="User" className="text-[#111827]" sizeVariant="md" />
              <span>จัดการบัญชี</span>
            </button>
          </div>

          {/* Bottom section: Logout Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onLogout}
              className="h-[42px] px-8 rounded-[8px] font-serif text-[16px] font-semibold text-[#111827] border border-[#E5E7EB] bg-white hover:bg-gray-50 active:scale-95 transition-all"
            >
              ออกจากระบบ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
