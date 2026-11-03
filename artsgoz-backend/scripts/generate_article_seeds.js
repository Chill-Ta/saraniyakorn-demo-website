const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(
  __dirname,
  '../../artsgoz-monorepo/apps/aksornsara-frontend/src/features/articles/data/articles-detail.json'
);

const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function escapeJson(val) {
  if (val === null || val === undefined) return "'[]'";
  return "'" + JSON.stringify(val).replace(/'/g, "''") + "'";
}

// Convert "art-001" to standard deterministic UUID "a0000000-0000-0000-0000-000000000001"
function idToUuid(id) {
  const match = id.match(/art-(\d+)/i);
  if (match) {
    const num = match[1].padStart(12, '0');
    return `a0000000-0000-0000-0000-${num}`;
  }
  return `a0000000-0000-0000-0000-${id.replace(/\D/g, '').padStart(12, '0')}`;
}

const lines = [];
lines.push('-- ============================================================================');
lines.push('-- Seeds: AksornSara Historical Articles (169 Articles from Frontend)');
lines.push('-- ============================================================================');
lines.push('');

// 1. Seed Categories
lines.push('-- 1. SEED CATEGORIES');
lines.push(`INSERT INTO categories (name, slug, description)
VALUES 
    ('วรรณกรรม', 'literature', 'วรรณกรรมและบทกวี'),
    ('ภาษา', 'language', 'ภาษาและภาษาศาสตร์'),
    ('วัฒนธรรม', 'culture', 'วัฒนธรรมและสังคม'),
    ('ปรัชญา', 'philosophy', 'ปรัชญาและความคิด'),
    ('วิจารณ์', 'criticism', 'บทวิจารณ์และทัศนะ'),
    ('ทั่วไป', 'general', 'บทความทั่วไป'),
    ('ปี 2026', '2026', 'บทความประจำปี 2026'),
    ('ปี 2025', '2025', 'บทความประจำปี 2025'),
    ('ปี 2024', '2024', 'บทความประจำปี 2024'),
    ('ปี 2023', '2023', 'บทความประจำปี 2023'),
    ('ปี 2022', '2022', 'บทความประจำปี 2022'),
    ('ปี 2021', '2021', 'บทความประจำปี 2021')
ON CONFLICT (name) DO NOTHING;
`);

lines.push('-- 2. SEED ARTICLES');
lines.push(`INSERT INTO articles (
    id, slug, title, subtitle, excerpt, content, cover_image_url, image_url,
    author_name, writer_credit, proofreader_credit, illustrator_credit,
    category, categories, category_ids, category_items, tags, status, visibility,
    published_at, views_count, view_count, "references", legacy_url, legacy_year
) VALUES`);

const articleEntries = Object.values(rawData);
const values = [];

for (const a of articleEntries) {
  const uuid = idToUuid(a.id);
  const slug = a.id; // e.g. "art-001"
  const title = a.title || 'ไม่มีชื่อบทความ';
  const excerpt = a.excerpt || '';
  const content = a.content || `<p>${excerpt}</p>`;
  const coverImage = a.coverImage || a.imageUrl || '';
  const author = a.author || 'ชมรมสาราณียกร';
  const proofreader = a.proofreader || '';
  const illustrator = a.illustrator || '';
  const category = a.category ? (a.category.startsWith('ปี ') ? a.category : `ปี ${a.category}`) : 'ปี 2026';
  const categoriesJson = [category];
  const tagsJson = [category, 'สาราณียกร'];
  const referencesJson = Array.isArray(a.references) ? a.references : [];
  const legacyUrl = a.url || '';
  const legacyYear = a.year || '';

  // Approximate publish date from year e.g. "2021-01-01 00:00:00+00"
  const pubYear = a.year || '2026';
  const publishedAt = `'${pubYear}-01-01 00:00:00+00'::timestamptz`;

  values.push(`(
    ${escapeSql(uuid)}::uuid,
    ${escapeSql(slug)},
    ${escapeSql(title)},
    NULL,
    ${escapeSql(excerpt)},
    ${escapeSql(content)},
    ${escapeSql(coverImage)},
    ${escapeSql(coverImage)},
    ${escapeSql(author)},
    ${escapeSql(author)},
    ${escapeSql(proofreader)},
    ${escapeSql(illustrator)},
    ${escapeSql(category)},
    ${escapeJson(categoriesJson)},
    ${escapeJson(categoriesJson)},
    '[]'::text,
    ${escapeJson(tagsJson)},
    'published'::article_status,
    'public',
    ${publishedAt},
    0,
    0,
    ${escapeJson(referencesJson)},
    ${escapeSql(legacyUrl)},
    ${escapeSql(legacyYear)}
  )`);
}

lines.push(values.join(',\n'));
lines.push(`ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    cover_image_url = EXCLUDED.cover_image_url,
    image_url = EXCLUDED.image_url,
    author_name = EXCLUDED.author_name,
    writer_credit = EXCLUDED.writer_credit,
    proofreader_credit = EXCLUDED.proofreader_credit,
    illustrator_credit = EXCLUDED.illustrator_credit,
    category = EXCLUDED.category,
    categories = EXCLUDED.categories,
    category_ids = EXCLUDED.category_ids,
    tags = EXCLUDED.tags,
    "references" = EXCLUDED."references",
    legacy_url = EXCLUDED.legacy_url,
    legacy_year = EXCLUDED.legacy_year;
`);

const outPath = path.resolve(__dirname, '../seeds/aksornsara_articles.sql');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`Generated ${values.length} articles seed into ${outPath}`);

