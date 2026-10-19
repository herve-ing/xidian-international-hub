import { currentAccount } from './accounts.ts';
import { publicArticles } from './club-publishing.ts';
const key = 'xidian-article-likes-v1';
function likes(): { articleId: string; accountId: string }[] {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(data)
      ? data.filter((x) => x && typeof x.articleId === 'string' && typeof x.accountId === 'string')
      : [];
  } catch {
    return [];
  }
}
function published(id: string) {
  const a = publicArticles().find((a) => a.id === id);
  if (!a) throw new Error('article');
  return a;
}
export function articleReaction(id: string) {
  const all = likes().filter((x) => x.articleId === id);
  return {
    count: new Set(all.map((x) => x.accountId)).size,
    liked: all.some((x) => x.accountId === currentAccount()?.id),
  };
}
export function toggleArticleLike(id: string) {
  published(id);
  const a = currentAccount();
  if (!a || !['student', 'club_leader', 'professor'].includes(a.role)) throw new Error('signin');
  const all = likes(),
    liked = all.some((x) => x.articleId === id && x.accountId === a.id);
  const next = all.filter((x) => !(x.articleId === id && x.accountId === a.id));
  if (!liked) next.push({ articleId: id, accountId: a.id });
  localStorage.setItem(key, JSON.stringify(next));
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function')
    window.dispatchEvent(new Event('xidian-article-reactions'));
  return articleReaction(id);
}
export function articleShare(id: string, base: string) {
  const article = published(id),
    url = new URL(base);
  url.hash = '/union?tab=actu&article=' + encodeURIComponent(id);
  return {
    title: article.title,
    text:
      article.title +
      '\n\n' +
      article.body +
      '\n\nPrototype local : l’article lié est accessible uniquement dans le navigateur où il a été publié. / Local prototype: the linked article is available only in the browser where it was published.',
    url: url.href,
  };
}
