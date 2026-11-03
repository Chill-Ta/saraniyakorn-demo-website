import type { YellowCardSubject, YellowCardCategory, TrackerSubject } from '../types.js';
import { CATEGORIES_CONFIG } from '../constants.js';

/**
 * Calculates the total completed credits for the given categories.
 * A subject is counted as completed if it has a grade and the grade is not 'F' or 'U'.
 */
export function calculateTotalCredits(
  subjects: YellowCardSubject[],
  categoriesList: YellowCardCategory[]
): number {
  return subjects
    .filter((s) => categoriesList.includes(s.category) && s.grade && s.grade !== 'F' && s.grade !== 'U')
    .reduce((sum, s) => sum + (parseFloat(s.credits) || 0), 0);
}

/**
 * Maps a TrackerSubject (from the Credit Tracking system) to a YellowCardSubject.
 */
export function mapTrackerSubjectToYellowCard(
  ts: TrackerSubject,
  studentId: string
): YellowCardSubject {
  // Map category
  let category: YellowCardCategory = 'credit_tracking.categories.basic';
  const tsCat = String(ts.category || '');
  if (tsCat === 'credit_tracking.categories.general' || tsCat === 'หมวดการศึกษาทั่วไป') {
    category = 'credit_tracking.categories.general';
  } else if (tsCat === 'credit_tracking.categories.free' || tsCat === 'หมวดวิชาเลือกเสรี') {
    category = 'credit_tracking.categories.free';
  } else if (tsCat === 'credit_tracking.categories.major' || tsCat === 'หมวดวิชาเอก') {
    category = 'credit_tracking.categories.major';
  } else if (tsCat === 'credit_tracking.categories.minor' || tsCat === 'หมวดวิชาโท') {
    category = 'credit_tracking.categories.minor';
  } else if (tsCat === 'credit_tracking.categories.basic' || tsCat === 'หมวดวิชาพื้นฐานอักษรศาสตร์' || tsCat === 'หมวดวิชาพื้นฐานอักษร') {
    category = 'credit_tracking.categories.basic';
  }

  // Map group (default to first group in the category, or find match)
  let group = '';
  const catConfig = CATEGORIES_CONFIG.find((c) => c.category === category);
  if (catConfig) {
    const matchedGroup = catConfig.groups.find(
      (g) =>
        g.includes(ts.group || '') ||
        (ts.group && ts.group.includes(g)) ||
        (tsCat === 'หมวดวิชาเลือกเสรี' && g === 'credit_tracking.planner.groups.free.g1')
    );
    group = matchedGroup || catConfig.groups[0] || '';
  }

  // Convert tracker semester number (1-8) to academic year/term format (e.g., "1/67", "2/67")
  let semesterString = '';
  if (ts.semester !== undefined && ts.semester !== null) {
    const semNum = Number(ts.semester) || 1;
    const studentIdStr = String(studentId || '67');
    const entryYearShort = parseInt(studentIdStr.substring(0, 2)) || 67;

    const term = ((semNum - 1) % 2) + 1;
    const yearOffset = Math.floor((semNum - 1) / 2);
    const semesterYear = entryYearShort + yearOffset;
    semesterString = `${term}/${semesterYear}`;
  }

  return {
    id: `tracker-${ts.id}`,
    code: ts.code || '0000000',
    nameKey: ts.nameKey || 'yellow_card.placeholder_subject',
    semester: semesterString,
    credits: (ts.credits || 3).toString(),
    grade: ts.completed ? 'A' : '', // Default to A if marked completed in credit tracking
    category,
    group,
  };
}

/**
 * Merges newly imported subjects from Credit Tracking with current subjects.
 * Keeps non-empty current subjects and appends the imported ones.
 */
export function mergeImportedSubjects(
  currentSubjects: YellowCardSubject[],
  importedSubjects: YellowCardSubject[]
): YellowCardSubject[] {
  const validCurrent = currentSubjects.filter((s) => s.code || s.nameKey);
  const existingIds = new Set(validCurrent.map((s) => s.id));
  const seenIds = new Set(existingIds);

  const uniqueImported: YellowCardSubject[] = [];
  for (const subject of importedSubjects) {
    if (!seenIds.has(subject.id)) {
      seenIds.add(subject.id);
      uniqueImported.push(subject);
    }
  }

  return [...validCurrent, ...uniqueImported];
}
