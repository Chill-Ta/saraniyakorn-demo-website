import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import { logoImg } from '@artsgoz/design-system';
import { PATHS } from '../../routes/paths';
import { YellowCardColumns, INITIAL_SUBJECTS } from '@artsgoz/yellow-card-shared';
import type { YellowCardSubject } from '@artsgoz/yellow-card-shared';

interface StudentAdvisorItem {
  id: string;
  name: string;
  studentId: string;
  major: string;
  minor: string;
  curriculum: string;
  advisor: string;
  location: string;
  phone: string;
  submitted: boolean;
}

const MOCK_ADVISOR_STUDENTS: StudentAdvisorItem[] = [
  { id: '1', name: 'นายบะหมี่ หมูย่างตรัง', studentId: '6531234522', major: 'สารสนเทศ', minor: 'ภาษาจีน', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'บาร์บี้แลนด์', phone: '013-456-789', submitted: false },
  { id: '2', name: 'นางสาวขนิษฐา ใจดี', studentId: '6531234622', major: 'ภาษาไทย', minor: 'ประวัติศาสตร์', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'มหาจักรีสิรินธร', phone: '081-987-6543', submitted: false },
  { id: '3', name: 'นายภาณุพงศ์ แสนสุข', studentId: '6531234722', major: 'ภาษาอังกฤษ', minor: 'ฝรั่งเศส', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'อาคารบรมราชกุมารี', phone: '082-111-2233', submitted: false },
  { id: '4', name: 'นางสาวชนิกา นามเพราะ', studentId: '6531234822', major: 'ปรัชญา', minor: 'เยอรมัน', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'บาร์บี้แลนด์', phone: '083-444-5566', submitted: false },
  { id: '5', name: 'นายธนากร มีทรัพย์', studentId: '6531234922', major: 'สารสนเทศ', minor: 'ภาษาญี่ปุ่น', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'มหาจักรีสิรินธร', phone: '084-777-8899', submitted: false },
  { id: '6', name: 'นางสาวสุนิสา มานะ', studentId: '6531235022', major: 'ภาษาเกาหลี', minor: 'สารสนเทศ', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'อาคารบรมราชกุมารี', phone: '085-000-1122', submitted: false },
  { id: '7', name: 'นายปิติพงษ์ สุขใจ', studentId: '6531235122', major: 'ประวัติศาสตร์', minor: 'ภาษาอังกฤษ', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'บาร์บี้แลนด์', phone: '086-333-4455', submitted: false },
  { id: '8', name: 'นางสาวอรัญญา ดีงาม', studentId: '6531235222', major: 'ภาษาจีน', minor: 'เกาหลี', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'มหาจักรีสิรินธร', phone: '087-666-7788', submitted: false },
  { id: '9', name: 'นายศุภชัย ใจประเสริฐ', studentId: '6531235322', major: 'ภาษาไทย', minor: 'ปรัชญา', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'อาคารบรมราชกุมารี', phone: '088-999-0011', submitted: false },
  { id: '10', name: 'นางสาวอารีรัตน์ มั่นคง', studentId: '6531235422', major: 'สารสนเทศ', minor: 'อังกฤษ', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'บาร์บี้แลนด์', phone: '089-222-3344', submitted: false },
  { id: '11', name: 'นายสมชาย เก่งกาจ', studentId: '6531235522', major: 'ภูมิศาสตร์', minor: 'สารสนเทศ', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'มหาจักรีสิรินธร', phone: '090-555-6677', submitted: false },
  { id: '12', name: 'นางสาวอรทัย รักการอ่าน', studentId: '6531235622', major: 'บรรณารักษศาสตร์', minor: 'ภาษาไทย', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'บาร์บี้แลนด์', phone: '091-888-9900', submitted: false },
  { id: '13', name: 'นายวิทยา สร้างสรรค์', studentId: '6531235722', major: 'ศิลปการละคร', minor: 'ภาษาอังกฤษ', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'อาคารบรมราชกุมารี', phone: '092-123-4567', submitted: false },
  { id: '14', name: 'นางสาวจันทร์เพ็ญ ใจดี', studentId: '6531235822', major: 'ภาษาฝรั่งเศส', minor: 'ปรัชญา', curriculum: 'ปี 2566', advisor: 'อาจารย์อิ่มจัง อาหารตามสั่ง', location: 'บาร์บี้แลนด์', phone: '093-987-6543', submitted: false },
];

