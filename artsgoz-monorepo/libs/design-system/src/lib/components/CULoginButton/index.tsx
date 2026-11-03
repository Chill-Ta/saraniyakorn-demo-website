// packages/design-system/src/lib/components/CULoginButton/index.tsx
import React from 'react';
import cuLogoImg from '../../assets/CU_logo.ico';

type CULoginButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function CULoginButton({
  className = '',
  ...props
}: CULoginButtonProps) {
  return (
    <button
      className={`flex flex-row flex-nowrap items-center justify-center bg-[#FFF] border-none cursor-pointer transition-all active:scale-95 shrink-0 whitespace-nowrap ${className}`}
      style={{
        height: '35px',
        padding: '0 16px',
        gap: '8px',
        borderRadius: '8px',
      }}
      {...props}
    >
      <span
        className="text-[#111827] text-[13.755px] font-normal leading-[18.34px] tracking-normal whitespace-nowrap"
        style={{
          fontFamily: 'var(--typography-mobile-body-lg-font-family, ChulaCharasNew, sans-serif)',
        }}
      >
        เข้าสู่ระบบ
      </span>

      <img
        src={cuLogoImg}
        alt="CU Logo"
        className="object-cover shrink-0"
        style={{
          width: '24.647px',
          height: '18.197px',
          aspectRatio: '24.65/18.20',
        }}
      />
    </button>
  );
}
