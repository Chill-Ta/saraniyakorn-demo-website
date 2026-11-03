import type { Subject } from '../types.js';
import { MAJOR_CURRICULUMS, MINOR_CURRICULUMS } from '@artsgoz/yellow-card-shared';

/**
 * Maps the raw Thai group string from curriculumData to a canonical group key.
 * For major courses:
 *   "1. กลุ่มวิชาพื้นฐาน..." -> "major-compulsory"
 *   "2. กลุ่มวิชาข้อกำหนดเฉพาะ..." -> "major-specified"
 *   "3. กลุ่มวิชาเชี่ยวชาญ..." -> "major-specialized"
 *   "วิชาบังคับเลือก" or other -> kept as-is (Thai raw label)
 *   "วิชาเลือก" -> "major-elective"
 */
function mapMajorGroup(rawGroup: string): string {
  if (rawGroup.includes('1.') || (rawGroup.includes('พื้นฐาน') && rawGroup.includes('บังคับ'))) {
    return 'major-compulsory';
  }
  if (rawGroup.includes('2.') || rawGroup.includes('ข้อกำหนดเฉพาะ')) {
    return 'major-specified';
  }
  if (rawGroup.includes('3.') || rawGroup.includes('เชี่ยวชาญ')) {
    return 'major-specialized';
  }
  if (rawGroup.includes('บังคับเลือก')) {
    return 'major-required-elective';
  }
  // Default bucket for "วิชาเลือก" or anything else
  return 'major-elective';
}

/** Maps the Thai group string from MINOR_CURRICULUMS to a canonical key. */
function mapMinorGroup(rawGroup: string): string {
  if (rawGroup === 'วิชาบังคับ') return 'minor-compulsory';
  if (rawGroup === 'วิชาบังคับเลือก') return 'minor-required-elective';
  return 'minor-elective';
}

export function generateSubjectsForProfile(majorKeyRaw: string, minorKeyRaw: string): Subject[] {
  const majorKey = majorKeyRaw
    ? majorKeyRaw.replace(/^credit_tracking\./, '').replace(/^majors\./, '')
    : 'thai';
  const minorKey = minorKeyRaw
    ? minorKeyRaw.replace(/^credit_tracking\./, '').replace(/^minors\./, '')
    : '';

  const majorInfo = MAJOR_CURRICULUMS[majorKey];
  const minorInfo = MINOR_CURRICULUMS[minorKey];

  const subjects: Subject[] = [];

  // 1. หมวดวิชาพื้นฐานอักษร (27 หน่วยกิต) – fixed baseline subjects
  const basicArtsDefaults = [
    { id: 'b1', code: '2201111', nameKey: 'ภาษาอังกฤษ 1', credits: 3, semester: 1 },
    { id: 'b2', code: '2201112', nameKey: 'ภาษาอังกฤษ 2', credits: 3, semester: 1 },
    { id: 'b3', code: '2201121', nameKey: 'การใช้ภาษาไทย', credits: 3, semester: 1 },
    { id: 'b4', code: '2201122', nameKey: 'การแปลขั้นต้น', credits: 3, semester: 2 },
    { id: 'b5', code: '2201211', nameKey: 'วรรณคดีวิจารณ์', credits: 3, semester: 2 },
    { id: 'b6', code: '2201221', nameKey: 'อารยธรรมตะวันออก', credits: 3, semester: 3 },
    { id: 'b7', code: '2201222', nameKey: 'อารยธรรมตะวันตก', credits: 3, semester: 3 },
  ];

  basicArtsDefaults.forEach((b) => {
    subjects.push({
      id: b.id,
      code: b.code,
      nameKey: b.nameKey,
      credits: b.credits,
      category: 'categories.basic',
      group: 'planner.groups.basic.g1',
      completed: true,
      semester: b.semester,
    });
  });

  // 2. หมวดการศึกษาทั่วไป (30 หน่วยกิต) – placeholder entries
  const genEdDefaults = [
    { id: 'g1', code: '5500111', nameKey: 'ภาษาอังกฤษพื้นฐาน 1', credits: 3, semester: 1 },
    { id: 'g2', code: '2200181', nameKey: 'การใช้เหตุผล', credits: 3, semester: 2 },
    { id: 'g3', code: '2200234', nameKey: 'การอ่านเชิงวิเคราะห์', credits: 3, semester: 3 },
    { id: 'g4', code: '2200256', nameKey: 'วิทยาศาสตร์และเทคโนโลยีในโลกสมัยใหม่', credits: 3, semester: 4 },
  ];

  genEdDefaults.forEach((g) => {
    subjects.push({
      id: g.id,
      code: g.code,
      nameKey: g.nameKey,
      credits: g.credits,
      category: 'categories.general',
      group: 'planner.groups.general.g1',
      completed: true,
      semester: g.semester,
    });
  });

  // 3. หมวดวิชาเอก (48 หน่วยกิต) – ALL courses from MAJOR_CURRICULUMS
  if (majorInfo && majorInfo.courses.length > 0) {
    majorInfo.courses.forEach((c, index) => {
      const groupKey = mapMajorGroup(c.group || '');
      subjects.push({
        id: `major-${index}-${c.code}`,
        code: c.code,
        nameKey: c.nameTh,
        credits: c.credits || 3,
        category: 'categories.major',
        // Store the canonical group key; display label is resolved in PlannerView
        group: groupKey,
        completed: false,
        semester: 3 + (index % 6),
      });
    });
  } else {
    // Fallback if no curriculum data found for this major
    const fallbackMajor = [
      { id: 'mf1', code: '—', nameKey: 'วิชาพื้นฐานเอก 1', credits: 3, group: 'major-compulsory' },
      { id: 'mf2', code: '—', nameKey: 'วิชาพื้นฐานเอก 2', credits: 3, group: 'major-compulsory' },
      { id: 'mf3', code: '—', nameKey: 'วิชาข้อกำหนดเฉพาะ 1', credits: 3, group: 'major-specified' },
      { id: 'mf4', code: '—', nameKey: 'วิชาเชี่ยวชาญ 1', credits: 3, group: 'major-specialized' },
    ];
    fallbackMajor.forEach((f, i) =>
      subjects.push({
        id: f.id,
        code: f.code,
        nameKey: f.nameKey,
        credits: f.credits,
        category: 'categories.major',
        group: f.group,
        completed: false,
        semester: 3 + i,
      })
    );
  }

  // 4. หมวดวิชาโท (18 หน่วยกิต) – ALL courses from MINOR_CURRICULUMS
  if (minorInfo && minorInfo.courses.length > 0) {
    minorInfo.courses.forEach((c, index) => {
      const groupKey = mapMinorGroup(c.group || '');
      subjects.push({
        id: `minor-${index}-${c.code}`,
        code: c.code,
        nameKey: c.nameTh,
        credits: c.credits || 3,
        category: 'categories.minor',
        group: groupKey,
        completed: false,
        semester: 4 + (index % 4),
      });
    });
  } else if (minorKey && minorKey !== 'none' && minorKey !== 'default') {
    // Fallback if minor was selected but no curriculum data found
    const fallbackMinor = [
      { id: 'mnf1', code: '—', nameKey: 'วิชาโทบังคับ 1', credits: 3, group: 'minor-compulsory' },
      { id: 'mnf2', code: '—', nameKey: 'วิชาโทบังคับ 2', credits: 3, group: 'minor-compulsory' },
      { id: 'mnf3', code: '—', nameKey: 'วิชาโทเลือก 1', credits: 3, group: 'minor-elective' },
    ];
    fallbackMinor.forEach((f, i) =>
      subjects.push({
        id: f.id,
        code: f.code,
        nameKey: f.nameKey,
        credits: f.credits,
        category: 'categories.minor',
        group: f.group,
        completed: false,
        semester: 4 + i,
      })
    );
  }

  // 5. หมวดวิชาเลือกเสรี (6 หน่วยกิต) – placeholder entries
  const freeDefaults = [
    { id: 'f1', code: '—', nameKey: 'วิชาเลือกเสรี 1', credits: 3, semester: 7, completed: false },
    { id: 'f2', code: '—', nameKey: 'วิชาเลือกเสรี 2', credits: 3, semester: 8, completed: false },
  ];

  freeDefaults.forEach((f) => {
    subjects.push({
      id: f.id,
      code: f.code,
      nameKey: f.nameKey,
      credits: f.credits,
      category: 'categories.free',
      group: 'planner.groups.free.g1',
      completed: f.completed,
      semester: f.semester,
    });
  });

  return subjects;
}

