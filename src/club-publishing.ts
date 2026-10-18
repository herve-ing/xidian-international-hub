import { clubs, customClubsKey, reloadClubs, type Club } from './clubs.ts';
import {
  currentAccount,
  canAccessISO,
  managedClubIds,
  assignClubLeadership,
  studentAccounts,
} from './accounts.ts';
export type ArticleMedia = { id: string; kind: 'image' | 'video'; name: string; caption: string };
export type ClubArticle = {
  id: string;
  clubId: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  language: string;
  status: 'draft' | 'published';
  media: ArticleMedia[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};
const articleKey = 'xidian-club-articles-v1';
function allArticles(): ClubArticle[] {
  try {
    const a = JSON.parse(localStorage.getItem(articleKey) || '[]');
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
export function publicArticles(clubId = '') {
  return allArticles()
    .filter((a) => a.status === 'published' && (!clubId || a.clubId === clubId))
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
}
export function editableArticles() {
  const a = currentAccount();
  return allArticles()
    .filter((p) => managedClubIds(a).includes(p.clubId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function authorize(clubId: string) {
  const a = currentAccount();
  if (!a || !clubs.some((c) => c.id === clubId) || !managedClubIds(a).includes(clubId))
    throw new Error('forbidden');
  return a;
}
export function saveArticle(
  input: Pick<ClubArticle, 'clubId' | 'title' | 'body' | 'language' | 'status' | 'media'> & {
    id?: string;
  },
) {
  const actor = authorize(input.clubId),
    all = allArticles(),
    previous = input.id ? all.find((a) => a.id === input.id) : undefined;
  if (input.id && !previous) throw new Error('article');
  if (previous) authorize(previous.clubId);
  if (
    !input.title.trim() ||
    input.title.length > 150 ||
    !input.body.trim() ||
    input.body.length > 15000 ||
    !['draft', 'published'].includes(input.status) ||
    !['fr', 'en', 'zh', 'ar', 'es', 'ln', 'ru', 'tr', 'ary', 'tk', 'ur'].includes(input.language)
  )
    throw new Error('invalid');
  if (
    input.media.length > 6 ||
    input.media.some((m) => !m.id || !['image', 'video'].includes(m.kind) || m.caption.length > 250)
  )
    throw new Error('media');
  const now = new Date().toISOString(),
    article: ClubArticle = {
      id: previous?.id || crypto.randomUUID(),
      clubId: input.clubId,
      authorId: previous?.authorId || actor.id,
      authorName: previous?.authorName || actor.displayName,
      title: input.title.trim(),
      body: input.body.trim(),
      language: input.language,
      status: input.status,
      media: input.media.map((m) => ({ ...m })),
      createdAt: previous?.createdAt || now,
      updatedAt: now,
      publishedAt: input.status === 'published' ? previous?.publishedAt || now : undefined,
    };
  localStorage.setItem(
    articleKey,
    JSON.stringify([...all.filter((a) => a.id !== article.id), article]),
  );
  return article;
}
export function deleteArticle(id: string) {
  const all = allArticles(),
    article = all.find((a) => a.id === id);
  if (!article) throw new Error('article');
  authorize(article.clubId);
  localStorage.setItem(articleKey, JSON.stringify(all.filter((a) => a.id !== id)));
  return article.media;
}
export function createClub(input: {
  name: string;
  zh: string;
  category: Club['category'];
  description: string;
  activity: string;
  kit: string;
  leaderId?: string;
}) {
  if (!canAccessISO(currentAccount())) throw new Error('forbidden');
  const name = input.name.trim();
  if (
    !name ||
    name.length > 90 ||
    !input.description.trim() ||
    input.description.length > 1200 ||
    !input.activity.trim() ||
    input.activity.length > 500 ||
    input.kit.length > 500 ||
    !['sport', 'creative', 'academic'].includes(input.category)
  )
    throw new Error('invalid');
  if (clubs.some((c) => c.name.toLocaleLowerCase() === name.toLocaleLowerCase()))
    throw new Error('duplicate');
  if (input.leaderId && !studentAccounts().some((a) => a.id === input.leaderId))
    throw new Error('student');
  const triple = (s: string): [string, string, string] => [s.trim(), s.trim(), s.trim()];
  const club: Club = {
    id: 'custom-' + crypto.randomUUID(),
    name,
    zh: input.zh.trim(),
    category: input.category,
    format: input.category === 'sport' ? 'team' : input.category === 'creative' ? 'art' : 'math',
    symbol: name.slice(0, 2).toUpperCase(),
    tone: input.category === 'sport' ? 'sage' : input.category === 'creative' ? 'rose' : 'blue',
    aliases: name,
    description: triple(input.description),
    activity: triple(input.activity),
    kit: triple(input.kit),
  };
  const previous = localStorage.getItem(customClubsKey);
  localStorage.setItem(
    customClubsKey,
    JSON.stringify([...clubs.filter((c) => c.id.startsWith('custom-')), club]),
  );
  reloadClubs();
  try {
    if (input.leaderId) {
      const leader = studentAccounts().find((a) => a.id === input.leaderId)!;
      assignClubLeadership(leader.id, [...(leader.clubIds || []), club.id]);
    }
  } catch (error) {
    if (previous === null) localStorage.removeItem(customClubsKey);
    else localStorage.setItem(customClubsKey, previous);
    reloadClubs();
    throw error;
  }
  return club;
}
// Files remain in IndexedDB, never in source code or GitHub. No remote upload occurs.
function mediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('xidian-club-media-v1', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('media');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export function validateMedia(file: Pick<File, 'type' | 'size'>) {
  if (
    ![
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/ogg',
    ].includes(file.type)
  )
    throw new Error('type');
  if (file.size > (file.type.startsWith('video/') ? 50 : 8) * 1024 * 1024) throw new Error('size');
}
export async function storeMedia(file: File, clubId: string): Promise<ArticleMedia> {
  authorize(clubId);
  validateMedia(file);
  const id = crypto.randomUUID(),
    db = await mediaDB();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('media', 'readwrite');
      tx.objectStore('media').put(file, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
  return {
    id,
    kind: file.type.startsWith('image/') ? 'image' : 'video',
    name: file.name,
    caption: '',
  };
}
export async function readMedia(id: string): Promise<Blob | undefined> {
  const db = await mediaDB();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('media', 'readonly'),
        req = tx.objectStore('media').get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}
