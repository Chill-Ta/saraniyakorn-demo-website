import { useState, useEffect } from 'react';
import {
  Search,
  Share2,
  Mail,
  Link2,
  TrendingUp,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrafficSource {
  id: number;
  label: string;
  visits: number;
  change: number;
}

interface ChartPoint {
  label: string;
  value: number;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

const SOURCE_ICONS: Record<string, React.ElementType> = {
  'Organic Search': Search,
  'Direct': Link2,
  'Social Media': Share2,
  'Email Campaigns': Mail,
};

type TimeFilter = 'วันนี้' | '7 วันล่าสุด' | '30 วันล่าสุด';

export function TrafficPage() {
  const [filter, setFilter] = useState<TimeFilter>('7 วันล่าสุด');
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [growthRate, setGrowthRate] = useState<number>(0);
  const [chartPoints, setChartPoints] = useState<ChartPoint[]>([]);
  const [sources, setSources] = useState<TrafficSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filterOptions: TimeFilter[] = ['วันนี้', '7 วันล่าสุด', '30 วันล่าสุด'];

  useEffect(() => {
    let filterParam = '7d';
    if (filter === 'วันนี้') filterParam = 'today';
    if (filter === '30 วันล่าสุด') filterParam = '30d';

    setIsLoading(true);
    fetch(`${API_BASE}/v1/dashboard/traffic?filter=${encodeURIComponent(filterParam)}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer mock.jwt.admin',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setTotalVisits(data.total_visits ?? 0);
          setGrowthRate(data.growth_rate ?? 0);
          setChartPoints(data.chart_points || []);
          if (Array.isArray(data.sources)) {
            setSources(data.sources);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load traffic data from database', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filter]);

  // Dynamic SVG Area Chart based on chartPoints
  const renderChart = () => {
    const W = 480;
    const H = 180;
    const PAD_LEFT = 40;
    const PAD_BOTTOM = 28;
    const innerW = W - PAD_LEFT - 8;
    const innerH = H - PAD_BOTTOM;

    const values = chartPoints.map((p) => p.value);
    const maxVal = Math.max(...values, 10);
    const Y_LABELS = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), maxVal];
    const xStep = chartPoints.length > 1 ? innerW / (chartPoints.length - 1) : innerW;

    const pts = chartPoints.map((p, i) => ({
      x: PAD_LEFT + i * xStep,
      y: innerH - (p.value / maxVal) * innerH,
    }));

    function smoothPath(points: { x: number; y: number }[]) {
      if (points.length < 2) return '';
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const cp1x = (points[i].x + points[i + 1].x) / 2;
        const cp1y = points[i].y;
        const cp2x = (points[i].x + points[i + 1].x) / 2;
        const cp2y = points[i + 1].y;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i + 1].x} ${points[i + 1].y}`;
      }
      return d;
    }

    const linePath = pts.length > 0 ? smoothPath(pts) : '';
    const areaPath = pts.length > 0 ? linePath + ` L ${pts[pts.length - 1].x} ${innerH} L ${pts[0].x} ${innerH} Z` : '';

    return (
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        {Y_LABELS.map((label, i) => {
          const y = innerH - (i / (Y_LABELS.length - 1)) * innerH;
          return (
            <g key={i}>
              <line x1={PAD_LEFT} x2={W - 8} y1={y} y2={y} stroke="#DFDFE0" strokeWidth={1} />
              <text x={PAD_LEFT - 6} y={y + 4} textAnchor="end" fill="#9E9E9E" fontSize={10} fontFamily="Inter, sans-serif">
                {label}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E992B4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E992B4" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
        {linePath && <path d={linePath} fill="none" stroke="#E992B4" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#E992B4" stroke="#fff" strokeWidth={2} />
        ))}
        {chartPoints.map((p, i) => (
          <text key={i} x={PAD_LEFT + i * xStep} y={H - 6} textAnchor="middle" fill="#9E9E9E" fontSize={10} fontFamily="Inter, sans-serif">
            {p.label}
          </text>
        ))}
      </svg>
    );
  };

  return (
    <AksornsaraLayout>
      {/* ── Header: title + time filter ── */}
      <div className="flex items-center justify-between" style={{ marginBottom: 24, maxWidth: 900 }}>
        <h1 className="font-bold text-[#1A1C1C]" style={{ fontSize: 40, lineHeight: '52px', margin: 0 }}>
          ยอดการเข้าชม
        </h1>
        <div
          className="flex items-center rounded-full overflow-hidden"
          style={{ border: '1px solid #DFDFE0', backgroundColor: '#F7F8F9' }}
        >
          {filterOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFilter(opt)}
              className="font-bold cursor-pointer border-none transition-all"
              style={{
                fontSize: 13,
                padding: '6px 16px',
                borderRadius: 9999,
                backgroundColor: filter === opt ? '#E992B4' : 'transparent',
                color: filter === opt ? '#fff' : '#6D6D6D',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col" style={{ gap: 24, maxWidth: 900 }}>

        {/* ── Traffic Trend Card ── */}
        <div className="bg-white rounded-[12px] p-6 flex flex-col gap-6"
          style={{ boxShadow: '0px 4px 24px 0px rgba(0,0,0,0.07)' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FCEFF4' }}>
                <TrendingUp size={18} color="#9E4266" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-black" style={{ fontSize: 18, lineHeight: '26px' }}>แนวโน้มผู้เข้าชม</span>
                <span style={{ fontSize: 13, color: '#6D6D6D' }}>{filter}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-black" style={{ fontSize: 32, lineHeight: '40px', fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
                {totalVisits.toLocaleString()}
              </span>
              <span className="font-bold" style={{ fontSize: 13, color: growthRate >= 0 ? '#64A93C' : '#E05252' }}>
                {growthRate >= 0 ? '↑ +' : '↓ '}{growthRate}%
              </span>
            </div>
          </div>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            {renderChart()}
          </div>
        </div>

        {/* ── Traffic Sources Table ── */}
        <div className="bg-white rounded-[12px] overflow-hidden"
          style={{ boxShadow: '0px 4px 24px 0px rgba(0,0,0,0.07)' }}>
          <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid #DFDFE0' }}>
            <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: '#FCEFF4' }}>
              <Share2 size={16} color="#9E4266" />
            </div>
            <span className="font-bold text-black" style={{ fontSize: 20, lineHeight: '28px' }}>แหล่งที่มาของ Traffic (จากฐานข้อมูลจริง)</span>
          </div>
          <div className="grid px-6 py-3" style={{ gridTemplateColumns: '1fr 160px 140px', backgroundColor: '#F7F8F9' }}>
            {['แหล่งที่มา', 'จำนวนเข้าชม', 'อัตราการเติบโต'].map((col, i) => (
              <span key={i} className="font-bold text-[#6D6D6D]"
                style={{ fontSize: 13, textAlign: i === 0 ? 'left' : 'center' }}>
                {col}
              </span>
            ))}
          </div>
          {sources.map((src, idx) => {
            const Icon = SOURCE_ICONS[src.label] || Link2;
            return (
              <div key={src.id} className="grid items-center px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
                style={{ gridTemplateColumns: '1fr 160px 140px', borderTop: idx > 0 ? '1px solid #DFDFE0' : 'none' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0" style={{ backgroundColor: '#F7F8F9' }}>
                    <Icon size={15} color="#6D6D6D" />
                  </div>
                  <span className="font-bold text-black" style={{ fontSize: 15 }}>{src.label}</span>
                </div>
                <span className="font-bold text-black text-center" style={{ fontSize: 16 }}>
                  {src.visits.toLocaleString()}
                </span>
                <span className="font-bold text-center"
                  style={{ fontSize: 15, color: src.change >= 0 ? '#64A93C' : '#E05252' }}>
                  {src.change >= 0 ? '+' : ''}{src.change}%
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </AksornsaraLayout>
  );
}

export default TrafficPage;
