import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Radio, MessageSquare, Link2 } from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';

interface ActivityItem {
  id: string;
  type: 'publish' | 'comment';
  action: string;
  timeAgo: string;
  articleTitle: string;
  content?: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

export function ActivitiesPage() {
  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActivities = (targetPage: number, append = false) => {
    setIsLoading(true);
    fetch(`${API_BASE}/v1/activities?page=${targetPage}&limit=10&search=${encodeURIComponent(search)}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer mock.jwt.admin',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          const mapped: ActivityItem[] = data.data.map((item: any) => ({
            id: String(item.id),
            type: item.type === 'comment' ? 'comment' : 'publish',
            action: item.action || 'มีการอัปเดตบทความ',
            timeAgo: item.time_ago || (item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH') : 'เมื่อสักครู่'),
            articleTitle: item.article_title || 'บทความวิชาการ',
            content: item.detail || item.content || undefined,
          }));

          setActivities((prev) => (append ? [...prev, ...mapped] : mapped));
          setHasMore(Boolean(data.has_more));
          setPage(targetPage);
        } else {
          if (!append) setActivities([]);
          setHasMore(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch activities from database', err);
        if (!append) setActivities([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchActivities(1, false);
  }, [search]);

  const handleLoadMore = () => {
    fetchActivities(page + 1, true);
  };

  return (
    <AksornsaraLayout
      showBackButton={true}
      onBack={() => navigate('/aksornsara')}
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="w-full flex flex-col gap-8" style={{ maxWidth: 896 }}>
        {/* ── Page Title ── */}
        <div className="flex items-end justify-between">
          <h1
            className="font-bold text-[#1A1C1C]"
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
              fontSize: 48,
              lineHeight: '64px',
              margin: 0,
            }}
          >
            กิจกรรมทั้งหมด
          </h1>
        </div>

        {/* ── Activity Cards List ── */}
        <div className="flex flex-col gap-6 w-full">
          {isLoading && activities.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 border border-[#DFDFE0] text-center text-[#504444] font-serif">
              กำลังโหลดกิจกรรมจากฐานข้อมูล...
            </div>
          ) : activities.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 border border-[#DFDFE0] text-center text-[#504444] font-serif">
              ไม่พบกิจกรรมในระบบ
            </div>
          ) : (
            activities.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#DFDFE0] rounded-[16px] relative overflow-hidden flex flex-col transition-shadow hover:shadow-sm"
                style={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
                  padding: '24px 24px 20px 24px',
                }}
              >
                {/* Decorative Top Accent Gradient Bar */}
                <div
                  className="absolute top-0 left-[1px] right-[1px] h-[4px]"
                  style={{
                    background: 'linear-gradient(90deg, #F4C2C2 0%, #FFFFFF 100%)',
                  }}
                />

                {/* Card Top Row: Icon + Action & Time + Article Pill Badge */}
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Icon Badge & Action Info */}
                  <div className="flex items-start gap-3.5">
                    {/* Icon Badge */}
                    <div
                      className="flex items-center justify-center rounded-[8px] shrink-0 mt-0.5"
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: '#ECECEC',
                      }}
                    >
                      {item.type === 'publish' ? (
                        <Radio size={16} color="#9E4266" />
                      ) : (
                        <MessageSquare size={16} color="#9E4266" />
                      )}
                    </div>

                    {/* Action Text & Timestamp */}
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="font-bold text-[#121C28]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 16,
                          lineHeight: '22px',
                        }}
                      >
                        {item.action}
                      </span>
                      <span
                        className="text-[#6D6D6D]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 13,
                          lineHeight: '18px',
                        }}
                      >
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Right: Article Pill Badge */}
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] shrink-0"
                    style={{ backgroundColor: '#ECECEC' }}
                  >
                    <Link2 size={12} color="#545455" />
                    <span
                      className="font-bold text-[#504444]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 12,
                        lineHeight: '18px',
                      }}
                    >
                      บทความ: {item.articleTitle}
                    </span>
                  </div>
                </div>

                {/* Comment Quote Block (if comment activity) */}
                {item.content && (
                  <div
                    className="mt-3.5 pl-4 border-l-2 border-[#DFDFE0]"
                    style={{ marginLeft: 45 }}
                  >
                    <p
                      className="text-[#121C28]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontWeight: 400,
                        fontSize: 15,
                        lineHeight: '22px',
                        margin: 0,
                      }}
                    >
                      "{item.content}"
                    </p>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Load More Button */}
          {hasMore && activities.length > 0 && (
            <div className="flex justify-center pt-4 pb-8">
              <button
                type="button"
                onClick={handleLoadMore}
                className="font-bold text-[#7B5455] hover:text-[#9E4266] bg-transparent border-none cursor-pointer transition-colors"
                style={{
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 14,
                  lineHeight: '20px',
                }}
              >
                โหลดกิจกรรมทั้งหมดเพิ่มเติม
              </button>
            </div>
          )}
        </div>
      </div>
    </AksornsaraLayout>
  );
}

export default ActivitiesPage;
