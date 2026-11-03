import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Download,
  FileText,
  MessageSquare,
  TrendingUp,
  Eye,
  MoreHorizontal,
  PenSquare,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { AksornsaraLayout } from './AksornsaraLayout';
import { articlesService } from './services/articlesService';

// ─── Chart Tooltip ─────────────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      month?: string;
      monthFull?: string;
      name?: string;
      year?: string;
      views?: number;
      articleCount?: number;
      count?: number;
    };
  }>;
  label?: string;
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const title = data.monthFull || data.name || data.year || label || '';
    const views = typeof data.views === 'number' ? data.views : 0;
    const count = typeof data.articleCount === 'number' ? data.articleCount : data.count;

    return (
      <div
        className="bg-white p-3 rounded-[10px] shadow-lg border border-[#F0B4CB]"
        style={{ fontFamily: 'ChulaCharasNew, serif' }}
      >
        <p className="font-bold text-[#1A1C1C] text-[15px] m-0 mb-1">
          {title}
        </p>
        <p className="text-[13px] text-[#DE5D8F] font-bold m-0 flex items-center gap-1.5">
          <Eye size={14} />
          <span>ยอดเข้าชม: {views.toLocaleString()} ครั้ง</span>
        </p>
        {typeof count === 'number' && (
          <p className="text-[12px] text-[#6D6D6D] m-0 mt-0.5">
            จำนวนบทความ: {count.toLocaleString()} บทความ
          </p>
        )}
      </div>
    );
  }
  return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  badge?: string;
  iconBg: string;
  icon: React.ElementType;
  onClick?: () => void;
}

