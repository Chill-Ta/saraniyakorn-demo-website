import { useState } from 'react';
import {
  Search,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { GozAdminLayout } from './GozAdminLayout';

interface InternshipReview {
  id: number;
  tag: 'รีวิว' | 'รอการแก้ไข' | 'รอตรวจสอบ';
  company: string;
  role: string;
  description: string;
  reviewerName: string;
  timestamp: string;
}

const INITIAL_REVIEWS: InternshipReview[] = [
  {
    id: 1,
    tag: 'รีวิว',
    company: 'SCG Internship Program(idk)',
    role: 'UX/UI Designer',
    description: 'บรรยากาศดีมากๆครับ พี่เลี้ยงดูแลดีม ให้เล่นเกมทุกวัน ตอนนี้ไม่อยากออกครับ ดูเพิ่มเติม',
    reviewerName: 'Nanthanit Vareerak',
    timestamp: '21/6/26 07:52',
  },
  {
    id: 2,
    tag: 'รอการแก้ไข',
    company: 'SCG Internship Program(idk)',
    role: 'UX/UI Designer',
    description: 'บรรยากาศดีมากๆครับ พี่เลี้ยงดูแลดีม ให้เล่นเกมทุกวัน ตอนนี้ไม่อยากออกครับ ดูเพิ่มเติม',
    reviewerName: 'Nanthanit Vareerak',
    timestamp: '21/6/26 07:52',
  },
  {
    id: 3,
    tag: 'รอการแก้ไข',
    company: 'SCG Internship Program(idk)',
    role: 'UX/UI Designer',
    description: 'บรรยากาศดีมากๆครับ พี่เลี้ยงดูแลดีม ให้เล่นเกมทุกวัน ตอนนี้ไม่อยากออกครับ ดูเพิ่มเติม',
    reviewerName: 'Nanthanit Vareerak',
    timestamp: '21/6/26 07:52',
  },
  {
    id: 4,
    tag: 'รอการแก้ไข',
    company: 'SCG Internship Program(idk)',
    role: 'UX/UI Designer',
    description: 'บรรยากาศดีมากๆครับ พี่เลี้ยงดูแลดีม ให้เล่นเกมทุกวัน ตอนนี้ไม่อยากออกครับ ดูเพิ่มเติม',
    reviewerName: 'Nanthanit Vareerak',
    timestamp: '21/6/26 07:52',
  },
  {
    id: 5,
    tag: 'รอการแก้ไข',
    company: 'SCG Internship Program(idk)',
    role: 'UX/UI Designer',
    description: 'บรรยากาศดีมากๆครับ พี่เลี้ยงดูแลดีม ให้เล่นเกมทุกวัน ตอนนี้ไม่อยากออกครับ ดูเพิ่มเติม',
    reviewerName: 'Nanthanit Vareerak',
    timestamp: '21/6/26 07:52',
  },
  {
    id: 6,
    tag: 'รอการแก้ไข',
    company: 'SCG Internship Program(idk)',
    role: 'UX/UI Designer',
    description: 'บรรยากาศดีมากๆครับ พี่เลี้ยงดูแลดีม ให้เล่นเกมทุกวัน ตอนนี้ไม่อยากออกครับ ดูเพิ่มเติม',
    reviewerName: 'Nanthanit Vareerak',
    timestamp: '21/6/26 07:52',
  },
];

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<InternshipReview[]>(INITIAL_REVIEWS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('ล่าสุด');
  const [authorFilter, setAuthorFilter] = useState('โดยทุกคน');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApprove = () => {
    if (selectedIds.length === 0) {
      showToast('กรุณาเลือกรายการที่ต้องการอนุมัติ');
      return;
    }
    setReviews((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id) ? { ...r, tag: 'รีวิว' as const } : r
      )
    );
    setSelectedIds([]);
    showToast('อนุมัติรีวิวที่เลือกเรียบร้อยแล้ว');
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      showToast('กรุณาเลือกรายการที่ต้องการลบ');
      return;
    }
    setReviews((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    showToast('ลบรายการที่เลือกเรียบร้อยแล้ว');
  };

  return (
    <GozAdminLayout showTopSearch={false}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-8 right-8 z-50 bg-[#1A1C1C] text-white px-6 py-3 rounded-[12px] shadow-xl flex items-center gap-2 transition-all"
          style={{ fontFamily: 'ChulaCharasNew, sans-serif', fontSize: 16 }}
        >
          <Check size={18} color="#64A93C" strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-[1240px] mx-auto flex flex-col gap-5">
        {/* Page Title */}
        <h1
          className="text-[#1A1C1C] font-bold text-[32px] m-0"
          style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
        >
          รีวิวฝึกงาน
        </h1>

        {/* Toolbar Container (Search + Filters + Action Buttons) */}
        <div className="bg-white rounded-[16px] p-4 border border-[#DFDFE0] shadow-xs flex flex-col gap-3">
          {/* Top Search bar */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหา"
              className="w-full h-11 pl-4 pr-11 rounded-[10px] border border-[#DFDFE0] bg-[#FAFAFA] text-[#1A1C1C] text-[15px] outline-none transition-colors focus:bg-white focus:border-[#DE5D8F]"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
            />
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8C] pointer-events-none"
            />
          </div>

          {/* Filters & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Filter 1: Sort */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none bg-white border border-[#DFDFE0] rounded-[8px] px-3.5 py-2 pr-8 text-[14px] text-[#1A1C1C] font-bold cursor-pointer outline-none focus:border-[#DE5D8F]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  <option value="ล่าสุด">ล่าสุด</option>
                  <option value="เก่าที่สุด">เก่าที่สุด</option>
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B8B8C] pointer-events-none"
                />
              </div>

              {/* Filter 2: Author */}
              <div className="relative">
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="appearance-none bg-white border border-[#DFDFE0] rounded-[8px] px-3.5 py-2 pr-8 text-[14px] text-[#1A1C1C] font-bold cursor-pointer outline-none focus:border-[#DE5D8F]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  <option value="โดยทุกคน">โดยทุกคน</option>
                  <option value="นิสิต">นิสิต</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B8B8C] pointer-events-none"
                />
              </div>
            </div>

            {/* Action Buttons: ลบ & อนุมัติ (Figma Node 7354:26708) */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                id="btn-delete-reviews"
                onClick={handleDelete}
                className="px-5 py-2 rounded-[8px] bg-[#F5CDDC] hover:bg-[#F0BED2] text-[#DE5D8F] font-bold text-[14px] border-none cursor-pointer transition-colors shadow-xs active:scale-95"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                ลบ
              </button>
              <button
                type="button"
                id="btn-approve-reviews"
                onClick={handleApprove}
                className="px-5 py-2 rounded-[8px] bg-[#DE5D8F] hover:bg-[#CA5582] text-white font-bold text-[14px] border-none cursor-pointer transition-colors shadow-xs active:scale-95"
                style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
              >
                อนุมัติ
              </button>
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="flex justify-end">
          <span
            className="text-[#8B8B8C] text-[13px]"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            แสดงทั้งหมด {reviews.length} จาก 67 รายการ
          </span>
        </div>

        {/* Cards Grid (2 Columns, matching Node 7354:26708) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => {
            const isSelected = selectedIds.includes(rev.id);
            return (
              <div
                key={rev.id}
                onClick={() => toggleSelect(rev.id)}
                className={`bg-white rounded-[16px] p-5 border cursor-pointer transition-all shadow-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#DE5D8F] ring-1 ring-[#DE5D8F] bg-[#FFF8FA]'
                    : 'border-[#DFDFE0] hover:border-[#F5CDDC]'
                }`}
              >
                <div>
                  {/* Top row: Tag & Checkbox */}
                  <div className="flex items-center justify-between mb-3">
                    {rev.tag === 'รีวิว' ? (
                      <span
                        className="px-3 py-1 rounded-[6px] text-[12px] font-bold text-[#2563EB] bg-[#EBF4FF]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        รีวิว
                      </span>
                    ) : (
                      <span
                        className="px-3 py-1 rounded-[6px] text-[12px] font-bold text-[#DE5D8F] bg-[#FCEFF4] border border-[#F5CDDC]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        {rev.tag}
                      </span>
                    )}

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(rev.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded text-[#DE5D8F] accent-[#DE5D8F] cursor-pointer"
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <h3
                    className="font-bold text-[#1A1C1C] text-[16px] m-0"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    {rev.company}
                  </h3>
                  <p
                    className="text-[#8B8B8C] text-[13px] m-0 mt-0.5"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    {rev.role}
                  </p>

                  {/* Description quote */}
                  <p
                    className="text-[#545455] text-[14px] mt-3 mb-4 leading-relaxed"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    {rev.description}
                  </p>
                </div>

                {/* Bottom Row: Reviewer avatar + Name + Timestamp */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F6F6F6] text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#545455]">
                      <User size={13} />
                    </div>
                    <span
                      className="text-[#545455] font-bold"
                      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                    >
                      {rev.reviewerName}
                    </span>
                  </div>

                  <span
                    className="text-[#8B8B8C] text-[12px]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {rev.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-1.5 py-4">
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-[#DFDFE0] bg-white flex items-center justify-center text-[#545455] hover:bg-[#F9FAFB] cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-full border-none bg-[#DE5D8F] text-white font-bold flex items-center justify-center cursor-pointer shadow-xs"
          >
            1
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-[#DFDFE0] bg-white flex items-center justify-center text-[#545455] hover:bg-[#F9FAFB] cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-[#DFDFE0] bg-white flex items-center justify-center text-[#545455] hover:bg-[#F9FAFB] cursor-pointer"
          >
            3
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-[#DFDFE0] bg-white flex items-center justify-center text-[#545455] hover:bg-[#F9FAFB] cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </GozAdminLayout>
  );
}
export default AdminReviewsPage;
