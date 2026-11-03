import rawArticles from '../data/articles.json';

export interface BackofficeArticle {
  id: string;
  backendId?: string;
  title: string;
  year: string;
  date: string;
  author: string;
  proofreader?: string;
  illustrator?: string;
  excerpt: string;
  category: string;
  url?: string;
  readTime: string;
  coverImage?: string;
  imageUrl?: string;
  status: 'เผยแพร่แล้ว' | 'ร่างบทความ' | 'รออนุมัติ';
  views: number;
  contentHtml?: string;
  tags?: string[];
  slug?: string;
  visibility?: 'สาธารณะ' | 'ส่วนตัว';
  publishedAt?: string;
  updatedAt?: string;
  isNewlyCreated?: boolean;
}

const STORAGE_KEY = 'aksornsara_backoffice_session_articles';
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

export class ArticlesService {
  private static instance: ArticlesService;
  private articles: BackofficeArticle[] = [];
  private isSyncing = false;
  private listeners: Array<() => void> = [];

  private constructor() {
    this.load();
    this.syncFromBackend().catch(() => {});
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => {
        this.syncFromBackend().catch(() => {});
      });
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error('ArticlesService listener error:', err);
      }
    }
  }

  public static getInstance(): ArticlesService {
    if (!ArticlesService.instance) {
      ArticlesService.instance = new ArticlesService();
    }
    return ArticlesService.instance;
  }

  private load(): void {
    try {
      // Clean up legacy localStorage keys
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('aksornsara_backoffice_articles');
        localStorage.removeItem('aksornsara_backoffice_articles_v3');
      }

      // Check sessionStorage (per session; cleared when browser/tab is closed)
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as BackofficeArticle[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.articles = parsed;
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load articles from sessionStorage, using defaults', e);
    }

    // Initialize from rawArticles (All historical archive articles start with views)
    this.articles = (rawArticles as Array<{
      id: string;
      title: string;
      year: string;
      date: string;
      author: string;
      excerpt: string;
      category: string;
      tags?: string[];
      url?: string;
      readTime: string;
      coverImage?: string;
      imageUrl?: string;
      views?: number;
    }>).map((item) => {
      return {
        id: item.id,
        title: item.title,
        year: item.year,
        date: item.date || `ปี ${item.year}`,
        author: item.author || 'ชมรมสาราณียกร',
        excerpt: item.excerpt,
        category: item.category || (item.year ? `ปี ${item.year}` : 'ทั่วไป'),
        url: item.url,
        readTime: item.readTime || '5 นาที',
        coverImage: item.coverImage || item.imageUrl,
        imageUrl: item.imageUrl || item.coverImage,
        status: 'เผยแพร่แล้ว',
        views: typeof item.views === 'number' ? item.views : 0,
        publishedAt: item.date || `ปี ${item.year}`,
        tags: item.tags || [item.year ? `ปี ${item.year}` : 'บทความ', 'สาราณียกร'],
        visibility: 'สาธารณะ',
        contentHtml: `<p>${item.excerpt}</p>`,
        isNewlyCreated: false,
      };
    });

    this.save();
  }

  private save(): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.articles));
      }
    } catch (e) {
      console.error('Failed to save articles to sessionStorage', e);
    }
  }

  public async syncWithApi(): Promise<BackofficeArticle[]> {
    return this.syncFromBackend();
  }

  public async syncFromBackend(): Promise<BackofficeArticle[]> {
    if (this.isSyncing) return this.articles;
    this.isSyncing = true;
    try {
      const res = await fetch(`${API_BASE}/v1/articles?limit=1000`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer mock.jwt.admin',
        },
      });
      if (res.ok) {
        const json = await res.json();
        const items = json.data || [];
        if (Array.isArray(items) && items.length > 0) {
          const backendArticles: BackofficeArticle[] = items.map((b: any) => {
            const yr = b.category ? (b.category.match(/\d{4}/)?.[0] || '2026') : '2026';
            let formattedDate = b.category || `ปี ${yr}`;
            if (b.published_at) {
              try {
                const d = new Date(b.published_at);
                formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543}`;
              } catch {}
            }

            return {
              id: b.slug || b.id,
              backendId: b.id,
              title: b.title,
              year: yr,
              date: formattedDate,
              author: b.author_name || b.writer_credit || 'ชมรมสาราณียกร',
              proofreader: b.proofreader_credit || '',
              illustrator: b.illustrator_credit || '',
              excerpt: b.excerpt || '',
              category: b.category || `ปี ${yr}`,
              url: b.legacy_url || '',
              readTime: '5 นาที',
              coverImage: b.cover_image_url || b.image_url,
              imageUrl: b.image_url || b.cover_image_url,
              status: b.status === 'draft' ? 'ร่างบทความ' : 'เผยแพร่แล้ว',
              views: b.view_count || 0,
              contentHtml: b.content || `<p>${b.excerpt || ''}</p>`,
              tags: b.categories || [b.category || `ปี ${yr}`],
              slug: b.slug,
              visibility: b.visibility === 'private' ? 'ส่วนตัว' : 'สาธารณะ',
              publishedAt: b.published_at || formattedDate,
              updatedAt: b.updated_at,
              isNewlyCreated: false,
            };
          });

          // Merge backend articles
          const backendIdMap = new Map<string, BackofficeArticle>();
          for (const b of backendArticles) {
            backendIdMap.set(b.id, b);
            if (b.backendId) backendIdMap.set(b.backendId, b);
          }

          this.articles = this.articles.map((local) => {
            const found = backendIdMap.get(local.id) || (local.backendId ? backendIdMap.get(local.backendId) : undefined);
            if (found) {
              return {
                ...local,
                ...found,
                views: Math.max(local.views || 0, found.views || 0),
              };
            }
            return local;
          });

          const localIds = new Set(this.articles.map((a) => a.id));
          const localBackendIds = new Set(this.articles.map((a) => a.backendId).filter(Boolean));
          for (const b of backendArticles) {
            if (!localIds.has(b.id) && (!b.backendId || !localBackendIds.has(b.backendId))) {
              this.articles.unshift(b);
            }
          }

          this.save();
          this.notify();
        }
      }
    } catch (err) {
      console.warn('Failed to sync articles from backend API', err);
    } finally {
      this.isSyncing = false;
    }
    return this.articles;
  }

  public getAll(): BackofficeArticle[] {
    return [...this.articles];
  }

  public getById(id: string): BackofficeArticle | undefined {
    return this.articles.find((a) => a.id === id || a.backendId === id || a.slug === id);
  }

  public add(article: Partial<BackofficeArticle>): BackofficeArticle {
    const timestamp = Date.now();
    const newId = `new-${timestamp}`;
    const newArticle: BackofficeArticle = {
      title: article.title || '',
      year: article.year || String(new Date().getFullYear()),
      date: article.date || `ปี ${article.year || new Date().getFullYear()}`,
      author: article.author || 'ชมรมสาราณียกร',
      excerpt: article.excerpt || '',
      category: article.category || 'ทั่วไป',
      readTime: article.readTime || '5 นาที',
      status: article.status || 'ร่างบทความ',
      views: 0,
      publishedAt: article.publishedAt || new Date().toISOString(),
      ...article,
      id: newId,
      isNewlyCreated: true,
    };
    this.articles.unshift(newArticle);
    this.save();
    this.notify();

    // Async save to backend
    this.saveToBackend(newArticle);

    return newArticle;
  }

  public create(article: Partial<BackofficeArticle>): BackofficeArticle {
    return this.add(article);
  }

  private async saveToBackend(article: BackofficeArticle): Promise<void> {
    try {
      const payload = {
        title: article.title,
        excerpt: article.excerpt,
        content: article.contentHtml || article.excerpt,
        cover_image_url: article.coverImage || article.imageUrl || '',
        image_url: article.imageUrl || article.coverImage || '',
        category: article.category,
        categories: [article.category],
        author_name: article.author,
        writer_credit: article.author,
        proofreader_credit: article.proofreader || '',
        illustrator_credit: article.illustrator || '',
        status: article.status === 'ร่างบทความ' ? 'draft' : 'published',
        visibility: article.visibility === 'ส่วนตัว' ? 'private' : 'public',
        tags: article.tags || [],
      };

      const res = await fetch(`${API_BASE}/v1/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock.jwt.admin',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (data && data.id) {
          const idx = this.articles.findIndex((a) => a.id === article.id);
          if (idx !== -1) {
            this.articles[idx].backendId = data.id;
            if (data.slug) this.articles[idx].slug = data.slug;
            this.save();
          }
        }
      }
    } catch (err) {
      console.warn('Failed to save article to backend API', err);
    }
  }

  public update(id: string, updates: Partial<BackofficeArticle>): BackofficeArticle | undefined {
    const index = this.articles.findIndex((a) => a.id === id || a.backendId === id || a.slug === id);
    if (index === -1) return undefined;

    this.articles[index] = {
      ...this.articles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    this.notify();

    const target = this.articles[index];
    const targetId = target.backendId || target.id;
    this.putToBackend(targetId, updates);

    return this.articles[index];
  }

  private async putToBackend(id: string, updates: Partial<BackofficeArticle>): Promise<void> {
    try {
      const payload: Record<string, any> = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.excerpt !== undefined) payload.excerpt = updates.excerpt;
      if (updates.contentHtml !== undefined) payload.content = updates.contentHtml;
      if (updates.coverImage !== undefined) payload.cover_image_url = updates.coverImage;
      if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
      if (updates.author !== undefined) {
        payload.author_name = updates.author;
        payload.writer_credit = updates.author;
      }
      if (updates.proofreader !== undefined) payload.proofreader_credit = updates.proofreader;
      if (updates.illustrator !== undefined) payload.illustrator_credit = updates.illustrator;
      if (updates.category !== undefined) {
        payload.category = updates.category;
        payload.categories = [updates.category];
      }
      if (updates.status !== undefined) {
        payload.status = updates.status === 'ร่างบทความ' ? 'draft' : 'published';
      }
      if (updates.visibility !== undefined) {
        payload.visibility = updates.visibility === 'ส่วนตัว' ? 'private' : 'public';
      }

      await fetch(`${API_BASE}/v1/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock.jwt.admin',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Failed to update article in backend API', err);
    }
  }

  public delete(id: string): boolean {
    const target = this.articles.find((a) => a.id === id || a.backendId === id || a.slug === id);
    const targetId = target ? (target.backendId || target.id) : id;

    const prevLen = this.articles.length;
    this.articles = this.articles.filter((a) => a.id !== id && a.backendId !== id);
    if (this.articles.length !== prevLen) {
      this.save();
      this.notify();
      this.deleteFromBackend(targetId);
      return true;
    }
    return false;
  }

  private async deleteFromBackend(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/v1/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer mock.jwt.admin',
        },
      });
    } catch (err) {
      console.warn('Failed to delete article from backend API', err);
    }
  }

  public getMetrics() {
    const totalArticles = this.articles.length;
    const publishedArticles = this.articles.filter((a) => a.status === 'เผยแพร่แล้ว');
    const draftArticles = this.articles.filter((a) => a.status === 'ร่างบทความ');
    const totalViews = this.articles.reduce((sum, a) => sum + (a.views || 0), 0);

    const categoriesSet = new Set(this.articles.map((a) => a.category).filter(Boolean));
    const totalCategories = categoriesSet.size;

    // Top articles sorted by real views (highest first)
    const topArticles = [...this.articles]
      .filter((a) => (a.views || 0) > 0)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    // Recent articles: sorted by latest published or updated date from DB
    const recentArticles = [...this.articles]
      .sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.publishedAt || 0).getTime() || 0;
        const timeB = new Date(b.updatedAt || b.publishedAt || 0).getTime() || 0;
        return timeB - timeA;
      })
      .slice(0, 5);

    // Real yearly distribution across all articles
    const yearCounts: Record<string, number> = {};
    for (const a of this.articles) {
      const yr = a.year || '2026';
      yearCounts[yr] = (yearCounts[yr] || 0) + 1;
    }
    const sortedYears = Object.keys(yearCounts).sort();
    const maxCount = Math.max(...Object.values(yearCounts), 1);
    const yearlyData = sortedYears.map((yr) => ({
      year: `ปี ${yr}`,
      count: yearCounts[yr] || 0,
      pct: Math.round(((yearCounts[yr] || 0) / maxCount) * 100),
    }));

    // Real Category breakdown
    const categoryCounts: Record<string, { count: number; views: number }> = {};
    for (const a of this.articles) {
      const cat = a.category || 'ทั่วไป';
      if (!categoryCounts[cat]) {
        categoryCounts[cat] = { count: 0, views: 0 };
      }
      categoryCounts[cat].count += 1;
      categoryCounts[cat].views += a.views || 0;
    }

    const categoryData = Object.entries(categoryCounts)
      .map(([name, data]) => ({
        name,
        count: data.count,
        views: data.views,
        pct: Math.round((data.count / (totalArticles || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalArticles,
      publishedCount: publishedArticles.length,
      draftCount: draftArticles.length,
      totalViews,
      totalCategories,
      topArticles,
      recentArticles,
      yearlyData,
      categoryData,
    };
  }

  public getCategoryStats() {
    return this.getMetrics().categoryData;
  }

  public getMonthlyViewsData(targetYear: number | string = 2026) {
    const thaiMonths = [
      { short: 'ม.ค.', full: 'มกราคม', monthNum: 1 },
      { short: 'ก.พ.', full: 'กุมภาพันธ์', monthNum: 2 },
      { short: 'มี.ค.', full: 'มีนาคม', monthNum: 3 },
      { short: 'เม.ย.', full: 'เมษายน', monthNum: 4 },
      { short: 'พ.ค.', full: 'พฤษภาคม', monthNum: 5 },
      { short: 'มิ.ย.', full: 'มิถุนายน', monthNum: 6 },
      { short: 'ก.ค.', full: 'กรกฎาคม', monthNum: 7 },
      { short: 'ส.ค.', full: 'สิงหาคม', monthNum: 8 },
      { short: 'ก.ย.', full: 'กันยายน', monthNum: 9 },
      { short: 'ต.ค.', full: 'ตุลาคม', monthNum: 10 },
      { short: 'พ.ย.', full: 'พฤศจิกายน', monthNum: 11 },
      { short: 'ธ.ค.', full: 'ธันวาคม', monthNum: 12 },
    ];

    return thaiMonths.map((m) => {
      const matched = this.articles.filter((a) => {
        // Year filter
        if (targetYear !== 'all') {
          const yr = a.year || (a.publishedAt ? String(new Date(a.publishedAt).getFullYear()) : '2026');
          if (String(yr) !== String(targetYear)) return false;
        }

        // Match month
        const d = a.publishedAt || a.date || '';
        if (d.includes(m.short) || d.includes(m.full)) return true;

        // ISO pattern (e.g. -01- or 2026-01)
        const prefix = `-${String(m.monthNum).padStart(2, '0')}-`;
        const prefix2 = `-${String(m.monthNum).padStart(2, '0')}`;
        if (d.includes(prefix) || d.includes(prefix2)) return true;

        // If generic date e.g. "ปี 2026", distribute into issues/months
        const idNum = parseInt(a.id.replace(/\D/g, '') || '0', 10);
        return (idNum % 12) + 1 === m.monthNum;
      });

      const views = matched.reduce((sum, a) => sum + (a.views || 0), 0);
      const articleCount = matched.length;

      return {
        month: m.short,
        monthFull: `${m.full} ${targetYear === 'all' ? '(รวมทุกปี)' : `ปี ${targetYear}`}`,
        views,
        articleCount,
      };
    });
  }
}

export const articlesService = ArticlesService.getInstance();
