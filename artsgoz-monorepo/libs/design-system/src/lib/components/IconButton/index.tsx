import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

export function IconButton({ icon, className = '', ...props }: IconButtonProps) {
  return (
    <button
      className={`flex justify-center items-center w-[48px] h-[48px] p-[12px] gap-[8px] aspect-square rounded-[9999px] shrink-0 transition-all cursor-pointer bg-[#E992B4] text-white hover:bg-[#DE5D8F] active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
      {...props}
    >
      <div className="flex justify-center items-center w-[24px] h-[24px] shrink-0">
        {icon}
      </div>
    </button>
  );
}
