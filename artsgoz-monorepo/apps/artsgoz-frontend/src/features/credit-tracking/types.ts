export interface AcademicProfile {
  major: string;
  minor: string;
  curriculum: string;
}

export type SubjectCategory =
  | 'categories.basic'
  | 'categories.general'
  | 'categories.free'
  | 'categories.major'
  | 'categories.minor'
  | 'credit_tracking.categories.basic'
  | 'credit_tracking.categories.general'
  | 'credit_tracking.categories.free'
  | 'credit_tracking.categories.major'
  | 'credit_tracking.categories.minor';

export interface Subject {
  id: string;
  code: string;
  nameKey: string;
  credits: number;
  category: SubjectCategory;
  semester: number; // 1-8 (Year 1 Sem 1 = 1, Year 4 Sem 2 = 8)
  completed: boolean;
  group?: string;
  isCustom?: boolean;
}

export interface CategoryProgress {
  category: SubjectCategory;
  completed: number;
  required: number;
}
