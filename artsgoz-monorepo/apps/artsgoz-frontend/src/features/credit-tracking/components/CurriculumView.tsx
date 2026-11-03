import { useTranslation } from 'react-i18next';
import { MessageSquareWarning } from 'lucide-react';
import type { Subject, AcademicProfile } from '../types.js';
import { MAJOR_CURRICULUMS, MINOR_CURRICULUMS } from '@artsgoz/yellow-card-shared';
import type { CourseDetail } from '@artsgoz/yellow-card-shared';

interface CurriculumViewProps {
  subjects?: Subject[];
  onToggleSubject?: (id: string) => void;
  profile?: AcademicProfile | null;
}

export function CurriculumView({ profile }: CurriculumViewProps) {
  const { t } = useTranslation('credit_tracking');

  const majorNameKey = profile?.major ? profile.major.replace(/^credit_tracking\./, '') : 'majors.default';
  const minorNameKey = profile?.minor ? profile.minor.replace(/^credit_tracking\./, '') : 'minors.default';

  // Resolve major key (e.g. "majors.thai" -> "thai")
  const majorKey = profile?.major ? profile.major.replace(/^credit_tracking\./, '').replace(/^majors\./, '') : 'thai';
  const minorKey = profile?.minor ? profile.minor.replace(/^credit_tracking\./, '').replace(/^minors\./, '') : '';

  const majorInfo = MAJOR_CURRICULUMS[majorKey];
  const minorInfo = MINOR_CURRICULUMS[minorKey];

  const majorDisplayTitle = majorInfo
    ? `${majorInfo.nameTh} (${majorInfo.revision})`
    : t(majorNameKey);

  const totalCreditsDisplay = majorInfo
    ? `${majorInfo.totalCredits} หน่วยกิต`
    : '129-153 หน่วยกิต';

  const curriculumRows = [
    {
      part: t('curriculum.major_title'),
      credits: majorInfo?.breakdown.major ?? 48,
      detail: t('curriculum.major_details'),
    },
    {
      part: t('curriculum.basic_courses'),
      credits: majorInfo?.breakdown.majorCompulsory ?? 18,
      detail: 'กลุ่มวิชาพื้นฐาน (บังคับ)',
      isIndented: true,
    },
    {
      part: t('curriculum.specific_courses'),
      credits: majorInfo?.breakdown.majorSpecified ?? 12,
      detail: 'กลุ่มวิชาข้อกำหนดเฉพาะ (วิชาเลือก)',
      isIndented: true,
    },
    {
      part: t('curriculum.specialized_courses'),
      credits: majorInfo?.breakdown.majorSpecialized ?? 18,
      detail: 'กลุ่มวิชาเชี่ยวชาญ (วิชาเลือก)',
      isIndented: true,
    },
    {
      part: t('curriculum.minor_title'),
      credits: minorInfo ? parseInt(minorInfo.totalCredits) || 18 : 18,
      detail: minorInfo
        ? `${minorInfo.nameTh} (${minorInfo.totalCredits} หน่วยกิต)`
        : minorNameKey !== 'minors.default' && minorNameKey !== 'minors.none' && minorNameKey !== 'credit_tracking.minors.default' && minorNameKey !== 'credit_tracking.minors.none'
        ? t('curriculum.minor_name', { name: t(minorNameKey) })
        : t('curriculum.minor_desc_empty'),
    },
  ];

  // Group major courses by course group
  const groupedMajorCourses: Record<string, CourseDetail[]> = {};
  if (majorInfo?.courses) {
    majorInfo.courses.forEach((course: CourseDetail) => {
      const g = course.group || 'รายวิชาในหลักสูตร';
      if (!groupedMajorCourses[g]) {
        groupedMajorCourses[g] = [];
      }
      groupedMajorCourses[g].push(course);
    });
  }

  return (
    <div
      className="w-full space-y-10 min-w-0"
      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
    >
      {/* ───── Top Section: Title + Curriculum Overview ───── */}
      <div className="flex flex-col gap-6 w-full max-w-[744px] min-w-0">
        <div>
          <h1
            className="text-black truncate"
            style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}
          >
            {t('curriculum.title')} ({totalCreditsDisplay})
          </h1>
        </div>

        {/* Curriculum overview table */}
        <div
          className="w-full overflow-auto rounded-[12px] border border-[#D0D0D1]/30"
          style={{ background: '#F7F8F9' }}
        >
          <table
            className="w-full text-black border-collapse"
            style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px', minWidth: '560px' }}
          >
            <thead>
              <tr style={{ backgroundColor: '#FCEFF4' }}>
                <th
                  className="border border-[#D0D0D1]/40 px-3 py-2 text-center font-bold"
                  colSpan={3}
                >
                  {t('curriculum.general_ed')}
                  <br />
                  <span style={{ fontWeight: 400 }}>{t('curriculum.credits_val', { count: 30 })}</span>
                </th>
                <th
                  className="border border-[#D0D0D1]/40 px-3 py-2 text-center font-bold"
                  colSpan={4}
                >
                  {t('curriculum.specific_ed')}
                  <br />
                  <span style={{ fontWeight: 400 }}>{t('curriculum.specific_credits_detail')}</span>
                </th>
                <th className="border border-[#D0D0D1]/40 px-3 py-2 text-center font-bold">
                  {t('curriculum.free_choice')}
                  <br />
                  <span style={{ fontWeight: 400 }}>{t('curriculum.credits_val', { count: 6 })}</span>
                </th>
              </tr>
              <tr style={{ backgroundColor: '#F0F0F0', fontSize: '13px' }}>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal">
                  {t('curriculum.general_sub1')}
                  <br />
                  {t('curriculum.credits_val', { count: 12 })}
                </th>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal">
                  {t('curriculum.general_sub2')}
                  <br />
                  {t('curriculum.credits_val', { count: 12 })}
                </th>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal">
                  {t('curriculum.general_sub3')}
                  <br />
                  {t('curriculum.credits_val', { count: 6 })}
                </th>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal">
                  {t('curriculum.basic_arts')}
                  <br />
                  {t('curriculum.credits_val', { count: 27 })}
                </th>
                <th
                  className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal"
                  colSpan={2}
                >
                  {majorInfo ? majorInfo.nameTh : t('curriculum.english_major_detail')}
                </th>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal">
                  {t('curriculum.other_majors_detail')}
                </th>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center" rowSpan={2} />
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              <tr>
                <td className="border border-[#D0D0D1]/40 px-2 py-2 align-top text-center" colSpan={3}>
                  {t('curriculum.general_12_credits')}
                </td>
                <td className="border border-[#D0D0D1]/40 px-2 py-2 align-top text-center whitespace-normal">
                  {t('curriculum.basic_arts_detail')}
                </td>
                <td className="border border-[#D0D0D1]/40 px-2 py-2 align-top text-center whitespace-normal">
                  {majorInfo ? `${majorInfo.breakdown.major} หน่วยกิต` : t('curriculum.major_range_detail')}
                </td>
                <td className="border border-[#D0D0D1]/40 px-2 py-2 align-top text-center whitespace-normal">
                  {minorInfo ? `${minorInfo.totalCredits} หน่วยกิต` : t('curriculum.minor_18_credits')}
                </td>
                <td className="border border-[#D0D0D1]/40 px-2 py-2 align-top text-center whitespace-normal">
                  {t('curriculum.other_major_credits')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ───── Information Section ───── */}
      <div className="flex flex-col gap-6 w-full min-w-0">
        {/* Info Header */}
        <div className="flex flex-col gap-3 min-w-0">
          <h2
            className="text-black truncate"
            style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}
          >
            {majorDisplayTitle}
          </h2>
          <p
            className="text-black break-words"
            style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
          >
            {t('curriculum.req_details_desc')}
          </p>
        </div>

        {/* Curriculum Breakdown Table */}
        <div style={{ maxWidth: '649px' }} className="w-full min-w-0 overflow-auto">
          {/* Header row */}
          <div
            className="flex items-center justify-between pb-2 mb-1 min-w-[500px]"
            style={{ borderBottom: '1px solid #D0D0D1' }}
          >
            <span
              className="flex-1 text-black"
              style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
            >
              {t('curriculum.col_component')}
            </span>
            <span
              className="w-[100px] text-center text-black"
              style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
            >
              {t('curriculum.col_credits')}
            </span>
            <span
              className="flex-1 text-black text-right"
              style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
            >
              {t('curriculum.col_details')}
            </span>
          </div>

          {/* Data rows */}
          {curriculumRows.map((row, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 min-w-[500px]"
              style={{
                borderBottom: idx < curriculumRows.length - 1 ? '1px solid #F0F0F0' : 'none',
              }}
            >
              <span
                className="flex-1 text-black truncate pr-2"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '24px',
                  paddingLeft: row.isIndented ? '32px' : '0',
                  color: row.isIndented ? '#6D6D6D' : '#000000',
                }}
              >
                {row.part}
              </span>
              <span
                className="w-[100px] text-center"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '24px',
                  color: row.isIndented ? '#6D6D6D' : '#000000',
                }}
              >
                {row.credits}
              </span>
              <span
                className="flex-1 text-right text-black truncate pl-2"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '24px',
                }}
              >
                {row.detail}
              </span>
            </div>
          ))}
        </div>

        {/* ───── Course Directory Section ───── */}
        {majorInfo && majorInfo.courses.length > 0 && (
          <div className="flex flex-col gap-6 w-full max-w-[744px] mt-6">
            {/* Section heading */}
            <div className="flex flex-col gap-[6px]">
              <span
                className="text-[#8B8B8C]"
                style={{ fontSize: '18px', fontWeight: 400, lineHeight: '24px' }}
              >
                บัญชีรายวิชาในหลักสูตร
              </span>
              <span
                className="text-black"
                style={{ fontSize: '22px', fontWeight: 700, lineHeight: '30px' }}
              >
                {majorInfo.nameTh}
              </span>
            </div>

            {/* Groups as flat hierarchy */}
            <div className="flex flex-col gap-8">
              {Object.entries(groupedMajorCourses).map(([groupName, courses]) => (
                <div key={groupName} className="flex flex-col gap-0">
                  {/* Group label — mirrors สาขาวิชา label style with left accent */}
                  <div
                    className="flex items-center justify-between pb-2 mb-1"
                    style={{ borderBottom: '1px solid #D0D0D1' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 4,
                          height: 20,
                          borderRadius: 2,
                          backgroundColor: '#DE5D8F',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="text-black"
                        style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
                      >
                        {groupName}
                      </span>
                    </div>
                    <span
                      className="text-[#6D6D6D]"
                      style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}
                    >
                      {courses.length} รายวิชา
                    </span>
                  </div>

                  {/* Course rows */}
                  <div className="flex flex-col">
                    {courses.map((c: CourseDetail, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3"
                        style={{
                          borderBottom: i < courses.length - 1 ? '1px solid #F0F0F0' : 'none',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="font-mono shrink-0 mt-0.5"
                            style={{
                              fontSize: '13px',
                              fontWeight: 400,
                              color: '#6D6D6D',
                              lineHeight: '20px',
                              minWidth: '72px',
                            }}
                          >
                            {c.code}
                          </span>
                          <div className="flex flex-col">
                            <span
                              className="text-black"
                              style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
                            >
                              {c.nameTh}
                            </span>
                            {c.nameEn && c.nameEn !== c.nameTh && (
                              <span
                                style={{
                                  fontSize: '13px',
                                  fontWeight: 400,
                                  color: '#8B8B8C',
                                  lineHeight: '18px',
                                  fontStyle: 'italic',
                                }}
                              >
                                {c.nameEn}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className="shrink-0 text-right"
                          style={{ fontSize: '16px', fontWeight: 400, color: '#303030', lineHeight: '24px' }}
                        >
                          {c.credits} หน่วยกิต
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Minor Course Directory if Minor Selected */}
        {minorInfo && minorInfo.courses.length > 0 && (
          <div className="flex flex-col gap-6 w-full max-w-[744px] mt-4">
            {/* Section heading */}
            <div className="flex flex-col gap-[6px]">
              <span
                className="text-[#8B8B8C]"
                style={{ fontSize: '18px', fontWeight: 400, lineHeight: '24px' }}
              >
                บัญชีรายวิชา
              </span>
              <span
                className="text-black"
                style={{ fontSize: '22px', fontWeight: 700, lineHeight: '30px' }}
              >
                {minorInfo.nameTh}
              </span>
            </div>

            {/* Course rows */}
            <div
              className="flex flex-col"
              style={{ borderTop: '1px solid #D0D0D1' }}
            >
              {minorInfo.courses.map((c: CourseDetail, i: number) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3"
                  style={{
                    borderBottom: i < minorInfo.courses.length - 1 ? '1px solid #F0F0F0' : 'none',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="font-mono shrink-0 mt-0.5"
                      style={{
                        fontSize: '13px',
                        fontWeight: 400,
                        color: '#6D6D6D',
                        lineHeight: '20px',
                        minWidth: '72px',
                      }}
                    >
                      {c.code}
                    </span>
                    <div className="flex flex-col">
                      <span
                        className="text-black"
                        style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
                      >
                        {c.nameTh}
                      </span>
                      {c.nameEn && c.nameEn !== c.nameTh && (
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 400,
                            color: '#8B8B8C',
                            lineHeight: '18px',
                            fontStyle: 'italic',
                          }}
                        >
                          {c.nameEn}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className="shrink-0 text-right"
                    style={{ fontSize: '16px', fontWeight: 400, color: '#303030', lineHeight: '24px' }}
                  >
                    {c.credits} หน่วยกิต
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orange Warning Banner */}
        <div
          className="flex items-center gap-3 w-full"
          style={{
            backgroundColor: '#EE8A50',
            borderRadius: '11px',
            padding: '12px 24px',
          }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#FDF0E9',
              borderRadius: '4px',
            }}
          >
            <MessageSquareWarning size={16} style={{ color: '#EE8A50' }} />
          </div>
          <span
            className="text-white break-words"
            style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
          >
            {t('curriculum.warning_note')}
          </span>
        </div>
      </div>
    </div>
  );
}
