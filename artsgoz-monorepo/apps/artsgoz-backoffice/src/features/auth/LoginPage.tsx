import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import logoGoz from '../../assets/logo_goz.png';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // First attempt /v1/auth/login, fallback to /auth/login
      const endpoint = `${API_BASE}/v1/auth/login`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }

      if (data.token) {
        if (rememberMe) {
          localStorage.setItem('artsgoz_token', data.token);
          if (data.user) {
            localStorage.setItem('artsgoz_user', JSON.stringify(data.user));
          }
        } else {
          sessionStorage.setItem('artsgoz_token', data.token);
          if (data.user) {
            sessionStorage.setItem('artsgoz_user', JSON.stringify(data.user));
          }
        }

        // Navigate to previous page or default to admin
        navigate(from, { replace: true });
      } else {
        throw new Error('ไม่พบข้อมูลการยืนยันตัวตนในระบบ');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#FFF5F8] via-[#FAF9FA] to-[#FCEFF4] select-none"
      style={{ fontFamily: 'ChulaCharasNew, Inter, "Noto Sans Thai", sans-serif' }}
    >
      {/* Decorative Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#F5CDDC]/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#DE5D8F]/15 rounded-full blur-3xl" />
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-[440px] bg-white/95 backdrop-blur-md rounded-[24px] border border-[#F0BED2]/60 shadow-[0_16px_40px_rgba(222,93,143,0.08)] p-6 sm:p-8 md:p-10 transition-all">
        {/* Header / Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-[20px] bg-[#FCEFF4] border border-[#F5CDDC] flex items-center justify-center shadow-xs mb-4">
            <img
              src={logoGoz}
              alt="คณะกรรมการนิสิตอักษรศาสตร์"
              className="w-11 h-11 object-contain"
            />
          </div>

          <h1
            className="text-[22px] sm:text-[24px] font-bold text-[#1A1C1C] leading-snug"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            ระบบจัดการหลังบ้าน
          </h1>
          <p
            className="text-[14px] text-[#545455] mt-1"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            คณะกรรมการนิสิตอักษรศาสตร์ จุฬาฯ
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-[12px] bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] text-[14px] flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-username"
              className="text-[14px] font-bold text-[#1A1C1C]"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              ชื่อผู้ใช้ (Username)
            </label>
            <div className="relative flex items-center">
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้สำหรับหลังบ้าน"
                autoComplete="username"
                disabled={isLoading}
                className="w-full h-[46px] pl-11 pr-4 rounded-[12px] border border-[#DFDFE0] bg-[#FAFAFA] text-[#1A1C1C] text-[15px] outline-none transition-all focus:bg-white focus:border-[#DE5D8F] focus:ring-3 focus:ring-[#DE5D8F]/15 placeholder:text-[#9E9E9E] disabled:opacity-60"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              />
              <User
                size={18}
                className="absolute left-3.5 text-[#8B8B8C] pointer-events-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-[14px] font-bold text-[#1A1C1C]"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              รหัสผ่าน (Password)
            </label>
            <div className="relative flex items-center">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
                autoComplete="current-password"
                disabled={isLoading}
                className="w-full h-[46px] pl-11 pr-11 rounded-[12px] border border-[#DFDFE0] bg-[#FAFAFA] text-[#1A1C1C] text-[15px] outline-none transition-all focus:bg-white focus:border-[#DE5D8F] focus:ring-3 focus:ring-[#DE5D8F]/15 placeholder:text-[#9E9E9E] disabled:opacity-60"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              />
              <Lock
                size={18}
                className="absolute left-3.5 text-[#8B8B8C] pointer-events-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3.5 text-[#8B8B8C] hover:text-[#1A1C1C] p-0.5 bg-transparent border-none cursor-pointer transition-colors"
                title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Options: Remember Me */}
          <div className="flex items-center justify-between text-[13.5px] mt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-[#545455] hover:text-[#1A1C1C]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#D6C1C7] text-[#DE5D8F] focus:ring-[#DE5D8F] accent-[#DE5D8F]"
              />
              <span>จดจำการเข้าสู่ระบบ</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="login-submit-button"
            disabled={isLoading}
            className="w-full h-[48px] mt-2 rounded-[12px] bg-[#DE5D8F] hover:bg-[#C94D7E] active:scale-[0.99] text-white font-bold text-[16px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              <>
                <span>เข้าสู่ระบบ</span>
                <ArrowRight size={18} strokeWidth={2.2} />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-8 pt-5 border-t border-[#F0F0F0] text-center">
          <p className="text-[12.5px] text-[#8B8B8C]">
            สงวนสิทธิ์การเข้าถึงสำหรับเจ้าหน้าที่และผู้ดูแลระบบหลังบ้านเท่านั้น
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