interface SemesterRecord {
  term: string;
  ca: string;
  cg: string;
  gpa: string;
  cax: string;
  cgx: string;
  gpax: string;
  note: string;
}

const MOCK_SEMESTERS: SemesterRecord[] = [
  { term: '1. ภาคต้น / 2565', ca: '18', cg: '18', gpa: '3.75', cax: '18', cgx: '18', gpax: '3.75', note: '-' },
  { term: '2. ภาคปลาย / 2565', ca: '18', cg: '18', gpa: '3.80', cax: '36', cgx: '36', gpax: '3.78', note: '-' },
  { term: '1. ภาคต้น / 2566', ca: '18', cg: '18', gpa: '3.65', cax: '54', cgx: '54', gpax: '3.73', note: '-' },
  { term: '2. ภาคปลาย / 2566', ca: '18', cg: '18', gpa: '3.85', cax: '72', cgx: '72', gpax: '3.76', note: '-' },
  { term: '1. ภาคต้น / 2567', ca: '18', cg: '18', gpa: '3.90', cax: '90', cgx: '90', gpax: '3.79', note: '-' },
  { term: '2. ภาคปลาย / 2567', ca: '18', cg: '18', gpa: '3.70', cax: '108', cgx: '108', gpax: '3.77', note: '-' },
  { term: '1. ภาคต้น / 2568', ca: '15', cg: '15', gpa: '3.80', cax: '123', cgx: '123', gpax: '3.78', note: '-' },
  { term: '2. ภาคปลาย / 2568', ca: '12', cg: '12', gpa: '4.00', cax: '135', cgx: '135', gpax: '3.80', note: 'สำเร็จการศึกษา' },
];