function MetricCard({ label, value, badge, iconBg, icon: Icon, onClick }: MetricCardProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className="bg-white rounded-[12px] p-6 flex flex-col transition-all text-left w-full hover:shadow-md border border-gray-100"
      onClick={onClick}
      style={{
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.02), 0px 1px 3px 0px rgba(0,0,0,0.05)',
        cursor: onClick ? 'pointer' : 'default',
        pointerEvents: 'all',
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-[8px] flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={18} color="#DE5D8F" />
        </div>
        {badge && (
          <span
            className="text-[12px] font-bold px-2.5 py-0.5 rounded-full font-serif"
            style={{ backgroundColor: '#ECF4E7', color: '#64A93C' }}
          >
            ↑ {badge}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p
          className="font-bold text-[#6D6D6D] font-serif m-0"
          style={{ fontSize: 14, lineHeight: '20px' }}
        >
          {label}
        </p>
        <p
          className="font-bold mt-1 mb-0 font-serif"
          style={{
            fontSize: 26,
            lineHeight: '34px',
            color: '#1A1C1C',
          }}
        >
          {value}
        </p>
      </div>
    </Tag>
  );
}

interface TopCategoryCardProps {
  totalCategories: number;
  onClick?: () => void;
}

function TopCategoryCard({ totalCategories, onClick }: TopCategoryCardProps) {
  return (
    <div
      className="bg-white rounded-[12px] p-6 flex flex-col transition-all cursor-pointer hover:shadow-md border border-gray-100"
      onClick={onClick}
      style={{
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.02), 0px 1px 3px 0px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-[8px] flex items-center justify-center bg-[#FCEFF4]"
        >
          <TrendingUp size={18} color="#DE5D8F" />
        </div>
      </div>
      <div className="mt-4">
        <p
          className="font-bold text-[#6D6D6D] font-serif m-0"
          style={{ fontSize: 14, lineHeight: '20px' }}
        >
          หมวดหมู่คลังบทความ
        </p>
        <p
          className="font-bold mt-1 mb-0 font-serif"
          style={{
            fontSize: 26,
            lineHeight: '34px',
            color: '#1A1C1C',
          }}
        >
          {totalCategories} หมวดหมู่
        </p>
        <div className="flex items-baseline gap-2 mt-1 flex-wrap font-serif">
          <span className="font-bold text-[12px] text-[#CA5582]">7 หมวดหมู่หลัก</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export function AksornsaraPage() {
  const [search, setSearch] = useState('');
  const [chartMode, setChartMode] = useState<'monthly' | 'category' | 'year'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(2026);
  const navigate = useNavigate();

  const [version, setVersion] = useState(0);

  useEffect(() => {
    articlesService.syncWithApi();
    return articlesService.subscribe(() => setVersion((v) => v + 1));
  }, []);

  // Load real metrics from articlesService
  const metrics = useMemo(() => {
    return articlesService.getMetrics();
  }, [version]);

  // Load monthly views data from articlesService
  const monthlyData = useMemo(() => {
    return articlesService.getMonthlyViewsData(selectedYear);
  }, [version, selectedYear]);

  const currentChartData = useMemo(() => {
    if (chartMode === 'monthly') {
      return monthlyData.map((m) => ({
        label: m.month,
        views: m.views,
        count: m.articleCount,
        monthFull: m.monthFull,
      }));
    }
    if (chartMode === 'category') {
      return metrics.categoryData.map((c) => ({
        label: c.name,
        views: c.views,
        count: c.count,
        monthFull: `หมวดหมู่: ${c.name}`,
      }));
    }
    return metrics.yearlyData.map((y) => ({
      label: y.year,
      views: y.count,
      count: y.count,
      monthFull: y.year,
    }));
  }, [chartMode, monthlyData, metrics]);

  const maxChartVal = useMemo(() => {
    return Math.max(...currentChartData.map((d) => d.views), 1);
  }, [currentChartData]);

  const handleExportData = () => {
    const data = articlesService.getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aksornsara_articles_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <AksornsaraLayout showBackButton={false} searchValue={search} onSearchChange={setSearch}>
      <div className="w-full flex flex-col gap-8" style={{ maxWidth: 1100 }}>

        {/* ── Dashboard Header ── */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 w-full"
          style={{ maxWidth: 956 }}
        >
          <div>
            <h1 className="font-bold text-[#1A1C1C] text-[32px] md:text-[44px] leading-tight m-0 font-serif">
              Dashboard Overview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/aksornsara/create')}
              className="flex items-center gap-2 text-white font-bold cursor-pointer border-none shadow-sm hover:opacity-90 active:scale-95 transition-all font-serif"
              style={{
                fontSize: 14,
                backgroundColor: '#E992B4',
                borderRadius: 9999,
                height: 42,
                padding: '0 22px',
              }}
            >
              <PenSquare size={16} />
              <span>สร้างบทความใหม่</span>
            </button>

            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-1.5 text-[#404041] font-bold cursor-pointer border border-[#DFDFE0] bg-white hover:bg-gray-50 active:scale-95 transition-all font-serif"
              style={{
                fontSize: 13,
                borderRadius: 9999,
                height: 42,
                padding: '0 20px',
              }}
            >
              <Download size={14} />
              <span>ส่งออกข้อมูล</span>
            </button>
          </div>
        </div>

        {/* ── Key Metrics Row ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full"
        >
          <MetricCard
            label="ยอดเข้าชมทั้งหมด"
            value={`${metrics.totalViews.toLocaleString()} ครั้ง`}
            iconBg="#FCEFF4"
            icon={Eye}
            onClick={() => navigate('/aksornsara/traffic')}
          />
          <TopCategoryCard
            totalCategories={metrics.totalCategories}
            onClick={() => navigate('/aksornsara/categories')}
          />
          <MetricCard
            label="บทความที่เผยแพร่แล้ว"
            value={`${metrics.publishedCount} บทความ`}
            iconBg="#FCEFF4"
            icon={FileText}
            onClick={() => navigate('/aksornsara/published-articles')}
          />
          <MetricCard
            label="ร่างบทความ"
            value={`${metrics.draftCount} ร่าง`}
            iconBg="#FCEFF4"
            icon={MessageSquare}
            onClick={() => navigate('/aksornsara/articles')}
          />
        </div>

        {/* ── Bottom content row ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

          {/* Left column */}
          <div className="flex flex-col gap-6 w-full lg:flex-1 min-w-0">

            {/* Monthly Views Chart (Recharts Library) */}
            <div
              className="bg-white rounded-[12px] w-full border border-gray-100 shadow-xs"
              style={{
                maxWidth: 680,
                padding: '24px 24px 28px',
              }}
            >
              {/* Chart header */}
              <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                <div className="flex flex-col gap-0.5">
                  <span
                    className="font-bold text-black font-serif"
                    style={{ fontSize: 20, lineHeight: '28px' }}
                  >
                    {chartMode === 'monthly'
                      ? 'ภาพรวมการเข้าชมในแต่ละเดือน'
                      : chartMode === 'category'
                      ? 'ภาพรวมสถิติคลังบทความตามหมวดหมู่'
                      : 'ภาพรวมสถิติคลังบทความตามปีตีพิมพ์'}
                  </span>
                </div>

                {/* Right controls: Year selector + Mode pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  {chartMode === 'monthly' && (
                    <select
                      value={selectedYear}
                      onChange={(e) =>
                        setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))
                      }
                      className="bg-[#F7F8F9] border border-[#DFDFE0] rounded-full px-3 py-1 text-[13px] font-bold text-[#545455] font-serif cursor-pointer outline-none hover:border-[#E992B4] transition-colors"
                      style={{ height: 32 }}
                    >
                      <option value={2026}>ปี 2026</option>
                      <option value={2025}>ปี 2025</option>
                      <option value={2024}>ปี 2024</option>
                      <option value={2023}>ปี 2023</option>
                      <option value={2022}>ปี 2022</option>
                      <option value={2021}>ปี 2021</option>
                      <option value="all">รวมทุกปี</option>
                    </select>
                  )}

                  {/* Toggle chart mode */}
                  <div
                    className="flex items-center rounded-full p-0.5"
                    style={{ border: '1px solid #DFDFE0', backgroundColor: '#F7F8F9', height: 32 }}
                  >
                    <button
                      type="button"
                      onClick={() => setChartMode('monthly')}
                      className="font-bold cursor-pointer border-none transition-all font-serif"
                      style={{
                        fontSize: 12,
                        padding: '4px 12px',
                        borderRadius: 9999,
                        backgroundColor: chartMode === 'monthly' ? '#E992B4' : 'transparent',
                        color: chartMode === 'monthly' ? '#fff' : '#6D6D6D',
                      }}
                    >
                      รายเดือน
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartMode('category')}
                      className="font-bold cursor-pointer border-none transition-all font-serif"
                      style={{
                        fontSize: 12,
                        padding: '4px 12px',
                        borderRadius: 9999,
                        backgroundColor: chartMode === 'category' ? '#E992B4' : 'transparent',
                        color: chartMode === 'category' ? '#fff' : '#6D6D6D',
                      }}
                    >
                      หมวดหมู่
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartMode('year')}
                      className="font-bold cursor-pointer border-none transition-all font-serif"
                      style={{
                        fontSize: 12,
                        padding: '4px 12px',
                        borderRadius: 9999,
                        backgroundColor: chartMode === 'year' ? '#E992B4' : 'transparent',
                        color: chartMode === 'year' ? '#fff' : '#6D6D6D',
                      }}
                    >
                      ปีตีพิมพ์
                    </button>
                  </div>
                </div>
              </div>

              {/* Responsive Recharts Bar Chart */}
              <div className="w-full" style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentChartData}
                    margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid stroke="#F3EBF0" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#9E4266', fontSize: 13, fontFamily: 'ChulaCharasNew' }}
                      axisLine={{ stroke: '#DFDFE0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#99999A', fontSize: 12, fontFamily: 'ChulaCharasNew' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Bar
                      dataKey="views"
                      radius={[6, 6, 0, 0]}
                      animationDuration={600}
                    >
                      {currentChartData.map((entry, index) => {
                        const val = entry.views;
                        const isMax = val > 0 && val === maxChartVal;
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={isMax ? '#DE5D8F' : '#F5CDDC'}
                            className="hover:opacity-85 transition-opacity cursor-pointer"
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Performing Articles Table */}
            <div
              className="bg-white rounded-[12px] overflow-hidden border border-gray-100 shadow-xs w-full"
              style={{ maxWidth: 680 }}
            >
              {/* Table top bar */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b border-gray-100"
              >
                <span className="font-bold text-black font-serif" style={{ fontSize: 20 }}>
                  บทความยอดนิยม (Top Articles)
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/aksornsara/articles')}
                  className="text-[#DE5D8F] font-serif font-bold text-[13px] hover:underline border-none bg-transparent cursor-pointer"
                >
                  ดูทั้งหมด ({metrics.totalArticles}) →
                </button>
              </div>

              {metrics.topArticles.length > 0 ? (
                <>
                  {/* Column headers */}
                  <div
                    className="grid py-3 px-6 font-bold text-[#6D6D6D] text-[13px] font-serif border-b border-gray-100"
                    style={{
                      gridTemplateColumns: '1fr 100px 90px 48px',
                      backgroundColor: '#F7F8F9',
                    }}
                  >
                    <div>ชื่อบทความ</div>
                    <div className="text-center">หมวดหมู่</div>
                    <div className="text-center">ยอดเข้าชม</div>
                    <div></div>
                  </div>

                  {/* Real Article rows */}
                  {metrics.topArticles.map((art) => (
                    <div
                      key={art.id}
                      className="grid items-center hover:bg-[#FAFAFA] transition-colors cursor-pointer py-3.5 px-6 border-b border-gray-50 last:border-none"
                      onClick={() => navigate(`/aksornsara/create?id=${art.id}`)}
                      style={{
                        gridTemplateColumns: '1fr 100px 90px 48px',
                      }}
                    >
                      {/* Article title + thumbnail */}
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div
                          className="w-10 h-10 rounded-[6px] overflow-hidden shrink-0 bg-gray-100 border border-gray-100"
                        >
                          {art.coverImage ? (
                            <img src={art.coverImage} alt={art.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#FCEFF4] flex items-center justify-center text-[#DE5D8F] text-[10px] font-bold">
                              ART
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-black truncate font-serif text-[14px]">
                            {art.title}
                          </span>
                          <span className="text-[#6D6D6D] font-serif text-[12px] truncate">
                            เขียนโดย: {art.author}
                          </span>
                        </div>
                      </div>

                      {/* Category / Year */}
                      <div className="text-center">
                        <span
                          className="inline-block px-2 py-0.5 rounded-[6px] font-sans font-normal text-[11px] text-[#DE5D8F] bg-[#FCEFF4]"
                          style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}
                        >
                          {art.category?.replace(/^ปี\s*/, '')}
                        </span>
                      </div>

                      {/* Views */}
                      <div className="text-center font-serif font-bold text-[14px] text-gray-800">
                        {art.views.toLocaleString()}
                      </div>

                      {/* Action button */}
                      <div className="flex justify-center">
                        <button
                          type="button"
                          title="แก้ไขบทความ"
                          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black border-none bg-transparent cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/aksornsara/create?id=${art.id}`);
                          }}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#FCEFF4] flex items-center justify-center text-[#DE5D8F] mb-2.5">
                    <Eye size={18} />
                  </div>
                  <p className="font-serif font-bold text-[#1A1C1C] text-[15px] m-0">
                    ยังไม่มีสถิติยอดเข้าชม
                  </p>
                  <p className="font-serif text-gray-400 text-[13px] m-0 mt-1">
                    ยอดเข้าชมเริ่มต้นที่ 0 และจะจัดอันดับอัตโนมัติเมื่อมีสถิติการเข้าชมจริง
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Panel */}
          <div
            className="bg-white rounded-[12px] shrink-0 w-full lg:w-[320px] border border-gray-100 shadow-xs"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <span className="font-bold text-black font-serif" style={{ fontSize: 18 }}>
                บทความล่าสุด
              </span>
              <span
                className="font-bold text-[#DE5D8F] cursor-pointer hover:underline text-[13px] font-serif"
                onClick={() => navigate('/aksornsara/articles')}
              >
                ดูทั้งหมด ({metrics.totalArticles})
              </span>
            </div>

            {/* Activity feed timeline */}
            {metrics.recentArticles.length > 0 ? (
              <div className="flex flex-col p-6 gap-4">
                {metrics.recentArticles.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex gap-3 cursor-pointer group"
                    onClick={() => navigate(`/aksornsara/create?id=${item.id}`)}
                  >
                    <div className="flex flex-col items-center" style={{ width: 32 }}>
                      <div
                        className="flex items-center justify-center rounded-[8px] shrink-0 group-hover:bg-[#F5CDDC] transition-colors w-8 h-8 bg-[#FCEFF4]"
                      >
                        <FileText size={14} color="#DE5D8F" />
                      </div>
                      {idx < metrics.recentArticles.length - 1 && (
                        <div
                          style={{
                            width: 2,
                            flex: 1,
                            backgroundColor: '#DFDFE0',
                            minHeight: 24,
                          }}
                        />
                      )}
                    </div>

                    <div className="flex flex-col pb-2 flex-1 min-w-0">
                      <span className="font-bold text-black leading-snug group-hover:text-[#DE5D8F] transition-colors truncate font-serif text-[14px]">
                        {item.title}
                      </span>
                      <span className="text-gray-500 text-[12px] font-serif truncate mt-0.5">
                        {item.author || 'ไม่ระบุผู้เขียน'} ({item.category})
                      </span>
                      <span className="text-gray-400 text-[11px] font-serif mt-0.5">
                        {item.publishedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#FCEFF4] flex items-center justify-center text-[#DE5D8F] mb-3">
                  <FileText size={20} />
                </div>
                <p className="font-serif font-bold text-[#1A1C1C] text-[15px] m-0">
                  ยังไม่มีบทความล่าสุด
                </p>
                <p className="font-serif text-gray-400 text-[13px] m-0 mt-1">
                  เมื่อมีการสร้างหรืออัปเดตบทความใหม่ ข้อมูลจะแสดงที่นี่
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </AksornsaraLayout>
  );
}

export { AksornsaraPage as SaraniyakornPage };
export default AksornsaraPage;
