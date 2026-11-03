import { useState, useRef, ChangeEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  ChevronLeft,
  Eye,
  ArrowLeft,
  UploadCloud,
  Check,
  X,
  Bookmark,
  Share2,
  Calendar,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';
import { TiptapEditor } from './components/TiptapEditor';
import { articlesService } from './services/articlesService';

export function CreateArticlePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  // Mode: 'edit' or 'preview'
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // Confirmation Modal
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialArticle = editId ? articlesService.getById(editId) : undefined;

  // Form Fields initialized from article or blank
  const [title, setTitle] = useState(
    () => initialArticle?.title || ''
  );
  const [content, setContent] = useState(
    () => initialArticle?.contentHtml || (initialArticle ? `<p>${initialArticle.excerpt}</p>` : '')
  );

  const [author, setAuthor] = useState(() => initialArticle?.author || '');
  const [proofreader, setProofreader] = useState(() => initialArticle?.proofreader || '');
  const [illustrator, setIllustrator] = useState(() => initialArticle?.illustrator || '');

  // Cover Image
  const [coverImage, setCoverImage] = useState<string | null>(
    () => initialArticle?.coverImage || initialArticle?.imageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sidebar Settings
  const [visibility, setVisibility] = useState(() => initialArticle?.visibility || 'สาธารณะ');
  const [publishDate] = useState(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const yr = now.getFullYear() + 543;
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${yr} , ${hours}:${mins}`;
  });

  // Categories (Blank when creating new)
  const [categories, setCategories] = useState<{ id: string; name: string; checked: boolean }[]>(() => {
    const base = [
      { id: '1', name: 'ปี 2026', checked: false },
      { id: '2', name: 'ปี 2025', checked: false },
      { id: '3', name: 'ปี 2024', checked: false },
      { id: '4', name: 'ทั่วไป', checked: false },
    ];
    if (initialArticle?.category) {
      const match = base.find((c) => c.name === initialArticle.category);
      if (match) {
        return base.map((c) => ({ ...c, checked: c.name === initialArticle.category }));
      }
      return [...base, { id: 'custom', name: initialArticle.category, checked: true }];
    }
    return base;
  });
  const [newCatName, setNewCatName] = useState('');
  const [showAddCatInput, setShowAddCatInput] = useState(false);

  // Tags
  const [tags, setTags] = useState<string[]>(
    () => initialArticle?.tags || []
  );
  const [tagInput, setTagInput] = useState('');

  // SEO Settings
  const [slug, setSlug] = useState(() => initialArticle?.slug || initialArticle?.id || '');
  const [metaDesc, setMetaDesc] = useState(() => initialArticle?.excerpt || '');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setCoverImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, checked: !cat.checked } : cat))
    );
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    setCategories((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newCatName.trim(), checked: true },
    ]);
    setNewCatName('');
    setShowAddCatInput(false);
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return;
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSaveDraft = () => {
    const selectedCats = categories.filter((c) => c.checked).map((c) => c.name);
    const category = selectedCats[0] || 'ปี 2026';

    const cleanExcerpt = content.replace(/<[^>]+>/g, '').slice(0, 180) + '...';
    const finalTitle = title.trim() || 'บทความฉบับร่าง';
    const finalAuthor = author.trim() || 'ชมรมสาราณียกร';

    if (editId) {
      articlesService.update(editId, {
        title: finalTitle,
        contentHtml: content,
        excerpt: cleanExcerpt,
        author: finalAuthor,
        proofreader,
        illustrator,
        category,
        coverImage: coverImage || undefined,
        imageUrl: coverImage || undefined,
        status: 'ร่างบทความ',
        tags,
        slug,
      });
      showToast('บันทึกร่างบทความเรียบร้อยแล้ว');
    } else {
      const created = articlesService.create({
        title: finalTitle,
        contentHtml: content,
        excerpt: cleanExcerpt,
        author: finalAuthor,
        proofreader,
        illustrator,
        category,
        coverImage: coverImage || undefined,
        imageUrl: coverImage || undefined,
        status: 'ร่างบทความ',
        tags,
        slug,
      });
      showToast('บันทึกร่างบทความเรียบร้อยแล้ว');
      navigate(`/aksornsara/create?id=${created.id}`, { replace: true });
    }
  };

  const handleConfirmPublish = () => {
    setShowPublishModal(false);
    const selectedCats = categories.filter((c) => c.checked).map((c) => c.name);
    const category = selectedCats[0] || 'ปี 2026';

    const cleanExcerpt = content.replace(/<[^>]+>/g, '').slice(0, 180) + '...';
    const finalTitle = title.trim() || 'บทความใหม่ไม่มีชื่อ';
    const finalAuthor = author.trim() || 'ชมรมสาราณียกร';

    if (editId) {
      articlesService.update(editId, {
        title: finalTitle,
        contentHtml: content,
        excerpt: cleanExcerpt,
        author: finalAuthor,
        proofreader,
        illustrator,
        category,
        coverImage: coverImage || undefined,
        imageUrl: coverImage || undefined,
        status: 'เผยแพร่แล้ว',
        tags,
        slug,
      });
    } else {
      articlesService.create({
        title: finalTitle,
        contentHtml: content,
        excerpt: cleanExcerpt,
        author: finalAuthor,
        proofreader,
        illustrator,
        category,
        coverImage: coverImage || undefined,
        imageUrl: coverImage || undefined,
        status: 'เผยแพร่แล้ว',
        tags,
        slug,
      });
    }

    showToast('เผยแพร่บทความสำเร็จแล้ว!');
    setTimeout(() => {
      navigate('/aksornsara/published-articles');
    }, 1200);
  };

  return (
    <AksornsaraLayout showBackButton={false} showTopSearchBar={false}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-8 right-8 z-50 bg-[#1A1C1C] text-white px-6 py-3 rounded-[12px] shadow-xl flex items-center gap-2 transition-all font-serif"
          style={{ fontSize: 16 }}
        >
          <Check size={18} color="#64A93C" strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {showPublishModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowPublishModal(false)}
        >
          <div
            className="bg-white rounded-[24px] p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center gap-8 relative"
            style={{
              width: 600,
              maxWidth: '92vw',
              minHeight: 280,
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="font-bold text-[#1A1C1C] text-center m-0 font-serif"
              style={{ fontSize: 32, lineHeight: '40px' }}
            >
              {editId ? 'ยืนยันการบันทึกและเผยแพร่ ?' : 'ยืนยันการส่งบทความ ?'}
            </h2>

            <div className="flex items-center justify-center gap-6 w-full">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="cursor-pointer border-none font-bold text-[#1A1C1C] transition-opacity hover:opacity-85 active:scale-95 flex items-center justify-center font-serif"
                style={{
                  width: 140,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: '#F5CDDC',
                  fontSize: 16,
                }}
              >
                แก้ไขต่อ
              </button>

              <button
                type="button"
                onClick={handleConfirmPublish}
                className="cursor-pointer border-none font-bold text-white transition-opacity hover:opacity-90 active:scale-95 flex items-center justify-center shadow-sm font-serif"
                style={{
                  width: 140,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: '#DE5D8F',
                  fontSize: 16,
                }}
              >
                เผยแพร่
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'preview' ? (
        /* ══════════════════════════════════════════════════════════════════════
            MODE: PREVIEW
            ══════════════════════════════════════════════════════════════════════ */
        <div className="w-full flex flex-col gap-6" style={{ maxWidth: 960 }}>
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#DFDFE0] pb-4 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="flex items-center gap-2 cursor-pointer border-none bg-transparent font-bold text-[#DE5D8F] hover:text-[#CA5582] transition-colors p-0 font-serif"
                style={{ fontSize: 16 }}
              >
                <ArrowLeft size={18} />
                <span>กลับไปหน้าแก้ไข</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="cursor-pointer bg-white transition-colors hover:bg-[#FCEFF4] active:scale-95 font-serif"
                style={{
                  border: '1.5px solid #DE5D8F',
                  color: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 20px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                แก้ไขต่อ
              </button>

              <button
                type="button"
                onClick={() => setShowPublishModal(true)}
                className="cursor-pointer border-none text-white transition-all hover:bg-[#CA5582] active:scale-95 shadow-sm font-serif"
                style={{
                  backgroundColor: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 24px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                เผยแพร่
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-[#DFDFE0] flex flex-col gap-8 max-w-[840px] mx-auto w-full">
            {/* Category badge */}
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[14px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-3.5 py-1.5">
                {categories.find((c) => c.checked)?.name || 'ทั่วไป'}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif font-bold text-[28px] sm:text-[36px] md:text-[42px] leading-tight text-[#1A1C1C] m-0">
              {title}
            </h1>

            {/* Author / Date info */}
            <div className="flex items-center justify-between border-y border-[#DFDFE0] py-4 text-[#6D6D6D] font-serif text-[14px]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-black">{author}</span>
                {proofreader && <span>• พิสูจน์อักษร: {proofreader}</span>}
                {illustrator && <span>• ภาพ: {illustrator}</span>}
                <span>|</span>
                <span>{publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark size={18} className="cursor-pointer text-[#F8C135]" />
                <Share2 size={18} className="cursor-pointer text-gray-400 hover:text-black" />
              </div>
            </div>

            {/* Cover Image */}
            {coverImage && (
              <div className="w-full aspect-[16/9] rounded-[16px] overflow-hidden bg-gray-100 shadow-xs">
                <img src={coverImage} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* TipTap Rich HTML Content */}
            <div
              className="tiptap-content font-serif text-[18px] leading-[32px] text-[#2B2B2B] flex flex-col gap-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════
            MODE: EDIT
            ══════════════════════════════════════════════════════════════════════ */
        <div className="w-full flex flex-col gap-6" style={{ maxWidth: 960 }}>
          {/* Header Row */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/aksornsara/articles')}
                className="w-9 h-9 rounded-full bg-white border border-[#DFDFE0] flex items-center justify-center cursor-pointer hover:bg-[#FCEFF4] transition-colors"
                title="ย้อนกลับ"
              >
                <ChevronLeft size={20} color="#1A1C1C" />
              </button>
              <h1
                className="font-bold text-[#1A1C1C] m-0 font-serif"
                style={{ fontSize: 32, lineHeight: '40px' }}
              >
                {editId ? `แก้ไขบทความ (${editId})` : 'สร้างบทความใหม่'}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Preview Mode */}
              <button
                id="btn-preview-mode"
                type="button"
                onClick={() => setMode('preview')}
                className="flex items-center gap-1.5 cursor-pointer bg-white transition-colors hover:bg-[#FCEFF4] active:scale-95 shadow-xs font-serif"
                style={{
                  border: '1.5px solid #DE5D8F',
                  color: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 18px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <Eye size={16} color="#DE5D8F" />
                <span>Preview mode</span>
              </button>

              {/* Save Draft */}
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 cursor-pointer bg-white transition-colors hover:bg-[#FCEFF4] active:scale-95 shadow-xs font-serif"
                style={{
                  border: '1.5px solid #DE5D8F',
                  color: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 18px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <span>บันทึกร่างบทความ</span>
              </button>

              {/* Publish */}
              <button
                id="btn-publish-open"
                type="button"
                onClick={() => setShowPublishModal(true)}
                className="flex items-center gap-1.5 cursor-pointer border-none text-white transition-all hover:bg-[#CA5582] active:scale-95 shadow-sm font-serif"
                style={{
                  backgroundColor: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 24px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <span>เผยแพร่</span>
              </button>
            </div>
          </div>

          {/* 2-Column Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ── LEFT COLUMN (TipTap Rich Editor, span 2) ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Title Input Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-2 shadow-xs">
                <label
                  className="font-bold text-[#1A1C1C] text-[18px] font-serif"
                >
                  ชื่อบทความ *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ใส่ชื่อบทความ..."
                  className="w-full px-4 py-3 rounded-[10px] border border-[#DFDFE0] outline-none text-[#1A1C1C] font-serif text-[18px] focus:border-[#DE5D8F] transition-colors"
                />
              </div>

              {/* TipTap Rich Text Editor Card */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-bold text-[#1A1C1C] text-[18px] font-serif"
                >
                  เนื้อหาบทความ (TipTap Rich Text Editor) *
                </label>
                <TiptapEditor
                  content={content}
                  onChange={setContent}
                />
              </div>

              {/* Cover Image Upload Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-3 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  รูปภาพหน้าปก
                </h3>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/svg+xml,image/png,image/jpeg,image/gif"
                  className="hidden"
                />

                {coverImage ? (
                  <div className="relative rounded-[12px] overflow-hidden border border-[#DFDFE0] w-full max-h-[300px]">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover max-h-[300px]"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer border-none hover:bg-black/80 transition-colors"
                      title="ลบรูป"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#DFDFE0] rounded-[12px] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#DE5D8F] hover:bg-[#FDF8FA] transition-all text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FCEFF4] flex items-center justify-center text-[#DE5D8F]">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-[#DE5D8F] m-0 font-serif text-[16px]">
                        คลิกเพื่ออัปโหลดรูปภาพ
                      </p>
                      <p className="text-[#6D6D6D] m-0 text-[13px] mt-1 font-serif">
                        SVG, PNG, JPG หรือ GIF (แนะนำขนาด 800x800 หรือ 16:9)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN (Sidebar Settings) ── */}
            <div className="flex flex-col gap-6">
              {/* Authorship Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-4 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  ข้อมูลผู้จัดทำ
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-[#6D6D6D] font-bold font-serif">
                    ผู้เขียน / นามปากกา
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#DFDFE0] text-[15px] font-serif outline-none focus:border-[#DE5D8F]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-[#6D6D6D] font-bold font-serif">
                    พิสูจน์อักษร (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    value={proofreader}
                    onChange={(e) => setProofreader(e.target.value)}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#DFDFE0] text-[15px] font-serif outline-none focus:border-[#DE5D8F]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-[#6D6D6D] font-bold font-serif">
                    ภาพประกอบ (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    value={illustrator}
                    onChange={(e) => setIllustrator(e.target.value)}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#DFDFE0] text-[15px] font-serif outline-none focus:border-[#DE5D8F]"
                  />
                </div>
              </div>

              {/* Publish Settings Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-4 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  การเผยแพร่
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-[#6D6D6D] font-bold font-serif">
                    การมองเห็น
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as 'สาธารณะ' | 'ส่วนตัว')}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#DFDFE0] text-[15px] font-serif outline-none focus:border-[#DE5D8F] bg-white cursor-pointer"
                  >
                    <option value="สาธารณะ">สาธารณะ</option>
                    <option value="ส่วนตัว">ส่วนตัว (เฉพาะแอดมิน)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-[#6D6D6D] font-bold font-serif">
                    วันที่เผยแพร่
                  </label>
                  <div className="flex items-center justify-between px-3 py-2 rounded-[8px] border border-[#DFDFE0] bg-[#FAFAFA] text-[14px] text-[#404041] font-serif">
                    <span>{publishDate}</span>
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Categories Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-4 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  หมวดหมู่ / ปี
                </h3>

                <div className="flex flex-col gap-2.5">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 cursor-pointer text-[#1A1C1C] text-[15px] font-serif"
                    >
                      <input
                        type="checkbox"
                        checked={cat.checked}
                        onChange={() => toggleCategory(cat.id)}
                        className="w-4 h-4 accent-[#DE5D8F] rounded cursor-pointer"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>

                {showAddCatInput ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="ชื่อหมวดหมู่..."
                      className="flex-1 px-3 py-1.5 rounded-[8px] border border-[#DFDFE0] text-[14px] font-serif outline-none focus:border-[#DE5D8F]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-3 py-1.5 rounded-[8px] bg-[#DE5D8F] text-white border-none font-bold text-[13px] cursor-pointer font-serif"
                    >
                      เพิ่ม
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCatInput(false)}
                      className="p-1 text-gray-400 hover:text-black border-none bg-transparent cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddCatInput(true)}
                    className="text-[#DE5D8F] hover:text-[#CA5582] text-[14px] font-bold text-left border-none bg-transparent cursor-pointer p-0 font-serif"
                  >
                    + เพิ่มหมวดหมู่ใหม่
                  </button>
                )}
              </div>

              {/* Tags Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-4 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  แท็ก (Tags)
                </h3>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEFF4] text-[#DE5D8F] font-bold text-[13px] font-serif"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="border-none bg-transparent text-[#DE5D8F] hover:text-[#CA5582] cursor-pointer p-0 flex items-center"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="พิมพ์แท็กแล้วกด Enter..."
                    className="flex-1 px-3 py-1.5 rounded-[8px] border border-[#DFDFE0] text-[14px] font-serif outline-none focus:border-[#DE5D8F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-[8px] bg-[#DE5D8F] text-white border-none font-bold text-[13px] cursor-pointer font-serif"
                  >
                    เพิ่ม
                  </button>
                </div>
              </div>

              {/* SEO Settings Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-3 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  การตั้งค่า URL & SEO
                </h3>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-[#6D6D6D] font-bold font-serif">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-[8px] border border-[#DFDFE0] text-[14px] font-serif outline-none focus:border-[#DE5D8F]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-[#6D6D6D] font-bold font-serif">
                    คำอธิบายสั้น (Meta Description)
                  </label>
                  <textarea
                    rows={3}
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-[8px] border border-[#DFDFE0] text-[14px] font-serif outline-none focus:border-[#DE5D8F] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AksornsaraLayout>
  );
}

export default CreateArticlePage;