export function YellowCardBackofficePage() {
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('1');
  const [checkedStudentIds, setCheckedStudentIds] = useState<Set<string>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [studentSubjects] = useState<YellowCardSubject[]>(INITIAL_SUBJECTS);

  const activeStudent = MOCK_ADVISOR_STUDENTS.find(s => s.id === selectedStudentId) || MOCK_ADVISOR_STUDENTS[0];

  const handleToggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitted) return;

    setCheckedStudentIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
  };

  const handleSubmitAll = () => {
    if (isSubmitted) {
      // Revert back to edit mode
      setIsSubmitted(false);
    } else {
      // Approve & submit all students
      const allIds = new Set(MOCK_ADVISOR_STUDENTS.map(s => s.id));
      setCheckedStudentIds(allIds);
      setIsSubmitted(true);
    }
  };

  const handleLogout = () => {
    navigate(PATHS.ROOT);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row select-none text-black font-[ChulaCharasNew]">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR (Width: 302px, Sticky & Dynamically Stretched, Figma Spec)    */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-[302px] shrink-0 border-r border-[#D0D0D1] bg-white flex flex-col p-5 gap-4 h-full lg:h-screen lg:sticky lg:top-0 z-10">
        {/* Brand Logo Header */}
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <img
            src={logoImg}
            alt="Arts GOZ Logo"
            className="w-[203px] h-[43px] object-contain"
          />
        </div>

        {/* Advisor Category Badge */}
        <div className="w-full bg-[#FCEFF4] rounded-[16px] py-3 px-6 text-center font-serif text-[18px] font-bold text-black shrink-0">
          นิสิตในที่ปรึกษาปี 2565
        </div>

        <div className="w-full border-t border-[#D0D0D1] shrink-0" />

        {/* Student List Table Header */}
        <div className="flex items-center justify-between px-2 font-serif text-[18px] font-bold text-black shrink-0">
          <span>รายชื่อนิสิตที่ดูแล</span>
          <span>สถานะ</span>
        </div>

        {/* Student List Items (Dynamically expands to fill space until it reaches bottom action buttons) */}
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1 min-h-[300px]">
          {MOCK_ADVISOR_STUDENTS.map((student) => {
            const isChecked = checkedStudentIds.has(student.id);
            const isSelected = student.id === selectedStudentId;

            return (
              <div
                key={student.id}
                onClick={() => handleSelectStudent(student.id)}
                className={`
                  flex items-center justify-between p-2.5 px-3 rounded-[8px] cursor-pointer transition-all border shrink-0
                  ${isSelected ? 'border-[#D0D0D1] bg-[#EAEAEA] shadow-sm font-semibold' : 'border-transparent bg-white hover:bg-[#F2F2F2]'}
                `}
              >
                {/* Student Name */}
                <span className="font-serif text-[16px] text-black overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]">
                  {student.name}
                </span>

                {/* Status Column */}
                {isSubmitted ? (
                  // Approved / Submitted State: Green text "ส่งใบเหลืองแล้ว"
                  <span className="font-serif text-[14px] font-bold text-[#64A93C] whitespace-nowrap">
                    ส่งใบเหลืองแล้ว
                  </span>
                ) : (
                  // Initial or Checked State: Checkbox icon
                  <div
                    onClick={(e) => handleToggleCheck(student.id, e)}
                    className={`
                      w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors cursor-pointer shrink-0
                      ${isChecked ? 'bg-[#E992B4] border-[#E992B4] text-white' : 'border-[#8B8B8C] bg-white'}
                    `}
                  >
                    {isChecked && <Check size={12} strokeWidth={3} className="text-white" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Sidebar Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full pt-3 border-t border-[#D0D0D1] mt-auto shrink-0">
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleSubmitAll}
            className="w-full bg-[#E992B4] hover:bg-[#de7e9f] text-white font-serif text-[16px] font-bold py-3.5 px-4 rounded-[8px] transition-colors text-center shadow-sm cursor-pointer"
          >
            {isSubmitted ? 'แก้ไขข้อมูล' : 'ส่งข้อมูลไปยังฝ่ายทะเบียน'}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-[#F5CDDC] hover:bg-[#edd0db] text-black font-serif text-[16px] font-bold py-3.5 px-4 rounded-[8px] transition-colors text-center cursor-pointer"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN RIGHT CONTENT AREA (Yellow Card & Grade Report Details)             */}
      {/* ========================================================================= */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto max-w-[1100px] mx-auto flex flex-col gap-10">
        {/* Main Document Title */}
        <div className="w-full text-center">
          <h1 className="font-serif text-[24px] lg:text-[28px] font-bold leading-[36px] text-black max-w-[750px] mx-auto">
            ใบรายงานผลการลงทะเบียนและผลการศึกษา ตลอดหลักสูตร จำนวน 129-153 หน่วยกิต (หลักสูตรปรับปรุง พ.ศ.2566)
          </h1>
        </div>

        {/* Student Information Summary (Plain text, no box, no background, no underlines) */}
        <div className="w-full max-w-[780px] mx-auto flex flex-col gap-3 font-serif py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
            <div className="flex gap-3 items-center">
              <span className="font-bold text-[16px] text-black">ชื่อนิสิต:</span>
              <span className="text-[16px] text-black font-normal">{activeStudent.name}</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-bold text-[16px] text-black">รหัสนิสิต:</span>
              <span className="text-[16px] text-black font-normal">{activeStudent.studentId}</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-bold text-[16px] text-black">วิชาเอก:</span>
              <span className="text-[16px] text-black font-normal">{activeStudent.major}</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-bold text-[16px] text-black">วิชาโท:</span>
              <span className="text-[16px] text-black font-normal">{activeStudent.minor}</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-bold text-[16px] text-black">หลักสูตร:</span>
              <span className="text-[16px] text-black font-normal">{activeStudent.curriculum}</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-bold text-[16px] text-black">อาจารย์ที่ปรึกษา:</span>
              <span className="text-[16px] text-black font-normal">{activeStudent.advisor}</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-bold text-[16px] text-black">สถานที่ติดต่อ:</span>
              <span className="text-[16px] text-black font-normal">{activeStudent.location}</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-bold text-[16px] text-black">หมายเลขโทรศัพท์:</span>
              <span className="text-[16px] text-black font-normal">{activeStudent.phone}</span>
            </div>
          </div>
        </div>

        {/* Academic Grade / GPA Matrix Table */}
        <div className="w-full overflow-x-auto border border-[#545455] rounded-[4px] shadow-sm">
          <table className="w-full text-center border-collapse font-serif text-[16px]">
            {/* Table Header Row */}
            <thead>
              <tr className="text-white font-bold text-[18px] h-[56px]">
                <th className="bg-[#E992B4] border-r border-[#404041] px-4 py-3 min-w-[200px] text-left">
                  ภาค/ปีการศึกษา
                </th>
                <th className="bg-[#E992B4] border-r border-[#404041] px-3 py-3 w-[70px]">CA</th>
                <th className="bg-[#E992B4] border-r border-[#404041] px-3 py-3 w-[70px]">CG</th>
                <th className="bg-[#E992B4] border-r border-[#404041] px-3 py-3 w-[70px]">GPA</th>
                <th className="bg-[#E992B4] border-r border-[#404041] px-3 py-3 w-[70px]">CAX</th>
                <th className="bg-[#E992B4] border-r border-[#404041] px-3 py-3 w-[70px]">CGX</th>
                <th className="bg-[#E992B4] border-r border-[#404041] px-3 py-3 w-[70px]">GPAX</th>
                <th className="bg-[#D0D0D1] text-black px-4 py-3 min-w-[160px]">หมายเหตุ</th>
              </tr>
            </thead>

            {/* Table Body Rows */}
            <tbody>
              {MOCK_SEMESTERS.map((sem, index) => (
                <tr key={index} className="border-t border-[#404041] hover:bg-gray-50/80 transition-colors h-[48px]">
                  <td className="border-r border-[#404041] px-4 py-2.5 text-left font-normal text-black">{sem.term}</td>
                  <td className="border-r border-[#404041] px-3 py-2.5 text-black">{sem.ca}</td>
                  <td className="border-r border-[#404041] px-3 py-2.5 text-black">{sem.cg}</td>
                  <td className="border-r border-[#404041] px-3 py-2.5 text-black">{sem.gpa}</td>
                  <td className="border-r border-[#404041] px-3 py-2.5 text-black">{sem.cax}</td>
                  <td className="border-r border-[#404041] px-3 py-2.5 text-black">{sem.cgx}</td>
                  <td className="border-r border-[#404041] px-3 py-2.5 text-black">{sem.gpax}</td>
                  <td className={`px-4 py-2.5 ${sem.note === 'สำเร็จการศึกษา' ? 'font-bold text-[#64A93C]' : 'text-black'}`}>
                    {sem.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* READ-ONLY YELLOW CARD ENROLLED SUBJECTS & DROPDOWN ACCORDIONS */}
        <div className="w-full flex flex-col gap-6 pt-6">
          <div className="border-b border-[#D0D0D1] pb-3">
            <h2 className="font-serif text-[22px] font-bold text-[#D23976]">
              รายวิชาตามโครงสร้างหลักสูตรและผลการเรียน (Student Submitted Yellow Card)
            </h2>
          </div>

          {/* Reusing YellowCardColumns in Read-Only Mode (No Add, Edit, or Delete) */}
          <YellowCardColumns
            subjects={studentSubjects}
            major={activeStudent.major}
            readOnly={true}
          />
        </div>
      </main>
    </div>
  );
}

export default YellowCardBackofficePage;
