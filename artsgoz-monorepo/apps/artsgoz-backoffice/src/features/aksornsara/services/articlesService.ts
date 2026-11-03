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

  private constructor() {
    this.load();
    this.syncFromBackend().catch(() => {});
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

    // Initialize from rawArticles (All 169 historical archive articles are published, views start at 0)
    this.articles = (rawArticles as Array<{
      id: string;
      title: string;
      year: string;
      date: string;
      author: string;
      excerpt: string;
      category: string;
      url?: string;
      readTime: string;
      coverImage?: string;
      imageUrl?: string;
    }>).map((item) => {
      return {
        id: item.id,
        title: item.title,
        year: item.year,
        date: item.date || `ปี ${item.year}`,
        author: item.author || 'ชมรมสาราณียกร',
        excerpt: item.excerpt,
        category: item.year ? `ปี ${item.year}` : item.category,
        url: item.url,
        readTime: item.readTime || '5 นาที',
        coverImage: item.coverImage || item.imageUrl,
        imageUrl: item.imageUrl || item.coverImage,
        status: 'เผยแพร่แล้ว',
        views: 0,
        publishedAt: item.date || `ปี ${item.year}`,
        tags: [item.year ? `ปี ${item.year}` : 'บทความ', 'สาราณียกร'],
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
              coverImage: b.cover_image_url || b.image_url || '',
              imageUrl: b.image_url || b.cover_image_url || '',
              status: b.status === 'published' ? 'เผยแพร่แล้ว' : 'ร่างบทความ',
              views: Number(b.view_count ?? b.views_count ?? 0),
              contentHtml: b.content || `<p>${b.excerpt || ''}</p>`,
              tags: Array.isArray(b.tags) ? b.tags : [b.category || `ปี ${yr}`, 'สาราณียกร'],
              slug: b.slug || b.id,
              visibility: b.visibility === 'private' ? 'ส่วนตัว' : 'สาธารณะ',
              publishedAt: b.published_at || formattedDate,
              updatedAt: b.updated_at || new Date().toISOString(),
              isNewlyCreated: false,
            };
          });

          // Preserve any newly created un-synced items at top
          const newLocal = this.articles.filter((a) => a.isNewlyCreated && !backendArticles.some((b) => b.backendId === a.backendId || b.id === a.id));
          this.articles = [...newLocal, ...backendArticles];
          this.save();
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

  public create(data: Partial<BackofficeArticle>): BackofficeArticle {
    const nextNumber = this.articles.length + 1;
    const newId = `art-${String(nextNumber).padStart(3, '0')}`;
    const now = new Date();
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const yrShort = String(now.getFullYear() + 543).slice(-2);
    const publishedAt = `${now.getDate()} ${months[now.getMonth()]} ${yrShort}`;

    const newArticle: BackofficeArticle = {
      id: newId,
      title: data.title?.trim() || 'บทความใหม่ไม่มีชื่อ',
      year: data.year || '2026',
      date: data.date || 'ปี 2026',
      author: data.author?.trim() || 'ชมรมสาราณียกร',
      proofreader: data.proofreader?.trim() || '',
      illustrator: data.illustrator?.trim() || '',
      excerpt: data.excerpt || (data.contentHtml ? data.contentHtml.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : ''),
      category: data.category || 'ปี 2026',
      url: data.url || '',
      readTime: data.readTime || '5 นาที',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1000',
      imageUrl: data.imageUrl || data.coverImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1000',
      status: data.status || 'เผยแพร่แล้ว',
      views: data.views ?? 0,
      contentHtml: data.contentHtml || '',
      tags: data.tags || ['ปี 2026', 'สาราณียกร'],
      slug: data.slug || newId,
      visibility: data.visibility || 'สาธารณะ',
      publishedAt,
      updatedAt: now.toISOString(),
      isNewlyCreated: true,
    };

    // Prepend so new article appears at the top of recent articles
    this.articles = [newArticle, ...this.articles];
    this.save();

    // Asynchronously send to backend API
    this.postToBackend(newArticle, data);

    return newArticle;
  }

  private async postToBackend(article: BackofficeArticle, rawData: Partial<BackofficeArticle>): Promise<void> {
    try {
      const payload = {
        title: article.title,
        slug: rawData.slug || article.slug || undefined,
        excerpt: article.excerpt,
        content: article.contentHtml || article.excerpt || '<p></p>',
        cover_image_url: article.coverImage || article.imageUrl,
        image_url: article.imageUrl || article.coverImage,
        author_name: article.author,
        writer_credit: article.author,
        proofreader_credit: article.proofreader,
        illustrator_credit: article.illustrator,
        category: article.category,
        categories: [article.category],
        tags: article.tags || [article.category, 'สาราณียกร'],
        status: article.status === 'ร่างบทความ' ? 'draft' : 'published',
        visibility: article.visibility === 'ส่วนตัว' ? 'private' : 'public',
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
        const createdItem = json.data || json;
        if (createdItem?.id) {
          article.backendId = createdItem.id;
          if (createdItem.slug) {
            article.slug = createdItem.slug;
          }
          this.save();
        }
      }
    } catch (err) {
      console.warn('Failed to post article to backend API', err);
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

    return {
      totalArticles,
      publishedCount: publishedArticles.length,
      draftCount: draftArticles.length,
      totalViews,
      totalCategories,
      topArticles,
      recentArticles,
      yearlyData,
    };
  }
}

export const articlesService = ArticlesService.getInstance();
