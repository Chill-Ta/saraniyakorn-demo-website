// Shared mock data and types for internship pages

export interface InternshipCard {
  id: string;
  positionKey: string;
  companyKey: string;
  detailKey: string;
  languageTagKey: string;
  logoPlaceholder: string;
  isBookmarked?: boolean;
}

export interface InternshipReview {
  id: string;
  positionKey: string;
  companyKey: string;
  excerptKey: string;
  languageTagKey: string;
  rating: number;
  logoPlaceholder: string;
  authorKey: string;
  dateKey: string;
}

export const MOCK_OPEN_INTERNSHIPS: InternshipCard[] = [
  {
    id: 'open-1',
    positionKey: 'internships.open.pos1',
    companyKey: 'internships.open.co1',
    detailKey: 'internships.open.detail1',
    languageTagKey: 'internships.tags.japanese',
    logoPlaceholder: 'JP',
  },
  {
    id: 'open-2',
    positionKey: 'internships.open.pos2',
    companyKey: 'internships.open.co2',
    detailKey: 'internships.open.detail2',
    languageTagKey: 'internships.tags.spanish',
    logoPlaceholder: 'ES',
  },
  {
    id: 'open-3',
    positionKey: 'internships.open.pos3',
    companyKey: 'internships.open.co3',
    detailKey: 'internships.open.detail3',
    languageTagKey: 'internships.tags.chinese',
    logoPlaceholder: 'ZH',
  },
  {
    id: 'open-4',
    positionKey: 'internships.open.pos4',
    companyKey: 'internships.open.co4',
    detailKey: 'internships.open.detail4',
    languageTagKey: 'internships.tags.french',
    logoPlaceholder: 'FR',
  },
  {
    id: 'open-5',
    positionKey: 'internships.open.pos5',
    companyKey: 'internships.open.co5',
    detailKey: 'internships.open.detail5',
    languageTagKey: 'internships.tags.korean',
    logoPlaceholder: 'KO',
  },
  {
    id: 'open-6',
    positionKey: 'internships.open.pos6',
    companyKey: 'internships.open.co6',
    detailKey: 'internships.open.detail6',
    languageTagKey: 'internships.tags.german',
    logoPlaceholder: 'DE',
  },
];

export const MOCK_INTERNSHIP_REVIEWS: InternshipReview[] = [
  {
    id: 'rev-1',
    positionKey: 'internships.reviews.pos1',
    companyKey: 'internships.reviews.co1',
    excerptKey: 'internships.reviews.excerpt1',
    languageTagKey: 'internships.tags.japanese',
    rating: 5,
    logoPlaceholder: 'JP',
    authorKey: 'internships.reviews.author1',
    dateKey: 'internships.reviews.date1',
  },
  {
    id: 'rev-2',
    positionKey: 'internships.reviews.pos2',
    companyKey: 'internships.reviews.co2',
    excerptKey: 'internships.reviews.excerpt2',
    languageTagKey: 'internships.tags.chinese',
    rating: 4,
    logoPlaceholder: 'ZH',
    authorKey: 'internships.reviews.author2',
    dateKey: 'internships.reviews.date2',
  },
  {
    id: 'rev-3',
    positionKey: 'internships.reviews.pos3',
    companyKey: 'internships.reviews.co3',
    excerptKey: 'internships.reviews.excerpt3',
    languageTagKey: 'internships.tags.spanish',
    rating: 5,
    logoPlaceholder: 'ES',
    authorKey: 'internships.reviews.author3',
    dateKey: 'internships.reviews.date3',
  },
  {
    id: 'rev-4',
    positionKey: 'internships.reviews.pos4',
    companyKey: 'internships.reviews.co4',
    excerptKey: 'internships.reviews.excerpt4',
    languageTagKey: 'internships.tags.french',
    rating: 4,
    logoPlaceholder: 'FR',
    authorKey: 'internships.reviews.author4',
    dateKey: 'internships.reviews.date4',
  },
  {
    id: 'rev-5',
    positionKey: 'internships.reviews.pos5',
    companyKey: 'internships.reviews.co5',
    excerptKey: 'internships.reviews.excerpt5',
    languageTagKey: 'internships.tags.korean',
    rating: 5,
    logoPlaceholder: 'KO',
    authorKey: 'internships.reviews.author5',
    dateKey: 'internships.reviews.date5',
  },
  {
    id: 'rev-6',
    positionKey: 'internships.reviews.pos6',
    companyKey: 'internships.reviews.co6',
    excerptKey: 'internships.reviews.excerpt6',
    languageTagKey: 'internships.tags.german',
    rating: 3,
    logoPlaceholder: 'DE',
    authorKey: 'internships.reviews.author6',
    dateKey: 'internships.reviews.date6',
  },
];

export const LANGUAGE_FILTER_TAGS = [
  { key: 'all', labelKey: 'internships.filter.all' },
  { key: 'japanese', labelKey: 'internships.tags.japanese' },
  { key: 'chinese', labelKey: 'internships.tags.chinese' },
  { key: 'spanish', labelKey: 'internships.tags.spanish' },
  { key: 'french', labelKey: 'internships.tags.french' },
  { key: 'korean', labelKey: 'internships.tags.korean' },
  { key: 'german', labelKey: 'internships.tags.german' },
  { key: 'english', labelKey: 'internships.tags.english' },
] as const;

export const SORT_OPTIONS = [
  { key: 'newest', labelKey: 'internships.sort.newest' },
  { key: 'oldest', labelKey: 'internships.sort.oldest' },
] as const;
