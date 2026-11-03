import { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft,
  User,
  Shield,
  Pencil,
  Settings as GearIcon,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';
import catAvatar from '../../assets/cat_avatar.png';
import articleThumb from '../../assets/article_thumb.png';

interface PublishedArticle {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  views: number;
}

const PUBLISHED_ARTICLES: PublishedArticle[] = [
  { id: 1, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', date: '1 ม.ค. 69', views: 67 },
  { id: 2, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', date: '1 ม.ค. 69', views: 67 },
  { id: 3, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', date: '1 ม.ค. 69', views: 67 },
  { id: 4, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', date: '1 ม.ค. 69', views: 67 },
  { id: 5, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', date: '1 ม.ค. 69', views: 67 },
  { id: 6, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', date: '1 ม.ค. 69', views: 67 },
  { id: 7, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', date: '1 ม.ค. 69', views: 67 },
];

const DRAFT_ARTICLES: PublishedArticle[] = [
  { id: 101, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', date: '1 ม.ค. 69', views: 67 },
  { id: 102, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', date: '1 ม.ค. 69', views: 67 },
];

export function AccountSettingsPage() {
  const navigate = useNavigate();

  // Active Main Tab: 'profile' or 'articles' (Figma Nodes 6602:23073 vs 6602:23431/23831)
  const [activeTab, setActiveTab] = useState<'profile' | 'articles'>('profile');

  // Sub-filter inside My Articles: 'published' or 'draft' (Figma Nodes 6602:23431 vs 6602:23831)
  const [articleSubTab, setArticleSubTab] = useState<'published' | 'draft'>('published');

  // Profile states
  const [avatar, setAvatar] = useState<string>(catAvatar);
  const [username, setUsername] = useState('Meowlnwza');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [email] = useState('xxxxx@gmail.com');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      showToast('อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว');
    }
  };

  const handleUpdatePassword = () => {
    if (!currentPassword) {
      showToast('กรุณากรอกรหัสผ่านปัจจุบัน');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    showToast('เปลี่ยนรหัสผ่านสำเร็จแล้ว!');
  };

  const handleSignOut = () => {
    navigate('/yellow-card/backoffice');
  };

  return (
    <AksornsaraLayout
      showBackButton={false}
      showTopSearchBar={false}
    >
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

      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 840 }}>
        {/* ── Header: Back button + Title ── */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/aksornsara')}
            className="w-9 h-9 rounded-full bg-white border border-[#DFDFE0] flex items-center justify-center cursor-pointer hover:bg-[#FCEFF4] transition-colors"
            title="ย้อนกลับ"
          >
            <ChevronLeft size={20} color="#1A1C1C" />
          </button>
          <h1
            className="font-bold text-[#1A1C1C] m-0"
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
              fontSize: 32,
              lineHeight: '40px',
            }}
          >
            Account Settings
          </h1>
        </div>

        {/* ── Main Tab Bar (Pill Container) ── */}
        <div className="flex items-center w-full">
          <div
            className="p-1 rounded-[10px] bg-[#F7F8F9] border border-[#DFDFE0] flex items-center gap-1 shadow-xs w-full max-w-[480px]"
          >
            {/* Tab 1: Profile & Privacy (Figma Node 6602:23073) */}
            <button
              type="button"
              id="tab-profile-privacy"
              onClick={() => setActiveTab('profile')}
              className="flex-1 cursor-pointer border-none font-bold rounded-[8px] transition-all flex items-center justify-center text-[14px]"
              style={{
                fontFamily: 'ChulaCharasNew, sans-serif',
                padding: '8px 16px',
                backgroundColor: activeTab === 'profile' ? '#DE5D8F' : 'transparent',
                color: activeTab === 'profile' ? '#FFFFFF' : '#DE5D8F',
                boxShadow: activeTab === 'profile' ? '0 2px 4px rgba(222,93,143,0.2)' : 'none',
              }}
            >
              Profile & Privacy
            </button>

            {/* Tab 2: All Articles / My Articles (Figma Nodes 6602:23431 / 6602:23831) */}
            <button
              type="button"
              id="tab-my-articles"
              onClick={() => setActiveTab('articles')}
              className="flex-1 cursor-pointer border-none font-bold rounded-[8px] transition-all flex items-center justify-center text-[14px]"
              style={{
                fontFamily: 'ChulaCharasNew, sans-serif',
                padding: '8px 16px',
                backgroundColor: activeTab === 'articles' ? '#DE5D8F' : 'transparent',
                color: activeTab === 'articles' ? '#FFFFFF' : '#DE5D8F',
                boxShadow: activeTab === 'articles' ? '0 2px 4px rgba(222,93,143,0.2)' : 'none',
              }}
            >
              All Articles
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: PROFILE & PRIVACY (Figma Node 6602:23073)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' ? (
          <div className="flex flex-col gap-6">
            {/* ── Section 1: Profile (ข้อมูลส่วนตัว) ── */}
            <div
              className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs"
            >
              {/* Header Banner */}
              <div
                className="px-6 py-3.5 flex items-center gap-2.5 border-b border-[#F0BED2]"
                style={{ backgroundColor: '#FCEFF4' }}
              >
                <User size={18} color="#DE5D8F" strokeWidth={2.2} />
                <span
                  className="font-bold text-[#1A1C1C] text-[16px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  Profile (ข้อมูลส่วนตัว)
                </span>
              </div>

              {/* Body Content */}
              <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                {/* Avatar with CHANGE PHOTO */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <img
                    src={avatar}
                    alt="Cat Avatar"
                    className="w-16 h-16 rounded-full object-cover border border-[#DFDFE0] shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#6D6D6D] hover:text-[#DE5D8F] text-[11px] font-bold border-none bg-transparent cursor-pointer transition-colors uppercase tracking-wider p-0 mt-0.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    CHANGE PHOTO
                  </button>
                </div>

                {/* Username Input Field */}
                <div className="flex flex-col gap-1.5 flex-1 max-w-[460px]">
                  <label
                    className="text-[#8B8B8C] text-[12px] font-bold tracking-wide"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Username
                  </label>
                  <div
                    className="flex items-center justify-between border border-[#DFDFE0] rounded-[8px] px-4 py-2.5 bg-[#FAFAFA] focus-within:bg-white focus-within:border-[#DE5D8F] transition-colors"
                  >
                    {isEditingUsername ? (
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => setIsEditingUsername(false)}
                        autoFocus
                        className="w-full bg-transparent outline-none font-bold text-[#1A1C1C] text-[15px]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      />
                    ) : (
                      <span
                        className="font-bold text-[#1A1C1C] text-[15px]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        {username}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsEditingUsername((prev) => !prev)}
                      className="border-none bg-transparent cursor-pointer p-0 text-[#6D6D6D] hover:text-[#DE5D8F] transition-colors"
                      title="แก้ไขชื่อผู้ใช้"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 2: Privacy (การตั้งค่าความปลอดภัย) ── */}
            <div
              className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs"
            >
              {/* Header Banner */}
              <div
                className="px-6 py-3.5 flex items-center gap-2.5 border-b border-[#F0F0F0]"
                style={{ backgroundColor: '#F7F8F9' }}
              >
                <Shield size={18} color="#DE5D8F" strokeWidth={2.2} />
                <span
                  className="font-bold text-[#1A1C1C] text-[16px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  Privacy (การตั้งค่าความปลอดภัย)
                </span>
              </div>

              {/* Body Content */}
              <div className="p-6 flex flex-col gap-6">
                {/* EMAIL ADDRESS */}
                <div className="flex flex-col gap-1.5 max-w-[460px]">
                  <label
                    className="text-[#8B8B8C] text-[12px] font-bold tracking-wide"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    EMAIL ADDRESS
                  </label>
                  <div
                    className="flex items-center justify-between border border-[#DFDFE0] rounded-[8px] px-4 py-2.5 bg-[#FAFAFA]"
                  >
                    <span
                      className="text-[#545455] text-[15px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {email}
                    </span>
                    <span
                      className="px-3 py-0.5 rounded-full text-[12px] font-bold"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        backgroundColor: '#FCEFF4',
                        color: '#DE5D8F',
                        border: '1px solid #F5CDDC',
                      }}
                    >
                      Verified
                    </span>
                  </div>
                </div>

                <div className="h-[1px] bg-[#F0F0F0] my-1" />

                {/* Change Password */}
                <div className="flex flex-col gap-4 max-w-[460px]">
                  <span
                    className="font-bold text-[#1A1C1C] text-[16px]"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    Change Password (เปลี่ยนรหัสผ่าน)
                  </span>

                  {/* CURRENT PASSWORD */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[#8B8B8C] text-[12px] font-bold tracking-wide"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      CURRENT PASSWORD
                    </label>
                    <div
                      className="flex items-center justify-between border border-[#DFDFE0] rounded-[8px] px-4 py-2.5 bg-white focus-within:border-[#DE5D8F]"
                    >
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent outline-none text-[#1A1C1C] text-[15px]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw((prev) => !prev)}
                        className="border-none bg-transparent cursor-pointer p-0 text-[#8B8B8C] hover:text-[#1A1C1C]"
                      >
                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* NEW PASSWORD */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[#8B8B8C] text-[12px] font-bold tracking-wide"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      NEW PASSWORD
                    </label>
                    <div
                      className="flex items-center justify-between border border-[#DFDFE0] rounded-[8px] px-4 py-2.5 bg-white focus-within:border-[#DE5D8F]"
                    >
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent outline-none text-[#1A1C1C] text-[15px]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw((prev) => !prev)}
                        className="border-none bg-transparent cursor-pointer p-0 text-[#8B8B8C] hover:text-[#1A1C1C]"
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* UPDATE PASSWORD Button */}
                  <button
                    type="button"
                    onClick={handleUpdatePassword}
                    className="border-none cursor-pointer font-bold text-[#1A1C1C] transition-opacity hover:opacity-90 active:scale-95 self-start mt-1"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      padding: '10px 20px',
                      borderRadius: 8,
                      backgroundColor: '#F5CDDC',
                      fontSize: 13,
                    }}
                  >
                    UPDATE PASSWORD
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Sign Out Button (outside card, bottom right as in Figma) */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="border-none cursor-pointer font-bold text-white transition-all hover:bg-[#CA5582] active:scale-95 shadow-sm"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  padding: '10px 32px',
                  borderRadius: 10,
                  backgroundColor: '#DE5D8F',
                  fontSize: 15,
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════════════
              TAB 2: MY ARTICLES (Figma Nodes 6602:23431 & 6602:23831)
              ══════════════════════════════════════════════════════════════════════ */
          <div className="flex flex-col gap-5">
            {/* Sub-tabs / Filters: เผยแพร่แล้ว (12) vs ร่างบทความ (2) */}
            <div className="flex items-center gap-3">
              {/* เผยแพร่แล้ว (12) */}
              <button
                type="button"
                id="btn-subtab-published"
                onClick={() => setArticleSubTab('published')}
                className="cursor-pointer font-bold rounded-full transition-all text-[13px] flex items-center justify-center"
                style={{
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  padding: '6px 18px',
                  backgroundColor: articleSubTab === 'published' ? '#B08926' : '#FFFFFF',
                  color: articleSubTab === 'published' ? '#FFFFFF' : '#545455',
                  border: articleSubTab === 'published' ? '1px solid #B08926' : '1px solid #DFDFE0',
                }}
              >
                เผยแพร่แล้ว (12)
              </button>

              {/* ร่างบทความ (2) */}
              <button
                type="button"
                id="btn-subtab-draft"
                onClick={() => setArticleSubTab('draft')}
                className="cursor-pointer font-bold rounded-full transition-all text-[13px] flex items-center justify-center"
                style={{
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  padding: '6px 18px',
                  backgroundColor: articleSubTab === 'draft' ? '#B08926' : '#FFFFFF',
                  color: articleSubTab === 'draft' ? '#FFFFFF' : '#545455',
                  border: articleSubTab === 'draft' ? '1px solid #B08926' : '1px solid #DFDFE0',
                }}
              >
                ร่างบทความ (2)
              </button>
            </div>

            {/* Table Card (Figma Nodes 6602:23431 & 6602:23831) */}
            <div
              className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs"
            >
              <table className="w-full text-left border-collapse" style={{ minWidth: 680 }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid #DFDFE0',
                      backgroundColor: '#F7F8F9',
                    }}
                  >
                    <th
                      className="py-4 px-6 font-bold text-[#1A1C1C]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                        lineHeight: '22px',
                        width: '38%',
                      }}
                    >
                      ชื่อบทความ
                    </th>
                    <th
                      className="py-4 px-4 font-bold text-[#1A1C1C]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                        lineHeight: '22px',
                      }}
                    >
                      ผู้แต่ง
                    </th>
                    <th
                      className="py-4 px-4 font-bold text-[#1A1C1C]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                        lineHeight: '22px',
                      }}
                    >
                      หมวดหมู่
                    </th>
                    <th
                      className="py-4 px-4 font-bold text-[#1A1C1C]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                        lineHeight: '22px',
                      }}
                    >
                      วันที่เผยแพร่
                    </th>
                    <th
                      className="py-4 px-4 font-bold text-[#1A1C1C]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                        lineHeight: '22px',
                      }}
                    >
                      ยอดเข้าชม
                    </th>
                    <th
                      className="py-4 px-6 font-bold text-[#1A1C1C] text-right"
                      style={{ width: 48 }}
                    />
                  </tr>
                </thead>
                <tbody>
                  {(articleSubTab === 'published' ? PUBLISHED_ARTICLES : DRAFT_ARTICLES).map(
                    (item, idx, arr) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#FFF9FB] transition-colors"
                        style={{
                          borderBottom:
                            idx < arr.length - 1 ? '1px solid #F0F0F0' : 'none',
                        }}
                      >
                        {/* Thumbnail + Title */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={articleThumb}
                              alt="thumb"
                              className="w-9 h-9 rounded-[6px] object-cover shrink-0 shadow-xs"
                            />
                            <span
                              className="font-bold text-[#1A1C1C] hover:text-[#DE5D8F] cursor-pointer transition-colors"
                              style={{
                                fontFamily: 'ChulaCharasNew, sans-serif',
                                fontSize: 16,
                                lineHeight: '20px',
                              }}
                            >
                              {item.title}
                            </span>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="py-3.5 px-4">
                          <span
                            className="text-[#1A1C1C]"
                            style={{
                              fontFamily: 'ChulaCharasNew, sans-serif',
                              fontSize: 15,
                            }}
                          >
                            {item.author}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span
                            className="text-[#1A1C1C]"
                            style={{
                              fontFamily: 'ChulaCharasNew, sans-serif',
                              fontSize: 15,
                            }}
                          >
                            {item.category}
                          </span>
                        </td>

                        {/* Published Date */}
                        <td className="py-3.5 px-4">
                          <span
                            className="text-[#1A1C1C]"
                            style={{
                              fontFamily: 'ChulaCharasNew, sans-serif',
                              fontSize: 15,
                            }}
                          >
                            {item.date}
                          </span>
                        </td>

                        {/* Views */}
                        <td className="py-3.5 px-4">
                          <span
                            className="text-[#1A1C1C] font-medium"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: 15,
                            }}
                          >
                            {item.views}
                          </span>
                        </td>

                        {/* Action Icon: Settings Gear for published, Pencil for drafts */}
                        <td className="py-3.5 px-6 text-right">
                          {articleSubTab === 'published' ? (
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FCEFF4] text-[#1A1C1C] border-none bg-transparent cursor-pointer transition-colors"
                              title="ตั้งค่าบทความ"
                            >
                              <GearIcon size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => navigate('/aksornsara/create')}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FCEFF4] text-[#1A1C1C] hover:text-[#DE5D8F] border-none bg-transparent cursor-pointer transition-colors"
                              title="แก้ไขร่างบทความ"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AksornsaraLayout>
  );
}
