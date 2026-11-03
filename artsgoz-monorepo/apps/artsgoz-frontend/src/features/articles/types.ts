export interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  href: string;
  author: string;
  category: string;
  content?: string[];
}
