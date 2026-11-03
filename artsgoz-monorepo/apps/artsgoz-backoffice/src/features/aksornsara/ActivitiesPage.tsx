import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MessageSquare, ExternalLink, FileEdit, CheckCircle2 } from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';
import { articlesService } from './services/articlesService';

interface ActivityItem {
  id: number;
  type: 'publish' | 'comment' | 'update';
  action: string;
  timeAgo: string;
  articleId: string;
  articleTitle: string;
  content?: string;
}

export function ActivitiesPage() {
  const navigate = useNavigate();
  const allArticles = useMemo(() => articlesService.getAll(), []);

  const initialActivitiesList: ActivityItem[] = useMemo(() => {
    const a0 = allArticles[0] || { id: 'art-001', title: '“ที่ใดมีชีวิต ที่นั่นย่อมมีหวัง”', author: 'ภัคจิรา มาตาพิทักษ์' };
    const a1 = allArticles[1] || { id: 'art-002', title: 'บัตรแมงมุม : วิบากกรรมผัดวันประกันพรุ่งของกทม.', author: 'ดอม รุ่งเรือง' };
    const a2 = allArticles[2] || { id: 'art-003', title: '‘พารู้จัก Sharenting พ่อแม่สายแชร์’', author: 'Mondaysep' };
    const a3 = allArticles[3] || { id: 'art-004', title: 'คำนี้มีที่มา', author: 'ชมรมสาราณียกร' };
    const a4 = allArticles[4] || { id: 'art-005', title: 'ดนตรีบำบัดกับการฟื้นฟูจิตใจ', author: 'ชมรมสาราณียกร' };

    return [
      {
        id: 1,
        type: 'publish',
        action: `${a0.author} เผยแพร่บทความใหม่`,
        timeAgo: '15 นาทีที่แล้ว',
        articleId: a0.id,
        articleTitle: a0.title,
      },
      {
        id: 2,
        type: 'comment',
        action: 'มีความคิดเห็นใหม่ในบทความ',
        timeAgo: '45 นาทีที่แล้ว',
        articleId: a1.id,
        articleTitle: a1.title,
        content: 'วิเคราะห์ระบบขนส่งสาธารณะในกรุงเทพฯ ได้ตรงจุดมากครับ',
      },
      {
        id: 3,
        type: 'update',
        action: 'กองบรรณาธิการ อัปเดตข้อมูลและตรวจพิสูจน์อักษร',
        timeAgo: '2 ชั่วโมงที่แล้ว',
        articleId: a2.id,
        articleTitle: a2.title,
      },
      {
        id: 4,
        type: 'publish',
        action: `${a3.author} บันทึกบทความในหมวดหมู่ภาษา`,
        timeAgo: 'เมื่อวานนี้',
        articleId: a3.id,
        articleTitle: a3.title,
      },
      {
        id: 5,
        type: 'comment',
        action: 'มีความคิดเห็นใหม่ในบทความ',
        timeAgo: '2 วันที่แล้ว',
        articleId: a4.id,
        articleTitle: a4.title,
        content: 'ท่วงทำนองกับการบำบัดความเครียด ข้อมูลน่าสนใจมากครับ',
      },
    ];
  }, [allArticles]);

  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivitiesList);
  const [hasMore, setHasMore] = useState(true);

  const filteredActivities = activities.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.action.toLowerCase().includes(q) ||
      item.articleTitle.toLowerCase().includes(q) ||
      (item.content && item.content.toLowerCase().includes(q))
    );
  });

  const handleLoadMore = () => {
    const extraArticles = allArticles.slice(5, 8);
    const extraActivities: ActivityItem[] = extraArticles.map((art, idx) => ({
      id: 10 + idx,
      type: idx % 2 === 0 ? 'publish' : 'update',
      action: idx % 2 === 0 ? `${art.author} เผยแพร่บทความใหม่` : `ปรับปรุงเนื้อหาบทความ (${art.category})`,
      timeAgo: `${idx + 3} วันที่แล้ว`,
      articleId: art.id,
      articleTitle: art.title,
    }));

    setActivities((prev) => [...prev, ...extraActivities]);
    setHasMore(false);
  };

  return (
    <AksornsaraLayout
      showBackButton={true}
      onBack={() => navigate('/aksornsara')}
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 896 }}>
        {/* ── Page Title ── */}
        <div>
          <h1
            className="font-bold text-[#1A1C1C]"
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
              fontSize: 48,
              lineHeight: '64px',
              margin: 0,
            }}
          >
            กิจกรรมล่าสุด
          </h1>
        </div>

        {/* ── Activities List ── */}
        <div className="flex flex-col gap-4 w-full">
          {filteredActivities.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 border border-[#D4C2C2] text-center text-[#504444] font-serif">
              ไม่พบกิจกรรมที่ค้นหา
            </div>
          ) : (
            filteredActivities.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/aksornsara/create?id=${item.articleId}`)}
                className="bg-white border border-[#D4C2C2] rounded-[16px] overflow-hidden flex flex-col p-6 hover:shadow-md transition-all cursor-pointer group"
                style={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          item.type === 'publish'
                            ? '#ECF4E7'
                            : item.type === 'comment'
                            ? '#FCEFF4'
                            : '#E5EEFF',
                      }}
                    >
                      {item.type === 'publish' && <CheckCircle2 size={18} color="#64A93C" />}
                      {item.type === 'comment' && <MessageSquare size={18} color="#DE5D8F" />}
                      {item.type === 'update' && <FileEdit size={18} color="#0165F8" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#121C28] font-serif text-[16px]">
                        {item.action}
                      </span>
                      <span className="text-gray-400 font-serif text-[13px]">
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>

                  <span className="text-[#DE5D8F] font-serif text-[13px] flex items-center gap-1 group-hover:underline">
                    เปิดบทความ
                    <ExternalLink size={12} />
                  </span>
                </div>

                {/* Article Box */}
                <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex flex-col gap-1">
                  <span className="font-bold text-[#1A1C1C] font-serif text-[15px] group-hover:text-[#DE5D8F] transition-colors">
                    {item.articleTitle}
                  </span>
                  {item.content && (
                    <p className="text-gray-600 font-serif text-[14px] m-0 bg-[#FAFAFA] p-2.5 rounded-[8px] border-l-2 border-[#DE5D8F]">
                      "{item.content}"
                    </p>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Load More Button */}
          {hasMore && filteredActivities.length > 0 && (
            <div className="flex justify-center pt-2 pb-6">
              <button
                type="button"
                onClick={handleLoadMore}
                className="font-bold text-[#DE5D8F] bg-transparent border-none cursor-pointer hover:underline transition-opacity font-serif"
                style={{
                  fontSize: 15,
                  lineHeight: '22px',
                }}
              >
                โหลดกิจกรรมเพิ่มเติม ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </AksornsaraLayout>
  );
}

export default ActivitiesPage;
