import { useState, useEffect } from 'react';
import { AksornsaraLayout } from './AksornsaraLayout';

interface CategoryItem {
  name: string;
  pct: number;
  count: number;
  bar_color?: string;
  dot_color?: string;
  barColor?: string;
  dotColor?: string;
}

interface TrendingArticle {
  title: string;
  views: string;
  author: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

const DEFAULT_COLORS = [
  { bar: '#CA5582', dot: '#CA5582' },
  { bar: '#DE5D8F', dot: '#DE5D8F' },
  { bar: '#E57DA5', dot: '#E57DA5' },
  { bar: '#E992B4', dot: '#E992B4' },
  { bar: '#F0B4CB', dot: '#F0B4CB' },
  { bar: '#F5CDDC', dot: '#F5CDDC' },
  { bar: '#FCEFF4', dot: '#FCEFF4' },
];

export function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>([]);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE}/v1/dashboard/categories`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer mock.jwt.admin',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setTotalCategories(data.total_categories_count ?? (data.categories ? data.categories.length : 0));
          if (Array.isArray(data.categories)) {
            setCategories(data.categories);
          }
          if (Array.isArray(data.trending_articles)) {
            setTrendingArticles(data.trending_articles);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load categories from database', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const CIRCUMFERENCE = 326.7;
  let accumulatedPct = 0;

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
            className="flex-1 flex flex-col sm:flex-row items-center justify-between w-full"
            style={{
              minHeight: 608,
              borderRadius: 24,
              border: '1px solid #D4C2C2',
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.03)',
              padding: '24px 28px',
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
                {/* Dynamic Segments matching real category percentages */}
                {categories.map((cat, idx) => {
                  const segLength = (CIRCUMFERENCE * (cat.pct || 0)) / 100;
                  const offset = -(CIRCUMFERENCE * accumulatedPct) / 100;
                  accumulatedPct += (cat.pct || 0);
                  const color = cat.bar_color || cat.barColor || DEFAULT_COLORS[idx % DEFAULT_COLORS.length].bar;

                  if (cat.pct <= 0) return null;
                  return (
                    <circle
                      key={cat.name}
                      cx="63"
                      cy="62.5"
                      r="52"
                      fill="none"
                      stroke={color}
                      strokeWidth="16"
                      strokeDasharray={`${segLength} ${CIRCUMFERENCE}`}
                      strokeDashoffset={offset}
                      transform="rotate(-90 63 62.5)"
                    />
                  );
                })}
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
                  {totalCategories}
                </span>
                <span
                  className="font-medium text-[#504444]"
                  style={{
                    fontFamily: 'Loma, sans-serif',
                    fontSize: 12,
                    lineHeight: '12px',
                  }}
                >
                  หมวดหมู่
                </span>
              </div>
            </div>

            {/* Category Breakdown Bars */}
            <div className="flex flex-col flex-1 w-full" style={{ gap: 16 }}>
              {isLoading ? (
                <div className="text-center py-8 text-gray-400 font-serif">กำลังโหลดข้อมูล...</div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-gray-400 font-serif">ไม่พบหมวดหมู่ในฐานข้อมูล</div>
              ) : (
                categories.map((cat, idx) => {
                  const barColor = cat.bar_color || cat.barColor || DEFAULT_COLORS[idx % DEFAULT_COLORS.length].bar;
                  const dotColor = cat.dot_color || cat.dotColor || DEFAULT_COLORS[idx % DEFAULT_COLORS.length].dot;
                  return (
                    <div key={cat.name} className="flex flex-col" style={{ gap: 4 }}>
                      <div className="flex items-center justify-between" style={{ height: 25 }}>
                        <div className="flex items-center" style={{ gap: 8 }}>
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 9999,
                              backgroundColor: dotColor,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            className="font-bold text-[#121C28]"
                            style={{
                              fontFamily: 'ChulaCharasNew, sans-serif',
                              fontSize: 18,
                              lineHeight: '24px',
                            }}
                          >
                            {cat.name}
                          </span>
                        </div>
                        <span
                          className="font-bold text-[#121C28]"
                          style={{
                            fontFamily: 'ChulaCharasNew, sans-serif',
                            fontSize: 18,
                            lineHeight: '24px',
                          }}
                        >
                          {cat.pct}%
                        </span>
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
                            width: `${Math.min(100, Math.max(2, cat.pct))}%`,
                            height: 8,
                            borderRadius: 9999,
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ════ RIGHT CARD: Trending List Card ════ */}
          <div
            className="flex flex-col w-full lg:w-[435px]"
            style={{
              minHeight: 608,
              borderRadius: 24,
              border: '1px solid #D4C2C2',
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.03)',
              padding: 24,
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
              {isLoading ? (
                <div className="text-center py-8 text-gray-400 font-serif">กำลังโหลดข้อมูล...</div>
              ) : trendingArticles.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-serif">
                  ยังไม่มีบทความยอดนิยม
                </div>
              ) : (
                trendingArticles.map((article, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      width: '100%',
                      minHeight: 80,
                      borderRadius: 12,
                      border: 'none',
                      padding: '8px 0',
                      marginBottom: idx < trendingArticles.length - 1 ? 16 : 0,
                    }}
                  >
                    <p
                      className="font-bold text-[#121C28]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 18,
                        lineHeight: '24px',
                        margin: 0,
                        minHeight: 48,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {article.title}
                    </p>
                    <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
                      <div className="flex items-center" style={{ gap: 6 }}>
                        <span
                          className="font-bold text-[#504444]"
                          style={{
                            fontFamily: 'ChulaCharasNew, sans-serif',
                            fontSize: 14,
                            lineHeight: '20px',
                          }}
                        >
                          👁 {article.views}
                        </span>
                      </div>
                      <span
                        className="font-bold text-[#504444]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 14,
                          lineHeight: '20px',
                        }}
                      >
                        {article.author}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </AksornsaraLayout>
  );
}

export default CategoriesPage;
