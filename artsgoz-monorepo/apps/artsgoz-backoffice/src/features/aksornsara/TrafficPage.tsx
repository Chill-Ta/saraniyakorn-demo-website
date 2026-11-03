import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Share2,
  Mail,
  Link2,
  TrendingUp,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';
import { articlesService } from './services/articlesService';

// ─── Area Chart ───────────────────────────────────────────────────────────────

function AreaChart({ dailyValues }: { dailyValues: number[] }) {
  const W = 520;
  const H = 180;
  const PAD_LEFT = 40;
  const PAD_BOTTOM = 28;
  const maxVal = Math.max(...dailyValues, 100);
  const MAX_VAL = Math.ceil(maxVal * 1.2 / 500) * 500;
  const innerW = W - PAD_LEFT - 8;
  const innerH = H - PAD_BOTTOM;
  const Y_LABELS = [
    '0',
    `${Math.round(MAX_VAL * 0.25)}`,
    `${Math.round(MAX_VAL * 0.5)}`,
    `${Math.round(MAX_VAL * 0.75)}`,
    `${MAX_VAL}`,
  ];
  const CHART_LABELS = ['อา.', 'จ.', 'อ.', 'พุธ', 'พฤ.', 'ศ.', 'ส.'];
  const xStep = innerW / (CHART_LABELS.length - 1);

  const pts = dailyValues.map((v, i) => ({
    x: PAD_LEFT + i * xStep,
    y: innerH - (v / MAX_VAL) * innerH,
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

  const linePath = smoothPath(pts);
  const areaPath = linePath + ` L ${pts[pts.length - 1].x} ${innerH} L ${pts[0].x} ${innerH} Z`;

  return (
    <svg width={W} height={H} style={{ overflow: 'visible', width: '100%' }} viewBox={`0 0 ${W} ${H}`}>
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
          <stop offset="0%" stopColor="#E992B4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E992B4" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="#E992B4" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#E992B4" stroke="#fff" strokeWidth={2} />
      ))}
      {CHART_LABELS.map((label, i) => (
        <text key={i} x={PAD_LEFT + i * xStep} y={H - 6} textAnchor="middle" fill="#9E9E9E" fontSize={11} fontFamily="'ChulaCharasNew', sans-serif">
          {label}
        </text>
      ))}
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TimeFilter = 'วันนี้' | '7 วันล่าสุด' | '30 วันล่าสุด';

export function TrafficPage() {
  const [filter, setFilter] = useState<TimeFilter>('7 วันล่าสุด');
  const filterOptions: TimeFilter[] = ['วันนี้', '7 วันล่าสุด', '30 วันล่าสุด'];
  const [version, setVersion] = useState(0);

  useEffect(() => {
    articlesService.syncWithApi();
    return articlesService.subscribe(() => setVersion((v) => v + 1));
  }, []);

  const metrics = useMemo(() => articlesService.getMetrics(), [version]);
  const baseTotalViews = metrics.totalViews ?? 0;

  // Scale views based on time filter
  const currentTotalViews = useMemo(() => {
    if (filter === 'วันนี้') return Math.round(baseTotalViews * 0.05);
    if (filter === '7 วันล่าสุด') return Math.round(baseTotalViews * 0.28);
    return baseTotalViews;
  }, [filter, baseTotalViews]);

  // Proportional daily values
  const dailyValues = useMemo(() => {
    const fractions = [0.08, 0.16, 0.14, 0.19, 0.15, 0.18, 0.10];
    return fractions.map((f) => Math.round(currentTotalViews * f));
  }, [currentTotalViews]);

  // Traffic sources proportional to actual total views
  const trafficSources = useMemo(() => {
    return [
      {
        id: 1,
        icon: Search,
        label: 'Organic Search (Google & Search Engines)',
        visits: Math.round(currentTotalViews * 0.515),
        change: 8.2,
      },
      {
        id: 2,
        icon: Link2,
        label: 'Direct (CU Portal & Bookmarks)',
        visits: Math.round(currentTotalViews * 0.242),
        change: 3.1,
      },
      {
        id: 3,
        icon: Share2,
        label: 'Social Media (Facebook / IG / X)',
        visits: Math.round(currentTotalViews * 0.168),
        change: 5.4,
      },
      {
        id: 4,
        icon: Mail,
        label: 'Campus & Faculty Newsletters',
        visits: Math.round(currentTotalViews * 0.075),
        change: 12.0,
      },
    ];
  }, [currentTotalViews]);

  return (
    <AksornsaraLayout>
      {/* ── Header: title + time filter ── */}
      <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: 24, maxWidth: 900 }}>
        <div>
          <h1 className="font-bold text-[#1A1C1C] font-serif" style={{ fontSize: 40, lineHeight: '52px', margin: 0 }}>
            ยอดการเข้าชม
          </h1>
        </div>

        <div
          className="flex items-center rounded-full overflow-hidden p-0.5"
          style={{ border: '1px solid #DFDFE0', backgroundColor: '#F7F8F9' }}
        >
          {filterOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFilter(opt)}
              className="font-bold cursor-pointer border-none transition-all font-serif"
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
        <div
          className="bg-white rounded-[12px] p-6 flex flex-col gap-6"
          style={{ boxShadow: '0px 4px 24px 0px rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FCEFF4' }}
              >
                <TrendingUp size={20} color="#9E4266" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-black font-serif" style={{ fontSize: 18, lineHeight: '26px' }}>
                  แนวโน้มผู้เข้าชมบทความ
                </span>
                <span className="font-serif" style={{ fontSize: 13, color: '#6D6D6D' }}>
                  {filter}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span
                className="font-bold text-black"
                style={{ fontSize: 32, lineHeight: '40px', fontFamily: 'ChulaCharasNew, Inter, sans-serif' }}
              >
                {currentTotalViews.toLocaleString()}
              </span>
              <span className="font-bold" style={{ fontSize: 13, color: '#64A93C' }}>
                ↑ +12.5% สัปดาห์นี้
              </span>
            </div>
          </div>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <AreaChart dailyValues={dailyValues} />
          </div>
        </div>

        {/* ── Traffic Sources Table ── */}
        <div
          className="bg-white rounded-[12px] overflow-hidden"
          style={{ boxShadow: '0px 4px 24px 0px rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid #DFDFE0' }}>
            <div
              className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#FCEFF4' }}
            >
              <Share2 size={16} color="#9E4266" />
            </div>
            <span className="font-bold text-black font-serif" style={{ fontSize: 20, lineHeight: '28px' }}>
              แหล่งที่มาของ Traffic
            </span>
          </div>
          <div
            className="grid px-6 py-3 font-serif"
            style={{ gridTemplateColumns: '1fr 160px 140px', backgroundColor: '#F7F8F9' }}
          >
            {['แหล่งที่มา', 'จำนวนเข้าชม', 'อัตราการเติบโต'].map((col, i) => (
              <span
                key={i}
                className="font-bold text-[#6D6D6D]"
                style={{ fontSize: 14, textAlign: i === 0 ? 'left' : 'center' }}
              >
                {col}
              </span>
            ))}
          </div>
          {trafficSources.map((src, idx) => (
            <div
              key={src.id}
              className="grid items-center px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
              style={{ gridTemplateColumns: '1fr 160px 140px', borderTop: idx > 0 ? '1px solid #DFDFE0' : 'none' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#F7F8F9' }}
                >
                  <src.icon size={15} color="#6D6D6D" />
                </div>
                <span className="font-bold text-black font-serif" style={{ fontSize: 15 }}>
                  {src.label}
                </span>
              </div>
              <span className="font-bold text-black text-center font-serif" style={{ fontSize: 16 }}>
                {src.visits.toLocaleString()}
              </span>
              <span
                className="font-bold text-center font-serif"
                style={{ fontSize: 15, color: src.change >= 0 ? '#64A93C' : '#E05252' }}
              >
                {src.change >= 0 ? '+' : ''}{src.change}%
              </span>
            </div>
          ))}
        </div>

      </div>
    </AksornsaraLayout>
  );
}

export default TrafficPage;
