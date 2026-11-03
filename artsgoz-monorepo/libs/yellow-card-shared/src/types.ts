export interface StudentProfile {
  name: string;
  studentId: string;
  major: string;
  minor: string;
  curriculum: string;
  advisor: string;
  address: string;
  phone: string;
}

export type YellowCardCategory =
  | 'credit_tracking.categories.basic'
  | 'credit_tracking.categories.general'
  | 'credit_tracking.categories.free'
  | 'credit_tracking.categories.major'
  | 'credit_tracking.categories.minor';

export interface YellowCardSubject {
  id: string;
  code: string;
  nameKey: string;
  semester: string;
  credits: string; // Keep as string for easy form input editing, parse to float for calculations
  grade: string;   // A, B+, B, C+, C, D+, D, F, S, U, etc.
  category: YellowCardCategory;
  group: string;   // e.g. "credit_tracking.planner.groups.basic.g1", etc.
}

export interface GPATermData {
  semester: string; // e.g. "1/2566"
  ca: number;       // Credits Attempted
  cg: number;       // Credits Earned
  gpa: number;      // Term GPA
  cax: number;      // Cumulative Credits Attempted
  cgx: number;      // Cumulative Credits Earned
  gpax: number;     // Cumulative GPA
}

export interface TrackerSubject {
  id: string;
  code: string;
  nameKey: string;
  credits: number;
  category: YellowCardCategory;
  semester: number;
  completed: boolean;
  group?: string;
  isCustom?: boolean;
}
