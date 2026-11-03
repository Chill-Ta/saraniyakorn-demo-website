import type { ArticleSummary, ArticleDetail } from './types.js';
import ArticleBannerMock from '../../assets/ArticleBannerMock.jpg';
import articlesSummaryData from './data/articles-summary.json';
import articlesDetailData from './data/articles-detail.json';

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

export const AKSORNSARA_YEARS = [
  'all',
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
] as const;

export const AKSORNSARA_CATEGORIES = [...AKSORNSARA_YEARS];
export const SARANIYAKORN_CATEGORIES = AKSORNSARA_CATEGORIES;

export const getMockArticlesFromSession = (): ArticleDetail[] => {
  if (typeof window === 'undefined' || !window.sessionStorage) return [];
  try {
    const raw = sessionStorage.getItem('aksornsara_mock_articles');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse mock articles from sessionStorage', e);
  }
  return [];
};

export const saveMockArticleToSession = (article: ArticleDetail): void => {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    const current = getMockArticlesFromSession();
    const existingIndex = current.findIndex((a) => a.id === article.id);
    let updated: ArticleDetail[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = article;
    } else {
      updated = [article, ...current];
    }
    sessionStorage.setItem('aksornsara_mock_articles', JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save mock article to sessionStorage', e);
  }
};

export const fetchRemoteArticles = async (): Promise<ArticleSummary[]> => {
  try {
    const res = await fetch(`${API_BASE}/v1/articles?limit=1000`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (res.ok) {
      const json = await res.json();
      const items = json.data || [];
      if (Array.isArray(items) && items.length > 0) {
        const remoteList: ArticleSummary[] = items.map((item: any) => {
          const yr = item.category ? (item.category.match(/\d{4}/)?.[0] || '2026') : '2026';
          let formattedDate = item.category || `ปี ${yr}`;
          if (item.published_at) {
            try {
              const d = new Date(item.published_at);
              formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543}`;
            } catch {}
          }
          const img = item.cover_image_url || item.image_url || ArticleBannerMock;
          return {
            id: item.slug || item.id,
            title: item.title,
            year: yr,
            date: formattedDate,
            author: item.author_name || item.writer_credit || 'ชมรมสาราณียกร',
            excerpt: item.excerpt || '',
            category: item.category || `ปี ${yr}`,
            url: item.legacy_url || '',
            readTime: '5 นาที',
            imageUrl: img,
            coverImage: img,
            href: `/articles/${item.slug || item.id}`,
          };
        });

        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem('aksornsara_remote_articles', JSON.stringify(remoteList));
        }
        return remoteList;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch remote articles from backend API', err);
  }
  return getArticlesSummaryList();
};

export const getArticlesSummaryList = (): ArticleSummary[] => {
  let baseList: ArticleSummary[] = [];

  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const cached = sessionStorage.getItem('aksornsara_remote_articles');
      if (cached) {
        const parsed = JSON.parse(cached) as ArticleSummary[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseList = parsed;
        }
      }
    } catch {}
  }

  if (baseList.length === 0) {
    baseList = (articlesSummaryData as ArticleSummary[]).map((art) => ({
      ...art,
      imageUrl: art.imageUrl || ArticleBannerMock,
      href: `/articles/${art.id}`,
    }));
  }

  const mocks = getMockArticlesFromSession().map((m) => ({
    id: m.id,
    title: m.title,
    year: m.year || '2026',
    date: m.date || 'ปี 2026',
    author: m.author || 'ชมรมสาราณียกร',
    excerpt: m.excerpt,
    category: m.category || '2026',
    url: m.url || '',
    readTime: m.readTime || '5 นาที',
    imageUrl: m.imageUrl || m.coverImage || ArticleBannerMock,
    coverImage: m.coverImage || m.imageUrl || ArticleBannerMock,
    href: `/articles/${m.id}`,
  }));

  const mockIds = new Set(mocks.map((m) => m.id));
  return [...mocks, ...baseList.filter((b) => !mockIds.has(b.id))];
};

export const ARTICLES_SUMMARY: ArticleSummary[] = getArticlesSummaryList();
export const MOCK_ARTICLES = ARTICLES_SUMMARY;

export const fetchArticleDetail = async (id: string): Promise<ArticleDetail | null> => {
  try {
    const res = await fetch(`${API_BASE}/v1/articles/${encodeURIComponent(id)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const item = json.data || json;
    if (!item || !item.id) return null;

    const yr = item.category ? (item.category.match(/\d{4}/)?.[0] || '2026') : '2026';
    let formattedDate = item.category || `ปี ${yr}`;
    if (item.published_at) {
      try {
        const d = new Date(item.published_at);
        formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543}`;
      } catch {}
    }
    const img = item.cover_image_url || item.image_url || ArticleBannerMock;

    return {
      id: item.slug || item.id,
      title: item.title,
      year: yr,
      date: formattedDate,
      author: item.author_name || item.writer_credit || 'ชมรมสาราณียกร',
      proofreader: item.proofreader_credit || '',
      illustrator: item.illustrator_credit || '',
      excerpt: item.excerpt || '',
      contentHtml: item.content || `<p>${item.excerpt || ''}</p>`,
      content: item.content ? item.content.split('\n\n').filter(Boolean) : [item.excerpt || ''],
      category: item.category || `ปี ${yr}`,
      url: item.legacy_url || '',
      readTime: '5 นาที',
      imageUrl: img,
      coverImage: img,
      references: Array.isArray(item.references) ? item.references : [],
      href: `/articles/${item.slug || item.id}`,
    };
  } catch (err) {
    console.warn('Failed to fetch article detail from backend', err);
    return null;
  }
};

const recentViewTimestamps = new Map<string, number>();

export const recordArticleView = async (id: string): Promise<void> => {
  if (!id) return;
  const now = Date.now();
  const lastView = recentViewTimestamps.get(id) || 0;
  if (now - lastView < 2000) {
    return; // Debounce React 18 double invocation
  }
  recentViewTimestamps.set(id, now);

  try {
    await fetch(`${API_BASE}/v1/articles/${encodeURIComponent(id)}/views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source: 'direct' }),
    });
  } catch (err) {
    console.warn(`Failed to record view for article ${id}`, err);
  }
};

export const getArticleDetail = (id: string): ArticleDetail | undefined => {
  // 1. Check session mock articles first
  const mocks = getMockArticlesFromSession();
  const foundMock = mocks.find((m) => m.id === id);
  if (foundMock) {
    return {
      ...foundMock,
      imageUrl: foundMock.imageUrl || foundMock.coverImage || ArticleBannerMock,
      href: `/articles/${foundMock.id}`,
    };
  }

  // 2. Check static JSON archive data
  const details = articlesDetailData as Record<string, ArticleDetail>;
  const article = details[id];
  if (article) {
    return {
      ...article,
      imageUrl: article.imageUrl || ArticleBannerMock,
      href: `/articles/${article.id}`,
    };
  }

  // 3. Check cached remote articles
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const cached = sessionStorage.getItem('aksornsara_remote_articles');
      if (cached) {
        const parsed = JSON.parse(cached) as ArticleSummary[];
        const found = parsed.find((p) => p.id === id);
        if (found) {
          return {
            ...found,
            content: [found.excerpt || ''],
            references: [],
          };
        }
      }
    } catch {}
  }

  return undefined;
};

export { ArticleBannerMock };
