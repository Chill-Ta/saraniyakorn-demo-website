import { HTMLAttributes, ReactNode } from 'react';

export interface SavedArticleHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function SavedArticleHeader({ children, className = '', ...props }: SavedArticleHeaderProps) {
  return (
    <div
      className={`absolute left-[81px] top-[105px] w-[485px] h-[195px] flex flex-col items-start gap-[27px] p-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
