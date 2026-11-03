import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Trash2, Link2, ExternalLink } from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';
import { articlesService } from './services/articlesService';

interface CommentItem {
  id: number;
  author: string;
  timeAgo: string;
  articleId: string;
  articleTitle: string;
  content: string;
}

export function CommentsPage() {
  const navigate = useNavigate();
  const allArticles = useMemo(() => articlesService.getAll(), []);

  // Construct realistic comments referencing actual real articles from the database
  const initialCommentsList: CommentItem[] = useMemo(() => {
    const a0 = allArticles[0] || { id: 'art-001', title: '“ที่ใดมีชีวิต ที่นั่นย่อมมีหวัง”' };
    const a1 = allArticles[1] || { id: 'art-002', title: 'บัตรแมงมุม : วิบากกรรมผัดวันประกันพรุ่งของกทม.' };
    const a2 = allArticles[2] || { id: 'art-003', title: '‘พารู้จัก Sharenting พ่อแม่สายแชร์ ที่อาจทำร้ายลูกน้อยโดยไม่รู้ตัว’' };
    const a3 = allArticles[3] || { id: 'art-004', title: 'คำนี้มีที่มา' };
    const a4 = allArticles[4] || { id: 'art-005', title: 'ดนตรีบำบัดกับการฟื้นฟูจิตใจ' };

    return [
      {
        id: 1,
        author: 'นิสิตคณะอักษรศาสตร์ จุฬาฯ',
        timeAgo: '15 นาทีที่แล้ว',
        articleId: a0.id,
        articleTitle: a0.title,
        content: 'บทความเขียนได้ลึกซึ้งมากครับ ให้กำลังใจในช่วงเวลาที่กำลังเตรียมสอบและหมดไฟได้ดีมากเลยครับ',
      },
      {
        id: 2,
        author: 'ภูวดล ชื่นจิตต์',
        timeAgo: '45 นาทีที่แล้ว',
        articleId: a1.id,
        articleTitle: a1.title,
        content: 'วิเคราะห์ระบบขนส่งสาธารณะในกรุงเทพฯ ได้ตรงจุดมากครับ เป็นปัญหาที่คนเมืองต้องเจอทุกวันจริง ๆ',
      },
      {
        id: 3,
        author: 'กานดา พินิจสาร',
        timeAgo: '2 ชั่วโมงที่แล้ว',
        articleId: a2.id,
        articleTitle: a2.title,
        content: 'ประเด็นเรื่อง Sharenting สำคัญมากในยุคนี้ค่ะ พ่อแม่ยุคใหม่ควรได้อ่านบทความนี้เพื่อเคารพสิทธิของเด็ก',
      },
      {
        id: 4,
        author: 'นักศึกษาปริญญาโท ภาควิชาภาษาศาสตร์',
        timeAgo: 'เมื่อวานนี้',
        articleId: a3.id,
        articleTitle: a3.title,
        content: 'ชอบการสืบค้นที่มาของคำศัพท์และสำนวนโบราณมากเลยครับ มีประโยชน์ต่อการศึกษาค้นคว้ามาก',
      },
      {
        id: 5,
        author: 'ชมรมดนตรีและศิลปะ',
        timeAgo: '2 วันที่แล้ว',
        articleId: a4.id,
        articleTitle: a4.title,
        content: 'ท่วงทำนองกับการบำบัดความเครียด ข้อมูลทางวิทยาศาสตร์และศิลปะเข้ากันได้ลงตัวมากครับ',
      },
    ];
  }, [allArticles]);

  const [search, setSearch] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(initialCommentsList);
  const [hasMore, setHasMore] = useState(true);

  const filteredComments = comments.filter(
    (c) =>
      c.author.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      c.articleTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLoadMore = () => {
    const extraArticles = allArticles.slice(5, 7);
    const extraComments: CommentItem[] = extraArticles.map((art, idx) => ({
      id: 10 + idx,
      author: idx === 0 ? 'ศิษย์เก่าอักษรฯ' : 'ผู้ติดตามอ่านประจำ',
      timeAgo: `${idx + 3} วันที่แล้ว`,
      articleId: art.id,
      articleTitle: art.title,
      content: `บทความ "${art.title}" ถ่ายทอดมุมมองทางสังคมและวัฒนธรรมได้ประทับใจมากครับ`,
    }));

    setComments((prev) => [...prev, ...extraComments]);
    setHasMore(false);
  };

  return (
    <AksornsaraLayout
      showBackButton={true}
      onBack={() => navigate('/aksornsara')}
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 956 }}>
        {/* ── Page Header ── */}
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
            คอมเมนต์ใหม่
          </h1>
        </div>

        {/* ── Comment Cards List ── */}
        <div className="flex flex-col gap-6 w-full" style={{ maxWidth: 896 }}>
          {filteredComments.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 border border-[#D4C2C2] text-center text-[#504444] font-serif">
              ไม่พบความคิดเห็นที่ค้นหา
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white border border-[#D4C2C2] rounded-[16px] relative overflow-hidden flex flex-col"
                style={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
                  padding: '24px 24px 18px 24px',
                }}
              >
                {/* Decorative Top Accent Gradient Bar */}
                <div
                  className="absolute top-0 left-[1px] right-[1px] h-[4px]"
                  style={{
                    background: 'linear-gradient(90deg, #E992B4 0%, #FFFFFF 100%)',
                  }}
                />

                {/* Card Header: Author Info + Article Badge */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Author Name & Time */}
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="font-bold text-[#121C28]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 18,
                        lineHeight: '24px',
                      }}
                    >
                      {comment.author}
                    </span>
                    <span
                      className="text-gray-500"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 13,
                        lineHeight: '18px',
                      }}
                    >
                      {comment.timeAgo}
                    </span>
                  </div>

                  {/* Article Badge Pill (Clickable) */}
                  <button
                    type="button"
                    onClick={() => navigate(`/aksornsara/create?id=${comment.articleId}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#FCEFF4] hover:bg-[#F9DEE8] transition-colors border-none cursor-pointer text-left max-w-[420px]"
                    title="คลิกเพื่อเปิดบทความนี้"
                  >
                    <Link2 size={13} color="#DE5D8F" className="shrink-0" />
                    <span
                      className="font-bold text-[#DE5D8F] truncate"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 13,
                        lineHeight: '18px',
                      }}
                    >
                      บทความ: {comment.articleTitle}
                    </span>
                    <ExternalLink size={12} color="#DE5D8F" className="shrink-0 ml-0.5" />
                  </button>
                </div>

                {/* Comment Content Block with Vertical Accent Border */}
                <div
                  className="my-4 pl-4 border-l-3 border-[#E992B4]"
                  style={{ minHeight: 28 }}
                >
                  <p
                    className="text-[#121C28] font-serif"
                    style={{
                      fontSize: 16,
                      lineHeight: '24px',
                      margin: 0,
                    }}
                  >
                    "{comment.content}"
                  </p>
                </div>

                {/* Card Bottom Divider & Action Button */}
                <div
                  className="pt-3 flex items-center justify-between"
                  style={{
                    borderTop: '1px solid rgba(212, 194, 194, 0.3)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFF5F7] border border-[#F5CDDC] rounded-[8px] cursor-pointer hover:bg-[#FCEFF4] transition-colors text-red-600 font-serif"
                    style={{ fontSize: 13 }}
                  >
                    <Trash2 size={13} />
                    <span>ลบความคิดเห็น</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Load More Button */}
          {hasMore && filteredComments.length > 0 && (
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
                โหลดความคิดเห็นเพิ่มเติม ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </AksornsaraLayout>
  );
}

export default CommentsPage;
