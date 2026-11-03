import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@artsgoz/design-system';
import { PATHS } from '../paths.js';

export function NotFoundPage() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 font-[ChulaCharasNew]">
      <div className="w-24 h-24 mb-6 rounded-full bg-[#FCF0F4] flex items-center justify-center text-[#DE5D8F]">
        <span className="text-4xl font-black">404</span>
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3">
        {t('not_found.title', 'ไม่พบหน้าที่คุณต้องการ')}
      </h1>
      
      <p className="text-[#6D6D6D] text-base sm:text-lg max-w-[480px] mb-8 leading-relaxed">
        {t(
          'not_found.description',
          'หน้าที่คุณกำลังพยายามเข้าถึงอาจถูกย้าย ลบ หรือไม่เคยมีอยู่ในระบบ กรุณาตรวจสอบ URL อีกครั้ง'
        )}
      </p>

      <Link to={PATHS.ROOT}>
        <Button variant="primary" className="px-6 py-2.5 text-[16px] font-bold">
          {t('not_found.back_home', 'กลับสู่หน้าหลัก')}
        </Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
