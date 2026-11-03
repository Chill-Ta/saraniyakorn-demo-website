import { HTMLAttributes, ReactNode } from 'react';

export interface FilterSavedArticlePopoverProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function FilterSavedArticlePopover({ children, className = '', ...props }: FilterSavedArticlePopoverProps) {
  return (
    <div
      className={`absolute left-[736px] top-[129px] w-[432px] h-[175px] flex flex-row justify-center items-start py-[16px] px-[32px] gap-[10px] bg-white shadow-xl rounded-[16px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
