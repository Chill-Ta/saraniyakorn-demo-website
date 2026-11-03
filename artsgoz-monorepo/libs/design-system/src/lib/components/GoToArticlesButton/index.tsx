import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon/index.js';

export interface GoToArticlesButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function GoToArticlesButton({
  children = 'ไปที่หน้าบทความ',
  className = '',
  ...props
}: GoToArticlesButtonProps) {
  return (
    <button
      className={`absolute left-[981px] top-[2229px] w-[253px] min-w-[158px] h-[58px] flex flex-row justify-center items-center py-[20px] px-[24px] gap-[8px] bg-[#E992B4] hover:bg-[#DE5D8F] text-white font-bold rounded-[8px] transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ fontFamily: 'var(--font-serif, ChulaCharasNew, sans-serif)', ...props.style }}
      {...props}
    >
      <span className="text-[18px] leading-none">{children}</span>
      <Icon name="ArrowRight" sizeVariant="md" className="text-white" />
    </button>
  );
}