/**
 * Returns the ordered list of canonical group keys for the major category,
 * based on what groups are present in the subjects list.
 */
export function getMajorGroups(subjects: Subject[]): string[] {
  const majorSubjects = subjects.filter((s) => s.category === 'categories.major' || s.category === 'credit_tracking.categories.major');
  const seen = new Set<string>();
  const order = ['major-compulsory', 'major-required-elective', 'major-specified', 'major-specialized', 'major-elective'];
  const present: string[] = [];
  for (const key of order) {
    if (majorSubjects.some((s) => s.group === key)) {
      if (!seen.has(key)) {
        seen.add(key);
        present.push(key);
      }
    }
  }
  // Catch any unexpected group keys not in the predefined order
  majorSubjects.forEach((s) => {
    if (s.group && !seen.has(s.group)) {
      seen.add(s.group);
      present.push(s.group);
    }
  });
  return present;
}

/**
 * Returns the ordered list of canonical group keys for the minor category.
 */
export function getMinorGroups(subjects: Subject[]): string[] {
  const minorSubjects = subjects.filter((s) => s.category === 'categories.minor' || s.category === 'credit_tracking.categories.minor');
  const seen = new Set<string>();
  const order = ['minor-compulsory', 'minor-required-elective', 'minor-elective'];
  const present: string[] = [];
  for (const key of order) {
    if (minorSubjects.some((s) => s.group === key)) {
      if (!seen.has(key)) {
        seen.add(key);
        present.push(key);
      }
    }
  }
  minorSubjects.forEach((s) => {
    if (s.group && !seen.has(s.group)) {
      seen.add(s.group);
      present.push(s.group);
    }
  });
  return present;
}

/** Human-readable Thai label for each canonical group key (no i18n needed). */
export function getGroupLabel(groupKey: string): string {
  switch (groupKey) {
    case 'major-compulsory': return 'กลุ่มวิชาพื้นฐาน (บังคับ)';
    case 'major-required-elective': return 'วิชาบังคับเลือก';
    case 'major-specified': return 'กลุ่มวิชาข้อกำหนดเฉพาะ (วิชาเลือก)';
    case 'major-specialized': return 'กลุ่มวิชาเชี่ยวชาญ (วิชาเลือก)';
    case 'major-elective': return 'วิชาเลือก';
    case 'minor-compulsory': return 'วิชาบังคับ';
    case 'minor-required-elective': return 'วิชาบังคับเลือก';
    case 'minor-elective': return 'วิชาเลือก';
    case 'planner.groups.basic.g1': return 'กลุ่มวิชาพื้นฐานอักษรศาสตร์';
    case 'planner.groups.general.g1': return 'กลุ่มวิชาการศึกษาทั่วไป';
    case 'planner.groups.free.g1': return 'วิชาเลือกเสรี';
    default: return groupKey;
  }
}
