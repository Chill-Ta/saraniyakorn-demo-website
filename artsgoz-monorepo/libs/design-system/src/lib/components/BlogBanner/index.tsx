import { HTMLAttributes, ReactNode } from 'react';

export interface BlogBannerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function BlogBanner({ children, className = '', ...props }: BlogBannerProps) {
  return (
    <div
      className={`absolute left-[112px] top-[719px] w-[1056px] h-[328px] bg-gradient-to-b from-white to-[#E992B4] rounded-[16px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
