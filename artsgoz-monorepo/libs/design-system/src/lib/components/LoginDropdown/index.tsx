
import logoImg from '../../assets/logo_goz_horizontal.ico';
import cuLogoImg from '../../assets/CU_logo.ico';

export interface LoginDropdownProps {
  onClose?: () => void;
  onLogin?: () => void;
}

export function LoginDropdown({ onClose, onLogin }: LoginDropdownProps) {
  return (
    <div
      className="absolute right-0 top-[calc(100%+12px)] flex flex-col items-center bg-[#F7F8F9] rounded-[16px] shadow-[4px_8px_10.2px_rgba(0,0,0,0.25)] border border-gray-150 transition-all duration-300 z-50
        w-[calc(100vw-32px)] max-w-[613px] h-auto p-8 gap-[80px]
        lg:w-[613px] lg:h-[585px] lg:pt-[53px] lg:pr-[95px] lg:pb-[266px] lg:pl-[82px] lg:gap-[149px]"
    >
      {/* Logo Area */}
      <div className="w-full flex justify-center shrink-0">
        <img
          src={logoImg}
          alt="Artsgoz Logo"
          className="w-[220px] lg:w-[325px] aspect-[174/37] object-contain"
        />
      </div>

      {/* Login Button Area */}
      <button
        className="flex flex-row items-center justify-center bg-white border border-[#E5E7EB] cursor-pointer hover:bg-gray-50 active:scale-95 transition-all gap-[10px] w-full max-w-[360px] lg:max-w-none shrink-0"
        style={{
          height: '52px',
          padding: '0 32px',
          borderRadius: '12px',
          fontFamily: 'var(--font-serif, ChulaCharasNew, sans-serif)',
        }}
        onClick={() => {
          console.log('ล็อกอินด้วยบัญชี CU');
          if (onLogin) onLogin();
          if (onClose) onClose();
        }}
      >
        <span className="text-[#111827] text-[16px] lg:text-[18px] font-semibold tracking-wide whitespace-nowrap">
          Log in with
        </span>
        <img
          src={cuLogoImg}
          alt="CU Logo"
          className="w-[28px] h-[21px] lg:w-[33px] lg:h-[24px] object-contain shrink-0"
        />
        <span className="text-[#111827] text-[16px] lg:text-[18px] font-semibold tracking-wide whitespace-nowrap">
          account
        </span>
      </button>
    </div>
  );
}
