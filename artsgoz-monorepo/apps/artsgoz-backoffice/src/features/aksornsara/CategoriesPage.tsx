import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AksornsaraLayout } from './AksornsaraLayout';
import { articlesService } from './services/articlesService';

const CATEGORY_COLORS: Record<string, { barColor: string; dotColor: string }> = {
  วรรณกรรม: { barColor: '#CA5582', dotColor: '#CA5582' },
  วิจารณ์:  { barColor: '#DE5D8F', dotColor: '#DE5D8F' },
  ศิลปะ:    { barColor: '#E57DA5', dotColor: '#E57DA5' },
  ปรัชญา:   { barColor: '#E992B4', dotColor: '#E992B4' },
  ภาษา:     { barColor: '#F0B4CB', dotColor: '#F0B4CB' },
  วัฒนธรรม: { barColor: '#F5CDDC', dotColor: '#F5CDDC' },
  ทั่วไป:   { barColor: '#FCEFF4', dotColor: '#E992B4' },
};

export function CategoriesPage() {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    articlesService.syncWithApi();
    return articlesService.subscribe(() => setVersion((v) => v + 1));
  }, []);

  const allArticles = useMemo(() => articlesService.getAll(), [version]);
  const metrics = useMemo(() => articlesService.getMetrics(), [version]);

  // Real categories data
  const categoriesList = useMemo(() => {
    return metrics.categoryData.map((c) => {
      const colors = CATEGORY_COLORS[c.name] || { barColor: '#E992B4', dotColor: '#E992B4' };
      return {
        name: c.name,
        count: c.count,
        views: c.views,
        pct: c.pct,
        barColor: colors.barColor,
        dotColor: colors.dotColor,
      };
    });
  }, [metrics]);

  // Real top-performing articles
  const trendingArticles = useMemo(() => {
    return [...allArticles]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 4);
  }, [allArticles]);

  const CIRCUMFERENCE = 326.7;

  return (
    <AksornsaraLayout>
      <div className="flex flex-col">
        {/* ════ MAIN HEADER ════ */}
        <div style={{ marginBottom: 24 }}>
          <h1
            className="font-bold text-[#1A1C1C]"
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
              fontSize: 48,
              lineHeight: '64px',
              margin: 0,
            }}
          >
            หมวดหมู่ยอดนิยม
          </h1>
        </div>

        {/* ════ MAIN 2-COLUMN CARDS LAYOUT ════ */}
        <div className="flex flex-col lg:flex-row items-start" style={{ gap: 24 }}>

          {/* ════ LEFT CARD: Category Count Circle on LEFT, Bars on RIGHT ════ */}
          <div
            className="shrink-0 flex flex-col md:flex-row items-center justify-between w-full lg:w-[540px]"
            style={{
              minHeight: 608,
              borderRadius: 24,
              border: '1px solid #D4C2C2',
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.03)',
              padding: '28px',
              gap: 28,
            }}
          >
            {/* Donut Chart Visual Representation */}
            <div
              className="relative flex items-center justify-center shrink-0"
              style={{
                width: 140,
                height: 140,
              }}
            >
              {/* SVG Ring Donut Chart */}
              <svg width="140" height="140" viewBox="0 0 126 125" className="absolute inset-0">
                <circle
                  cx="63"
                  cy="62.5"
                  r="52"
                  fill="none"
                  stroke="#E5EEFF"
                  strokeWidth="16"
                />
                {/* Dynamically calculate segments */}
                {(() => {
                  let accumulatedPct = 0;
                  return categoriesList.map((cat) => {
                    const strokeDash = (CIRCUMFERENCE * cat.pct) / 100;
                    const strokeOffset = -(CIRCUMFERENCE * accumulatedPct) / 100;
                    accumulatedPct += cat.pct;
                    return (
                      <circle
                        key={cat.name}
                        cx="63"
                        cy="62.5"
                        r="52"
                        fill="none"
                        stroke={cat.barColor}
                        strokeWidth="16"
                        strokeDasharray={`${strokeDash} ${CIRCUMFERENCE}`}
                        strokeDashoffset={`${strokeOffset}`}
                        transform="rotate(-90 63 62.5)"
                      />
                    );
                  });
                })()}
              </svg>

              {/* Center Donut Label */}
              <div className="flex flex-col items-center justify-center text-center z-10">
                <span
                  className="font-bold text-[#121C28]"
                  style={{
                    fontFamily: 'Be Vietnam Pro, sans-serif',
                    fontSize: 32,
                    lineHeight: '38px',
                  }}
                >
                  {metrics.totalCategories}
                </span>
                <span
                  className="font-bold text-[#504444]"
                  style={{
                    fontFamily: 'ChulaCharasNew, sans-serif',
                    fontSize: 13,
                    lineHeight: '14px',
                  }}
                >
                  หมวดหมู่หลัก
                </span>
              </div>
            </div>

            {/* Category Breakdown Bars */}
            <div className="flex flex-col flex-1 w-full" style={{ gap: 14 }}>
              {categoriesList.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => navigate(`/aksornsara/published-articles`)}
                  className="flex flex-col cursor-pointer group hover:opacity-90 transition-opacity"
                  style={{ gap: 4 }}
                >
                  <div className="flex items-center justify-between" style={{ height: 25 }}>
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 9999,
                          backgroundColor: cat.dotColor,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="font-bold text-[#121C28] group-hover:text-[#DE5D8F] transition-colors"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 18,
                          lineHeight: '24px',
                        }}
                      >
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-gray-500 font-serif"
                        style={{ fontSize: 13 }}
                      >
                        {cat.count} บทความ
                      </span>
                      <span
                        className="font-bold text-[#121C28] min-w-[36px] text-right"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 16,
                          lineHeight: '24px',
                        }}
                      >
                        {cat.pct}%
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 8,
                      borderRadius: 9999,
                      backgroundColor: '#E5EEFF',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(5, cat.pct)}%`,
                        height: 8,
                        borderRadius: 9999,
                        backgroundColor: cat.barColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════ RIGHT CARD: Trending Real Articles ════ */}
          <div
            className="flex flex-col w-full lg:w-[460px]"
            style={{
              minHeight: 608,
              borderRadius: 24,
              border: '1px solid #D4C2C2',
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.03)',
              padding: 28,
            }}
          >
            {/* Card Header */}
            <div style={{ marginBottom: 20 }}>
              <h2
                className="font-bold text-[#121C28]"
                style={{
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 28,
                  lineHeight: '36px',
                  margin: 0,
                }}
              >
                บทความที่ได้รับความนิยมที่สุด
              </h2>
            </div>

            {/* Articles List Container */}
            <div className="flex flex-col">
              {trendingArticles.map((article, idx) => (
                <div
                  key={article.id}
                  onClick={() => navigate(`/aksornsara/create?id=${article.id}`)}
                  className="flex flex-col cursor-pointer hover:bg-[#FFF9FB] p-3 rounded-[12px] transition-all group"
                  style={{
                    marginBottom: idx < trendingArticles.length - 1 ? 12 : 0,
                  }}
                >
                  <p
                    className="font-bold text-[#121C28] group-hover:text-[#DE5D8F] transition-colors"
                    style={{
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontSize: 17,
                      lineHeight: '24px',
                      margin: 0,
                      minHeight: 48,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                    title={article.title}
                  >
                    {article.title}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-[6px] font-sans font-normal text-[11px] text-[#DE5D8F] bg-[#FCEFF4]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {article.category}
                      </span>
                      <span
                        className="font-bold text-[#504444]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 14,
                          lineHeight: '20px',
                        }}
                      >
                        👁 {article.views?.toLocaleString()} ครั้ง
                      </span>
                    </div>
                    <span
                      className="text-[#6D6D6D] font-serif truncate max-w-[150px] text-[13px]"
                      title={article.author}
                    >
                      โดย {article.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AksornsaraLayout>
  );
}

export default CategoriesPage;
