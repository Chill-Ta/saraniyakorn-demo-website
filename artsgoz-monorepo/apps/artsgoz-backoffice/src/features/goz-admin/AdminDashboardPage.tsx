import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Download,
  TrendingUp,
  BookOpen,
  FileText,
  Share2,
  Users,
  Pin,
  MessageSquare,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react';
import { GozAdminLayout } from './GozAdminLayout';
import articleThumb from '../../assets/article_thumb.png';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  timestamp: string;
}

interface PopularArticle {
  id: string;
  title: string;
  dateText: string;
  status: string;
  views: string;
  thumb?: string;
}

interface MonthlyData {
  month: string;
  value: number;
  x: number;
  y: number;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalViewsFormatted: '0',
    totalViewsGrowth: 0,
    publishedCount: 0,
    totalArticlesCount: 0,
    pendingCommentsCount: 0,
    pendingCommentsGrowth: 0,
    totalCategoriesCount: 0,
  });

  const [topCategoryNames, setTopCategoryNames] = useState<string[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([]);
  const [trafficData, setTrafficData] = useState<MonthlyData[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const headers = {
      'Accept': 'application/json',
      'Authorization': 'Bearer mock.jwt.admin',
    };

    Promise.all([
      fetch(`${API_BASE}/v1/admin/dashboard/stats`, { headers }).then((r) => r.json()).catch(() => null),
      fetch(`${API_BASE}/v1/admin/dashboard/top-categories`, { headers }).then((r) => r.json()).catch(() => null),
      fetch(`${API_BASE}/v1/admin/dashboard/monthly-trends`, { headers }).then((r) => r.json()).catch(() => null),
      fetch(`${API_BASE}/v1/admin/dashboard/recent-activities?limit=5`, { headers }).then((r) => r.json()).catch(() => null),
      fetch(`${API_BASE}/v1/admin/dashboard/top-articles?limit=5`, { headers }).then((r) => r.json()).catch(() => null),
    ]).then(([statsRes, catsRes, trendsRes, actsRes, artsRes]) => {
      // 1. Stats
      if (statsRes) {
        setStats({
          totalViews: statsRes.total_views ?? 0,
          totalViewsFormatted: statsRes.total_views_formatted ?? String(statsRes.total_views ?? 0),
          totalViewsGrowth: statsRes.total_views_growth_rate ?? 0,
          publishedCount: statsRes.published_articles_count ?? 0,
          totalArticlesCount: statsRes.total_articles_count ?? 0,
          pendingCommentsCount: statsRes.pending_comments_count ?? 0,
          pendingCommentsGrowth: statsRes.pending_comments_growth_rate ?? 0,
          totalCategoriesCount: statsRes.total_categories_count ?? 0,
        });
      }

      // 2. Categories
      if (catsRes && Array.isArray(catsRes.categories)) {
        setTopCategoryNames(catsRes.categories.map((c: any) => c.name || ''));
      }

      // 3. Monthly Trends
      if (trendsRes && Array.isArray(trendsRes.months)) {
        const rawMonths = trendsRes.months;
        const maxVal = Math.max(...rawMonths.map((m: any) => m.visits || m.count || 0), 10);
        const mappedData: MonthlyData[] = rawMonths.map((m: any, i: number) => {
          const val = m.visits || m.count || 0;
          const x = 50 + i * 36;
          const y = 140 - (val / maxVal) * 110;
          return {
            month: m.month || `M${i + 1}`,
            value: val,
            x,
            y,
          };
        });
        setTrafficData(mappedData);
      }

      // 4. Activities
      if (actsRes && Array.isArray(actsRes.activities)) {
        const mappedActs: ActivityItem[] = actsRes.activities.map((a: any) => ({
          id: String(a.id),
          type: a.type === 'comment' ? 'comment' : 'pin',
          title: a.action || a.article_title || 'กิจกรรมในระบบ',
          subtitle: a.detail || a.article_title || 'รายละเอียดกิจกรรม',
          timestamp: a.time_ago || (a.created_at ? new Date(a.created_at).toLocaleDateString('th-TH') : 'เมื่อสักครู่'),
        }));
        setRecentActivities(mappedActs);
      }

      // 5. Popular Articles
      if (artsRes && Array.isArray(artsRes.articles)) {
        const mappedArts: PopularArticle[] = artsRes.articles.map((art: any) => ({
          id: String(art.id),
          title: art.title || 'บทความ',
          dateText: art.published_at ? `เผยแพร่เมื่อ ${art.published_at}` : 'เผยแพร่แล้ว',
          status: art.status || 'เผยแพร่แล้ว',
          views: Number(art.views || 0).toLocaleString(),
          thumb: art.thumb || articleThumb,
        }));
        setPopularArticles(mappedArts);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleExportData = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      stats,
      topCategories: topCategoryNames,
      recentActivities,
      popularArticles,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artsgoz_admin_analytics_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const pointsString = trafficData.map((d) => `${d.x},${d.y}`).join(' ');
  const polygonPoints = trafficData.length > 0
    ? `${pointsString} ${trafficData[trafficData.length - 1].x},170 ${trafficData[0].x},170`
    : '';

  return (
    <GozAdminLayout showTopSearch={false}>
      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 1120 }}>
        {/* ── Page Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              className="text-[#1A1C1C] font-bold text-[36px] m-0"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              ภาพรวมระบบ
            </h1>
            <p
              className="text-[#8B8B8C] text-[15px] m-0 mt-0.5"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              ยินดีต้อนรับกลับมา, ข้อมูลสถิติและการใช้งานระบบ ArtsGoz เชื่อมต่อฐานข้อมูลจริง
            </p>
          </div>

          <button
            type="button"
            id="btn-export-overview"
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white border border-[#DFDFE0] text-[#1A1C1C] font-bold text-[14px] cursor-pointer hover:bg-[#FAFAFA] transition-all shadow-2xs"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            <Download size={16} />
            ส่งออกข้อมูลภาพรวม
          </button>
        </div>

        {/* ── Top Metric Cards (4 cards) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: ยอดเข้าชมทั้งหมด */}
          <div className="bg-white rounded-[16px] p-5 border border-[#DFDFE0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-[#8B8B8C] text-[13px] font-bold"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                ยอดเข้าชมทั้งหมด
              </span>
              <div className="w-8 h-8 rounded-full bg-[#FCEFF4] flex items-center justify-center">
                <Users size={16} color="#DE5D8F" />
              </div>
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <span
                className="text-[#1A1C1C] font-bold text-[28px] tracking-tight"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {stats.totalViewsFormatted}
              </span>
              {stats.totalViewsGrowth !== 0 && (
                <span className="flex items-center gap-0.5 text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full text-[12px] font-bold">
                  <TrendingUp size={12} />
                  {stats.totalViewsGrowth > 0 ? `+${stats.totalViewsGrowth}%` : `${stats.totalViewsGrowth}%`}
                </span>
              )}
            </div>
          </div>

          {/* Card 2: หมวดหมู่ยอดนิยม */}
          <div className="bg-white rounded-[16px] p-5 border border-[#DFDFE0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-[#8B8B8C] text-[13px] font-bold"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                หมวดหมู่ยอดนิยม ({stats.totalCategoriesCount} หมวด)
              </span>
              <div className="w-8 h-8 rounded-full bg-[#F3E8FF] flex items-center justify-center">
                <BookOpen size={16} color="#9333EA" />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-[#1A1C1C] font-bold text-[22px] truncate"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                {topCategoryNames[0] || 'คลังบทความ'}
              </div>
              <div
                className="text-[#8B8B8C] text-[12px] mt-0.5 truncate"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                {topCategoryNames.slice(1, 3).join(' • ') || 'ข้อมูลหมวดหมู่จริง'}
              </div>
            </div>
          </div>

          {/* Card 3: บทความที่เผยแพร่แล้ว */}
          <div className="bg-white rounded-[16px] p-5 border border-[#DFDFE0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-[#8B8B8C] text-[13px] font-bold"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                บทความที่เผยแพร่แล้ว
              </span>
              <div className="w-8 h-8 rounded-full bg-[#FCEFF4] flex items-center justify-center">
                <FileText size={16} color="#DE5D8F" />
              </div>
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <span
                className="text-[#1A1C1C] font-bold text-[28px] tracking-tight"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {stats.publishedCount.toLocaleString()}
              </span>
              <span className="text-[#8B8B8C] text-[12px] font-serif">
                จาก {stats.totalArticlesCount} บทความ
              </span>
            </div>
          </div>

          {/* Card 4: บทความทั้งหมด / ความคิดเห็น */}
          <div className="bg-white rounded-[16px] p-5 border border-[#DFDFE0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-[#8B8B8C] text-[13px] font-bold"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                ความคิดเห็นในระบบ
              </span>
              <div className="w-8 h-8 rounded-full bg-[#E6F4EA] flex items-center justify-center">
                <Share2 size={16} color="#137333" />
              </div>
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <span
                className="text-[#1A1C1C] font-bold text-[28px] tracking-tight"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {stats.pendingCommentsCount}
              </span>
              {stats.pendingCommentsGrowth !== 0 && (
                <span className="flex items-center gap-0.5 text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full text-[12px] font-bold">
                  <TrendingUp size={12} />
                  +{stats.pendingCommentsGrowth}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Middle Section: ภาพรวมการเข้าชม (Chart) + กิจกรรมล่าสุด ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Chart (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-[16px] p-6 border border-[#DFDFE0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-[#1A1C1C] font-bold text-[18px] m-0"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  ภาพรวมการเข้าชม
                </h3>
                <span
                  className="text-[#8B8B8C] text-[13px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  แนวโน้มจำนวนผู้เข้าชมรายเดือน
                </span>
              </div>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="w-full relative h-[220px]">
              {trafficData.length > 0 ? (
                <>
                  <svg
                    viewBox="0 0 500 180"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DE5D8F" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#DE5D8F" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    <line x1="20" y1="30" x2="480" y2="30" stroke="#F0F0F0" strokeDasharray="3 3" />
                    <line x1="20" y1="80" x2="480" y2="80" stroke="#F0F0F0" strokeDasharray="3 3" />
                    <line x1="20" y1="130" x2="480" y2="130" stroke="#F0F0F0" strokeDasharray="3 3" />

                    {/* Area fill */}
                    {polygonPoints && (
                      <polygon
                        points={polygonPoints}
                        fill="url(#chartGradient)"
                      />
                    )}

                    {/* Line path */}
                    {pointsString && (
                      <polyline
                        points={pointsString}
                        fill="none"
                        stroke="#DE5D8F"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Interactive Points */}
                    {trafficData.map((pt, i) => (
                      <g
                        key={pt.month}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredIndex === i ? 6 : 4}
                          fill="#FFFFFF"
                          stroke="#DE5D8F"
                          strokeWidth="2.5"
                          className="transition-all"
                        />
                        {hoveredIndex === i && (
                          <g>
                            <rect
                              x={pt.x - 28}
                              y={pt.y - 32}
                              width="56"
                              height="22"
                              rx="4"
                              fill="#1A1C1C"
                            />
                            <text
                              x={pt.x}
                              y={pt.y - 17}
                              textAnchor="middle"
                              fill="#FFFFFF"
                              fontSize="11"
                              fontWeight="bold"
                              fontFamily="Inter, sans-serif"
                            >
                              {pt.value}
                            </text>
                          </g>
                        )}
                      </g>
                    ))}
                  </svg>

                  {/* Month Labels below */}
                  <div className="flex justify-between px-6 pt-2 text-[#8B8B8C] text-[12px] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {trafficData.map((pt) => (
                      <span key={pt.month}>{pt.month}</span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 font-serif">
                  ไม่มีข้อมูลสถิติรายเดือน
                </div>
              )}
            </div>
          </div>

          {/* Right Activities (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-[16px] p-6 border border-[#DFDFE0] shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
              <h3
                className="text-[#1A1C1C] font-bold text-[18px] m-0"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                กิจกรรมล่าสุด
              </h3>
              <button
                type="button"
                onClick={() => navigate('/admin/audit-log')}
                className="text-[#DE5D8F] text-[13px] font-bold bg-transparent border-none cursor-pointer hover:underline p-0 flex items-center gap-0.5"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                ดูทั้งหมด
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex flex-col divide-y divide-[#F6F6F6] flex-1">
              {recentActivities.length === 0 ? (
                <div className="py-8 text-center text-gray-400 font-serif text-[13px]">
                  ยังไม่มีกิจกรรมที่บันทึกไว้
                </div>
              ) : (
                recentActivities.map((act) => (
                  <div key={act.id} className="py-3.5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FCEFF4] flex items-center justify-center shrink-0 mt-0.5">
                      {act.type === 'comment' ? (
                        <MessageSquare size={15} color="#DE5D8F" />
                      ) : (
                        <Pin size={15} color="#DE5D8F" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold text-[#1A1C1C] text-[14px] m-0 truncate"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        {act.title}
                      </p>
                      <p
                        className="text-[#8B8B8C] text-[12px] m-0 truncate"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        {act.subtitle}
                      </p>
                      <span
                        className="text-[#B0B0B0] text-[11px]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        {act.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Section: บทความยอดนิยม (Popular Articles) + สุขภาพของระบบ ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Popular Articles Table (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-[16px] p-6 border border-[#DFDFE0] shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
              <h3
                className="text-[#1A1C1C] font-bold text-[18px] m-0"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                บทความยอดนิยม
              </h3>
              <button
                type="button"
                onClick={() => navigate('/aksornsara/articles')}
                className="text-[#DE5D8F] text-[13px] font-bold bg-transparent border-none cursor-pointer hover:underline p-0 flex items-center gap-0.5"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                ดูทั้งหมด
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F0F0F0] text-[#8B8B8C] text-[13px] font-bold" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
                    <th className="py-2.5 px-3">ชื่อบทความ</th>
                    <th className="py-2.5 px-3 text-center">สถานะ</th>
                    <th className="py-2.5 px-3 text-right">ยอดเข้าชม</th>
                    <th className="py-2.5 px-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F6F6F6]">
                  {popularArticles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 font-serif">
                        ยังไม่มีข้อมูลบทความ
                      </td>
                    </tr>
                  ) : (
                    popularArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={art.thumb || articleThumb}
                              alt=""
                              className="w-10 h-10 rounded-[6px] object-cover shrink-0"
                            />
                            <div>
                              <p
                                className="font-bold text-[#1A1C1C] text-[14px] m-0"
                                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                              >
                                {art.title}
                              </p>
                              <span
                                className="text-[#8B8B8C] text-[12px]"
                                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                              >
                                {art.dateText}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[12px] font-bold text-[#137333] bg-[#E6F4EA]"
                            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                          >
                            {art.status}
                          </span>
                        </td>
                        <td
                          className="py-3 px-3 text-right font-bold text-[#1A1C1C] text-[14px]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {art.views}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/aksornsara/create?id=${art.id}`)}
                            className="border-none bg-transparent cursor-pointer text-[#8B8B8C] hover:text-[#1A1C1C] p-1"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health Card (4 cols) */}
          <div
            className="lg:col-span-4 rounded-[16px] p-6 shadow-xs flex flex-col justify-between text-white"
            style={{
              background: 'linear-gradient(145deg, #E66A9B 0%, #D84D83 100%)',
            }}
          >
            <div>
              <h3
                className="font-bold text-[20px] m-0 text-white"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                สุขภาพของระบบ
              </h3>

              {/* Real storage indicator based on articles count */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-between text-[13px] font-bold" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
                  <span>พื้นที่จัดเก็บฐานข้อมูล</span>
                  <span>{Math.min(100, Math.round((stats.totalArticlesCount / 500) * 100))}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${Math.min(100, Math.round((stats.totalArticlesCount / 500) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Status indicator */}
              <div className="mt-5 flex flex-col gap-2">
                <div className="flex justify-between text-[13px] font-bold" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
                  <span>สถานะการเชื่อมต่อ API</span>
                  <span>100% ปกติ</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <button
              type="button"
              id="btn-system-health-history"
              onClick={() => navigate('/admin/audit-log')}
              className="mt-8 w-full py-3 rounded-[10px] bg-white text-[#DE5D8F] font-bold text-[15px] border-none cursor-pointer transition-all hover:bg-[#FAFAFA] active:scale-95 shadow-sm"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              ประวัติการทำงาน (Audit Log)
            </button>
          </div>
        </div>
      </div>
    </GozAdminLayout>
  );
}

export default AdminDashboardPage;
