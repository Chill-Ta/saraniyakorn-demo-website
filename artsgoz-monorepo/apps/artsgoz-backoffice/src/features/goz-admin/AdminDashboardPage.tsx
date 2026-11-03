import { useState } from 'react';
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
  id: number;
  type: 'pin' | 'comment';
  title: string;
  subtitle: string;
  timestamp: string;
}

const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    type: 'pin',
    title: '10 วิธีเตรียมตัวสอบฉบับคนเวลาน้อย',
    subtitle: 'text text mocked',
    timestamp: '2 ชั่วโมงที่แล้ว',
  },
  {
    id: 2,
    type: 'comment',
    title: 'ความคิดเห็นใหม่ในบทความ...',
    subtitle: 'text text mocked',
    timestamp: '4 ชั่วโมงที่แล้ว',
  },
  {
    id: 3,
    type: 'comment',
    title: 'ความคิดเห็นใหม่ในบทความ...',
    subtitle: 'โดย สมชาย ใจดี',
    timestamp: 'เมื่อวานนี้',
  },
];

interface PopularArticle {
  id: number;
  title: string;
  dateText: string;
  status: string;
  views: string;
}

const POPULAR_ARTICLES: PopularArticle[] = [
  {
    id: 1,
    title: '10 Ways to Graduate in 2025',
    dateText: 'เขียนเมื่อ 2 วันที่แล้ว',
    status: 'เผยแพร่แล้ว',
    views: '12,402',
  },
  {
    id: 2,
    title: 'The Rise of Alpha Generation',
    dateText: 'เขียนเมื่อ 5 วันที่แล้ว',
    status: 'เผยแพร่แล้ว',
    views: '8,950',
  },
  {
    id: 3,
    title: 'The Rise of Alpha Generation',
    dateText: 'เขียนเมื่อ 5 วันที่แล้ว',
    status: 'เผยแพร่แล้ว',
    views: '8,950',
  },
  {
    id: 4,
    title: 'The Rise of Alpha Generation',
    dateText: 'เขียนเมื่อ 5 วันที่แล้ว',
    status: 'เผยแพร่แล้ว',
    views: '8,950',
  },
  {
    id: 5,
    title: 'The Rise of Alpha Generation',
    dateText: 'เขียนเมื่อ 5 วันที่แล้ว',
    status: 'เผยแพร่แล้ว',
    views: '8,950',
  },
];

// Interactive monthly traffic chart data points
const TRAFFIC_DATA = [
  { month: 'JAN', value: 35, x: 50, y: 140 },
  { month: 'FEB', value: 58, x: 130, y: 95 },
  { month: 'MAR', value: 42, x: 210, y: 125 },
  { month: 'APR', value: 75, x: 290, y: 60 },
  { month: 'MAY', value: 65, x: 370, y: 80 },
  { month: 'JUN', value: 92, x: 450, y: 30 },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleExport = () => {
    alert('ส่งออกข้อมูล Dashboard สำเร็จ!');
  };

  return (
    <GozAdminLayout searchValue={search} onSearchChange={setSearch}>
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-[#1A1C1C] font-bold text-[28px] m-0"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              Dashboard Overview
            </h1>
            <p
              className="text-[#8B8B8C] text-[14px] m-0 mt-0.5"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            >
              ภาพรวมระบบและการใช้งานบนแพลตฟอร์ม
            </p>
          </div>

          <button
            type="button"
            id="btn-export-dashboard"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#F5CDDC] hover:bg-[#F0BED2] text-[#1A1C1C] font-bold text-[14px] border-none cursor-pointer transition-colors shadow-xs active:scale-95"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            <Download size={16} color="#DE5D8F" strokeWidth={2.4} />
            <span>ส่งออกข้อมูล</span>
          </button>
        </div>

        {/* ── 4 Stat Metric Cards (Node 7309:24614) ── */}
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
                125.4k
              </span>
              <span className="flex items-center gap-0.5 text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full text-[12px] font-bold">
                <TrendingUp size={12} />
                +12%
              </span>
            </div>
          </div>

          {/* Card 2: หมวดหมู่ยอดนิยม */}
          <div className="bg-white rounded-[16px] p-5 border border-[#DFDFE0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-[#8B8B8C] text-[13px] font-bold"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                หมวดหมู่ยอดนิยม
              </span>
              <div className="w-8 h-8 rounded-full bg-[#F3E8FF] flex items-center justify-center">
                <BookOpen size={16} color="#9333EA" />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-[#1A1C1C] font-bold text-[24px]"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                ปรัชญา
              </div>
              <div
                className="text-[#8B8B8C] text-[12px] mt-0.5"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                วัฒนธรรม ภาษา
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
                42
              </span>
            </div>
          </div>

          {/* Card 4: ยอดแชร์ใหม่ */}
          <div className="bg-white rounded-[16px] p-5 border border-[#DFDFE0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-[#8B8B8C] text-[13px] font-bold"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                ยอดแชร์ใหม่
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
                85
              </span>
              <span className="flex items-center gap-0.5 text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full text-[12px] font-bold">
                <TrendingUp size={12} />
                +8%
              </span>
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
                <polygon
                  points="50,140 130,95 210,125 290,60 370,80 450,30 450,170 50,170"
                  fill="url(#chartGradient)"
                />

                {/* Line path */}
                <polyline
                  points="50,140 130,95 210,125 290,60 370,80 450,30"
                  fill="none"
                  stroke="#DE5D8F"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Points */}
                {TRAFFIC_DATA.map((pt, i) => (
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
                          {pt.value}k
                        </text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>

              {/* Month Labels below */}
              <div className="flex justify-between px-6 pt-2 text-[#8B8B8C] text-[12px] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                {TRAFFIC_DATA.map((pt) => (
                  <span key={pt.month}>{pt.month}</span>
                ))}
              </div>
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
              {RECENT_ACTIVITIES.map((act) => (
                <div key={act.id} className="py-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FCEFF4] flex items-center justify-center shrink-0 mt-0.5">
                    {act.type === 'pin' ? (
                      <Pin size={15} color="#DE5D8F" />
                    ) : (
                      <MessageSquare size={15} color="#DE5D8F" />
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
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Section: บทความยอดนิยม (Popular Articles) + สุขภาพของระบบ (System Health) ── */}
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
                onClick={() => navigate('/saraniyakorn/articles')}
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
                  {POPULAR_ARTICLES.map((art) => (
                    <tr key={art.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={articleThumb}
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
                          className="border-none bg-transparent cursor-pointer text-[#8B8B8C] hover:text-[#1A1C1C] p-1"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health Card (4 cols) - Figma Node 7309:24614 */}
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

              {/* Storage bar */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-between text-[13px] font-bold" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
                  <span>พื้นที่จัดเก็บ</span>
                  <span>74%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: '74%' }}
                  />
                </div>
              </div>

              {/* API Requests bar */}
              <div className="mt-5 flex flex-col gap-2">
                <div className="flex justify-between text-[13px] font-bold" style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}>
                  <span>คำขอ API</span>
                  <span>91%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: '91%' }}
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
              ประวัติการทำงาน
            </button>
          </div>
        </div>
      </div>
    </GozAdminLayout>
  );
}
export default AdminDashboardPage;
