import { useTranslation } from 'react-i18next';
import type { CategoryProgress } from '../types.js';

interface CreditsSummaryCardProps {
  progressList: CategoryProgress[];
}

export function CreditsSummaryCard({ progressList }: CreditsSummaryCardProps) {
  const { t } = useTranslation('credit_tracking');
  const totalCompleted = progressList.reduce((sum, item) => sum + item.completed, 0);
  const totalRequired = progressList.reduce((sum, item) => sum + item.required, 0);

  const BORDER = '0.65px solid #545455';

  const cellHeaderStyle: React.CSSProperties = {
    backgroundColor: '#E992B4',
    color: '#FFFFFF',
    fontFamily: 'ChulaCharasNew, sans-serif',
    fontSize: '18px',
    fontWeight: 700,
    lineHeight: '24px',
    textAlign: 'center',
    padding: '16px 8px',
    borderBottom: '1px solid #404041',
    minHeight: '56px',
    whiteSpace: 'nowrap',
    width: '180px',
  };

  const cellBodyStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'ChulaCharasNew, sans-serif',
    fontSize: '20px',
    fontWeight: 700,
    lineHeight: '28px',
    padding: '16px 8px',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    width: '180px',
  };

  const totalHeaderStyle: React.CSSProperties = {
    ...cellHeaderStyle,
    backgroundColor: '#D0D0D1',
    color: '#000000',
  };

  const translateKey = (key: string): string => {
    if (!key) return '';
    const cleanKey = key.replace(/^credit_tracking\./, '');
    return t(cleanKey);
  };

  return (
    <div
      className="max-w-full overflow-x-auto"
      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
    >
      {/* Rounded wrapper clips the table corners */}
      <div style={{ borderRadius: '0px', overflow: 'hidden', border: BORDER }} className="max-w-full">
        <table style={{ borderCollapse: 'collapse', width: 'max-content' }} className="max-w-full">
          {/* Header Row */}
          <thead>
            <tr>
              {progressList.map((item) => (
                <th key={item.category} style={{ ...cellHeaderStyle, borderRight: BORDER }}>
                  {translateKey(item.category)}
                </th>
              ))}
              {/* Total header */}
              <th style={{ ...totalHeaderStyle }}>{t('total')}</th>
            </tr>
          </thead>

          {/* Body Row */}
          <tbody>
            <tr>
              {progressList.map((item) => (
                <td key={item.category} style={{ ...cellBodyStyle, borderRight: BORDER }}>
                  <span style={{ color: '#DE5D8F' }}>{item.completed}</span>
                  <span style={{ color: '#000000' }}>/{item.required}</span>
                </td>
              ))}
              {/* Total body */}
              <td style={cellBodyStyle}>
                <span style={{ color: '#DE5D8F' }}>{totalCompleted}</span>
                <span style={{ color: '#000000' }}>/{totalRequired}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
