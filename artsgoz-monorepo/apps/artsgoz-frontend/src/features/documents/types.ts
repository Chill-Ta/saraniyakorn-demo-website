export type DocumentStatus = 'failed' | 'pending' | 'neutral' | 'none';

export interface DocumentItem {
  id: string;
  nameKey: string;
  detailsKey: string;
  categoryKey: string;
  status: DocumentStatus;
  downloadUrl: string;
}

export const DOCUMENT_CATEGORIES = [
  'documents.categories.saved',
  'documents.categories.courses',
  'documents.categories.scholarships',
  'documents.categories.internships',
  'documents.categories.kos',
  'documents.categories.others',
] as const;
