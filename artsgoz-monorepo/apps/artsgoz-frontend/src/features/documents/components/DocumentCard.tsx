import { useTranslation } from 'react-i18next';
import { Download, Bookmark, XCircle, AlertCircle, Clock } from 'lucide-react';
import type { DocumentItem } from '../types.js';

interface DocumentCardProps {
  document: DocumentItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export function DocumentCard({
  document: doc,
  isBookmarked,
  onToggleBookmark,
}: DocumentCardProps) {
  const { t } = useTranslation('student_services');

  // Render status badge for desktop
  const renderStatusBadge = () => {
    switch (doc.status) {
      case 'failed':
        return (
          <div
            className="flex items-center justify-center bg-[#F59AAE] text-[#81132B] px-3 py-1 rounded-full shrink-0 gap-1.5"
            style={{ width: '96px', height: '38px' }}
          >
            <XCircle size={14} className="shrink-0" />
            <span className="text-[14px] font-normal font-[ChulaCharasNew] leading-none whitespace-nowrap">
              {t('documents.status.failed')}
            </span>
          </div>
        );
      case 'pending':
        return (
          <div
            className="flex items-center justify-center bg-[#FDECC0] text-[#E2B030] px-3 py-1 rounded-full shrink-0 gap-1.5"
            style={{ width: '96px', height: '38px' }}
          >
            <AlertCircle size={14} className="shrink-0" />
            <span className="text-[14px] font-normal font-[ChulaCharasNew] leading-none whitespace-nowrap">
              {t('documents.status.pending')}
            </span>
          </div>
        );
      case 'neutral':
        return (
          <div
            className="flex items-center justify-center bg-[#D0D0D1] text-[#6D6D6D] px-3 py-1 rounded-full shrink-0 gap-1.5"
            style={{ width: '96px', height: '38px' }}
          >
            <Clock size={14} className="shrink-0" />
            <span className="text-[14px] font-normal font-[ChulaCharasNew] leading-none whitespace-nowrap">
              {t('documents.status.neutral')}
            </span>
          </div>
        );
      case 'none':
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full max-w-[908px] bg-white border border-[#D0D0D1]/20 shadow-sm flex items-center justify-between p-4 md:p-6 h-[72px] md:h-[106px] rounded-[12px] transition-all duration-200 hover:shadow-md hover:border-[#DE5D8F]/20 min-w-0 gap-2"
    >
      {/* Left and Middle Container */}
      <div className="flex items-center flex-1 min-w-0 gap-3 md:gap-8">
        {/* Download Icon Button */}
        <a
          href={doc.downloadUrl}
          download
          className="flex items-center justify-center bg-[#FCEFF4] text-[#DE5D8F] rounded-full hover:bg-[#DE5D8F] hover:text-white transition-colors duration-200 w-6 h-6 md:w-8 md:h-8 p-1 shrink-0"
          aria-label={t('documents.download_label')}
        >
          <Download className="w-3 h-3 md:w-6 md:h-6 shrink-0" />
        </a>

        {/* Text Details Container */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* File Name */}
          <h3 className="font-[ChulaCharasNew] text-black font-bold truncate leading-tight text-[14px] md:text-[24px]">
            {t(doc.nameKey)}
          </h3>
          {/* Description */}
          <p className="font-[ChulaCharasNew] text-[#6D6D6D] font-normal truncate mt-0.5 md:mt-1 leading-normal text-[14px] md:text-[20px]">
            {t(doc.detailsKey)}
          </p>
        </div>

        {/* Status Badge (Desktop Only) */}
        <div className="hidden md:block shrink-0">
          {renderStatusBadge()}
        </div>
      </div>

      {/* Bookmark Icon Button (Rightmost) */}
      <button
        type="button"
        onClick={() => onToggleBookmark(doc.id)}
        className="ml-4 flex items-center justify-center rounded-[8px] transition-colors duration-200 w-8 h-8 shrink-0 cursor-pointer border-none"
        style={{
          backgroundColor: isBookmarked ? '#E992B4' : '#F7F8F9',
          color: isBookmarked ? '#FFFFFF' : '#E992B4',
        }}
        aria-label={isBookmarked ? t('documents.unbookmark_label') : t('documents.bookmark_label')}
      >
        <Bookmark
          size={16}
          className="shrink-0"
          fill={isBookmarked ? 'currentColor' : 'none'}
        />
      </button>
    </div>
  );
}
